<template>
    <div class="defi-borrow-confirmation">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            card-off
            no-previous-button
            :send-button-label="sendButtonLabel"
            :password-label="passwordLabel"
            :gas-limit="gasLimit"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h1 class="with-back-btn">
                <f-back-button :route-name="backButtonRoute" /> Confirmation
                <template v-if="params.steps">({{ params.step }}/{{ params.steps }})</template>
            </h1>

            <div class="info">
                <div v-if="increasedDebt > 0">
                    You’re adding
                    <span class="inc-desc-collateral"
                        >{{ increasedDebt.toFixed(debtDecimals) }} {{ cTokenSymbol }}</span
                    >
                </div>
                <div v-else-if="decreasedDebt > 0">
                    <template v-if="params.step === 1">You’re allowing</template>
                    <template v-else>You’re removing</template>
                    <span class="inc-desc-collateral">
                        {{ decreasedDebt.toFixed(debtDecimals) }} {{ cTokenSymbol }}</span
                    >
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
        <template v-else>
            <f-message type="info" role="alert" class="big"> Adjust {{ cTokenSymbol }} first, please. </f-message>
        </template>
    </div>
</template>

<script>
import TxConfirmation from '../../components/TxConfirmation/TxConfirmation.vue';
import LedgerConfirmationContent from '../../components/LedgerConfirmationContent/LedgerConfirmationContent.vue';
import { GAS_LIMITS, Web3 } from '../../plugins/fantom-web3-wallet.js';
import { mapGetters } from 'vuex';
import { toFTM } from '../../utils/transactions.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import appConfig from '../../../app.config.js';
import defiUtils from 'fantom-ledgerjs/src/defi-utils.js';

/**
 * Common component for DefiBorrowFUSDConfirmation a DefiManageBorrowConfirmation
 */
export default {
    name: 'DefiBorrowConfirmation',

    components: { FMessage, FBackButton, LedgerConfirmationContent, TxConfirmation },

    props: {
        /** Address of smart contract. */
        contractAddress: {
            type: String,
            default: appConfig.liquidityPoolContract,
        },
        /**  */
        compName: {
            type: String,
            default: 'defi-borrow-fusd',
        },
        /** Tells which token to use in confirmation process. */
        tokenSymbol: {
            type: String,
            default: 'FUSD',
        },
        /** Number of decimals of debt. */
        debtDecimals: {
            type: Number,
            default: 2,
        },
        /** Router params */
        params: {
            type: Object,
            default() {
                return {};
            },
            required: true,
        },
    },

    data() {
        return {
            tx: {},
            gasLimit: GAS_LIMITS.default,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        hasCorrectParams() {
            return this.params.currDebt !== this.params.debt;
        },

        increasedDebt() {
            return this.params.currDebt - this.params.debt;
        },

        decreasedDebt() {
            return this.params.debt - this.params.currDebt;
        },

        sendButtonLabel() {
            let label = '';

            if (this.params.step === 1) {
                label = 'Continue to the next step';
            } else if (this.increasedDebt > 0) {
                if (this.compName === 'defi-borrow-fusd') {
                    label = 'Mint now';
                } else {
                    label = 'Borrow now';
                }
            } else {
                label = 'Repay now';
            }

            return label;
        },

        passwordLabel() {
            let label = '';

            if (this.params.step === 1) {
                label = 'Please enter your wallet password to allow your tokens';
            } else if (this.params.debt > 0) {
                label = 'Please enter your wallet password to rebalance your debt';
            } else {
                label = 'Please enter your wallet password to add your debt';
            }

            return label;
        },

        backButtonRoute() {
            const parentNode = getAppParentNode(`${this.compName}-confirmation`);

            return parentNode ? parentNode.route : '';
        },

        cTokenSymbol() {
            return this.$defi.getTokenSymbol({ symbol: this.tokenSymbol });
        },
    },

    created() {
        if (!this.hasCorrectParams) {
            // redirect to <this.compName>
            setTimeout(() => {
                this.$router.replace({ name: this.compName });
            }, 3000);
        } else {
            this.setTx();
        }
    },

    methods: {
        async setTx() {
            /** @type {DefiToken} */
            const token = await this.$defi.fetchTokens(this.currentAccount.address, this.tokenSymbol);
            const { contractAddress } = this;
            let txToSign;

            if (!token) {
                return;
            }

            if (this.increasedDebt > 0) {
                txToSign = defiUtils.defiBorrowTokenTx(
                    contractAddress,
                    token.address,
                    Web3.utils.toHex(this.$defi.shiftDecPointRight(this.increasedDebt.toString(), token.decimals))
                );
            } else if (this.params.step === 1) {
                txToSign = defiUtils.erc20ApproveAmountTx(
                    token.address,
                    contractAddress,
                    Web3.utils.toHex(this.$defi.shiftDecPointRight(this.decreasedDebt.toString(), token.decimals))
                );
            } else {
                txToSign = defiUtils.defiRepayTokenTx(
                    contractAddress,
                    token.address,
                    Web3.utils.toHex(this.$defi.shiftDecPointRight(this.decreasedDebt.toString(), token.decimals))
                    // parseInt(this.decreasedDebt * Math.pow(10, token.decimals))
                );
            }

            this.tx = await this.$fWallet.getDefiTransactionToSign(
                txToSign,
                this.currentAccount.address,
                GAS_LIMITS.defi
            );
        },

        onSendTransactionSuccess(_data) {
            const params = {
                tx: _data.data.sendTransaction.hash,
                title: 'Success',
                continueTo: this.compName,
            };
            let transactionSuccessComp = `${this.compName}-transaction-success-message`;

            if (this.params.step === 1) {
                params.continueTo = `${this.compName}-confirmation2`;
                params.continueToParams = { ...this.params, step: 2 };
                params.autoContinueToAfter = 2000;
            } else if (this.params.step === 2) {
                transactionSuccessComp = `${this.compName}-transaction-success-message2`;
            }

            this.$router.replace({
                name: transactionSuccessComp,
                params,
            });
        },

        /**
         * Re-target `'change-component'` event.
         *
         * @param {object} _data
         */
        onChangeComponent(_data) {
            let transactionRejectComp = `${this.compName}-transaction-reject-message`;

            if (_data.to === 'transaction-reject-message') {
                if (this.params.step === 2) {
                    transactionRejectComp = `${this.compName}-transaction-reject-message2`;
                }

                this.$router.replace({
                    name: transactionRejectComp,
                    params: {
                        continueTo: this.compName,
                    },
                });
            }
        },

        toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
