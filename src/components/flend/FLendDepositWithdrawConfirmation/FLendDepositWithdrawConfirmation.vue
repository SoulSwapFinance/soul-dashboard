<template>
    <div class="flenddepositwithdrawconfirmation min-h-100">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            card-off
            send-button-label="Submit"
            :password-label="passwordLabel"
            :on-send-transaction-success="onSendTransactionSuccess"
            :set-tmp-pwd="activeStep === 1"
            :tmp-pwd-code="dTmpPwdCode"
            :show-cancel-button="true"
            :window-mode="true"
            class="min-h-100"
            @cancel-button-click="$emit('cancel-button-click', $event)"
        >
            <div class="confirmation-info">
                <template v-if="activeStep === 1">
                    You’re allowing
                    <span class="inc-desc-collateral">
                        <f-token-value :token="token" :value="currAmount" no-currency /> &nbsp;
                        {{ tokenSymbol }}
                    </span>
                </template>
                <div v-else>
                    <f-message v-if="!withdraw" type="info" role="alert" class="big">
                        You’re adding
                        <span class="inc-desc-collateral">
                            <f-token-value :token="token" :value="currAmount" no-currency /> &nbsp;
                            {{ tokenSymbol }}
                        </span>
                        to your deposits
                    </f-message>
                    <f-message v-else type="info" role="alert" class="big">
                        You’re removing
                        <span class="inc-desc-collateral">
                            <f-token-value :token="token" :value="currAmount" no-currency /> &nbsp;
                            {{ tokenSymbol }}
                        </span>
                        from your deposits
                    </f-message>
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
        <template v-else>
            <f-message type="info" role="alert" class="big">
                Adjust amount first, please.
            </f-message>
        </template>
    </div>
</template>

<script>
import TxConfirmation from '@/components/TxConfirmation/TxConfirmation.vue';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import LedgerConfirmationContent from '@/components/LedgerConfirmationContent/LedgerConfirmationContent.vue';
import FMessage from '@/components/core/FMessage/FMessage.vue';
import appConfig from '../../../../app.config.js';

export default {
    name: 'FLendDepositWithdrawConfirmation',

    components: { FMessage, LedgerConfirmationContent, FTokenValue, TxConfirmation },

    props: {
        currAmount: {
            type: Number,
            default: 0,
        },
        stepsCount: {
            type: Number,
            default: 0,
        },
        activeStep: {
            type: Number,
            default: 1,
        },
        compName: {
            type: String,
            default: '',
        },
        /** @type {FLendReserve} */
        reserve: {
            type: Object,
            default() {
                return {
                    erc20Info: {},
                };
            },
        },
        /** Withdraw deposit. */
        withdraw: {
            type: Boolean,
            default: false,
        },
        /** */
        tmpPwdCode: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            tx: {},
            dTmpPwdCode: '',
        };
    },

    computed: {
        hasCorrectParams() {
            return true;
        },

        passwordLabel() {
            let label = '';

            if (this.activeStep === 1) {
                label = 'Please enter your wallet password to allow your deposit';
            } else if (this.withdraw) {
                label = 'Please enter your wallet password to withdraw your deposit';
            } else {
                label = 'Please enter your wallet password to add your deposit';
            }

            return label;
        },

        /**
         * ERC20 token
         *
         * @return {ERC20Token|*}
         */
        token() {
            return this.reserve.erc20Info;
        },

        tokenSymbol() {
            return this.$defi.getTokenSymbol(this.token);
        },
    },

    created() {
        if (this.hasCorrectParams) {
            this.setTx();
        }
    },

    methods: {
        async setTx() {
            const { token } = this;
            // const contractAddress = this.$flend.contracts.lendingPool;
            // let txToSign;

            if (!token) {
                return;
            }

            // this.tx = await this.$fWallet.getDefiTransactionToSign(txToSign, this.currentAccount.address);
        },

        onSendTransactionSuccess(_data) {
            const params = {
                tx: _data.data.sendTransaction.hash,
                title: 'Success',
                continueTo: this.compName,
            };
            let transactionSuccessComp = `${this.compName}-transaction-success-message`;

            if (this.activeStep === 1) {
                params.continueTo = `${this.compName}-confirmation2`;
                params.continueToParams = { ...this.$props, activeStep: 2, tmpPwdCode: this.dTmpPwdCode };
                params.autoContinueToAfter = appConfig.settings.autoContinueToAfter;
                params.continueButtonLabel = 'Next Step';
            } else if (this.activeStep === 2) {
                transactionSuccessComp = `${this.compName}-transaction-success-message2`;
                params.continueTo = 'hide-window';
                params.continueButtonLabel = 'Close';
                // params.continueToParams = { token: { ...this.token } };
            }

            this.$emit('change-component', {
                to: transactionSuccessComp,
                data: { ...params, cardOff: true, windowMode: true },
            });
        },
    },
};
</script>

<style scoped></style>
