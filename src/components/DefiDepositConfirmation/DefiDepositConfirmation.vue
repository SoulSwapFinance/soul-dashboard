<template>
    <div class="defi-deposit-confirmation">
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
                <div v-if="increasedCollateral > 0">
                    You’re adding
                    <span class="inc-desc-collateral">
                        {{ increasedCollateral.toFixed(collateralDecimals) }} {{ cTokenSymbol }}
                    </span>
                    to your collateral
                </div>
                <div v-else-if="decreasedCollateral > 0">
                    <template v-if="params.step === 1">
                        You’re allowing {{ decreasedCollateral.toFixed(collateralDecimals) }} {{ cTokenSymbol }}
                    </template>
                    <template v-else>
                        You’re removing
                        <span class="inc-desc-collateral">
                            {{ decreasedCollateral.toFixed(collateralDecimals) }} {{ cTokenSymbol }}
                        </span>
                        from your collateral
                    </template>
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
        <template v-else>
            <f-message type="info" role="alert" class="big">
                Adjust collateral first, please.
            </f-message>
        </template>
    </div>
</template>

<script>
import TxConfirmation from '../../components/TxConfirmation/TxConfirmation.vue';
import LedgerConfirmationContent from '../../components/LedgerConfirmationContent/LedgerConfirmationContent.vue';
import { GAS_LIMITS, Web3 } from '../../plugins/fantom-web3-wallet.js';
import { mapGetters } from 'vuex';
import defiUtils from 'fantom-ledgerjs/src/defi-utils.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import appConfig from '../../../app.config.js';

/**
 * Common component for DefiManageCollateralConfirmation a DefiManageDepositConfirmation
 */
export default {
    name: 'DefiDepositConfirmation',

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
            default: 'defi-manage-collateral',
        },
        /** Tells which token to use in confirmation process. */
        tokenSymbol: {
            type: String,
            default: 'FTM',
        },
        /** Number of decimals of collateral. */
        collateralDecimals: {
            type: Number,
            default: 2,
        },
        /**
         * Router params.
         *
         * @type {{collateral: number, currCollateral: number, address: string}}
         */
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
            return this.params.currCollateral !== this.params.collateral;
        },

        increasedCollateral() {
            return this.params.currCollateral - this.params.collateral;
        },

        decreasedCollateral() {
            return this.params.collateral - this.params.currCollateral;
        },

        sendButtonLabel() {
            let label = '';

            if (this.params.step === 1) {
                label = 'Continue to the next step';
            } else if (this.params.collateral > 0) {
                label = 'Rebalance now';
            } else {
                label = 'Add collateral';
            }

            return label;
        },

        passwordLabel() {
            let label = '';

            if (this.params.step === 1) {
                label = 'Please enter your wallet password to allow your tokens';
            } else if (this.params.collateral > 0) {
                label = 'Please enter your wallet password to rebalance your collateral';
            } else {
                label = 'Please enter your wallet password to add your collateral';
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
            // redirect to <defi-deposit>
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

            if (this.params.step === 1) {
                txToSign = defiUtils.erc20ApproveAmountTx(
                    token.address,
                    contractAddress,
                    Web3.utils.toHex(this.$defi.shiftDecPointRight(this.decreasedCollateral.toString(), token.decimals))
                );
            } else if (this.increasedCollateral > 0) {
                txToSign = defiUtils.defiDepositTokenTx(
                    contractAddress,
                    token.address,
                    Web3.utils.toHex(this.$defi.shiftDecPointRight(this.increasedCollateral.toString(), token.decimals))
                );
            } else {
                txToSign = defiUtils.defiWithdrawDepositedTokenTx(
                    contractAddress,
                    token.address,
                    Web3.utils.toHex(this.$defi.shiftDecPointRight(this.decreasedCollateral.toString(), token.decimals))
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

        // toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
