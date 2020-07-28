<template>
    <div class="defi-ftrade-confirmation">
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
                <template v-if="params.step === 1">
                    You’re allowing
                    <span class="price">{{ params.fromValue.toFixed(priceDecimals) }} {{ fromTokenSymbol }}</span>
                </template>
                <template v-else>
                    You're trading
                    <span class="price">{{ params.fromValue.toFixed(priceDecimals) }} {{ fromTokenSymbol }}</span> ->
                    <span class="price">{{ params.toValue.toFixed(priceDecimals) }} {{ toTokenSymbol }}</span>
                </template>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
        <template v-else>
            <f-message type="info" role="alert" class="big"> Trade tokens first, please. </f-message>
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
    name: 'DefiFTradeConfirmation',

    components: { FMessage, FBackButton, LedgerConfirmationContent, TxConfirmation },

    props: {
        /** Address of smart contract. */
        contractAddress: {
            type: String,
            default: appConfig.liquidityPoolContract,
        },
        /** Tells which token to use in confirmation process. */
        tokenSymbol: {
            type: String,
            default: 'FUSD',
        },
    },

    data() {
        return {
            compName: 'defi-ftrade',
            priceDecimals: 6,
            tx: {},
            gasLimit: GAS_LIMITS.default,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * @return {{fromValue: number, toValue: number, fromTokenSymbol: string, toTokenSymbol: string}}
         */
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },

        hasCorrectParams() {
            return !!this.params.fromValue;
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
            } else {
                label = 'Trade now';
            }

            return label;
        },

        passwordLabel() {
            let label = '';

            if (this.params.step === 1) {
                label = 'Please enter your wallet password to allow your tokens';
            } else {
                label = 'Please enter your wallet password to trade your tokens';
            }

            return label;
        },

        fromTokenSymbol() {
            return this.$defi.getTokenSymbol({ symbol: this.params.fromTokenSymbol });
        },

        toTokenSymbol() {
            return this.$defi.getTokenSymbol({ symbol: this.params.toTokenSymbol });
        },

        backButtonRoute() {
            const parentNode = getAppParentNode(`${this.compName}-confirmation`);

            return parentNode ? parentNode.route : '';
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
            const { contractAddress } = this;

            const { params } = this;
            const tokens = await this.$defi.fetchTokens(this.currentAccount.address, [
                params.fromTokenSymbol,
                params.toTokenSymbol,
            ]);
            const fromToken = tokens.find((_item) => _item.symbol === params.fromTokenSymbol);
            const toToken = tokens.find((_item) => _item.symbol === params.toTokenSymbol);
            let txToSign;

            console.log(
                fromToken,
                toToken,
                this.$defi.shiftDecPointRight(params.fromValue.toString(), fromToken.decimals),
                Web3.utils.toHex(this.$defi.shiftDecPointRight(params.fromValue.toString(), fromToken.decimals))
            );

            if (!fromToken || !toToken) {
                return;
            }

            if (this.params.step === 1) {
                txToSign = defiUtils.erc20ApproveAmountTx(
                    fromToken.address,
                    contractAddress,
                    Web3.utils.toHex(this.$defi.shiftDecPointRight(params.fromValue.toString(), fromToken.decimals))
                );
            } else {
                txToSign = defiUtils.defiTradeTokenTx(
                    contractAddress,
                    fromToken.address,
                    toToken.address,
                    Web3.utils.toHex(this.$defi.shiftDecPointRight(params.fromValue.toString(), fromToken.decimals))
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
