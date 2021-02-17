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
                    <f-lend-deposit-withdraw-message :token="token" :value="currAmount" :withdraw="withdraw" />
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
import FLendDepositWithdrawMessage from '@/components/flend/FLendDepositWithdrawMessage/FLendDepositWithdrawMessage.vue';
import erc20Utils from 'fantom-ledgerjs/src/erc20-utils.js';
import flendUtils from 'fantom-ledgerjs/src/flend-utils.js';
import Web3 from 'web3';
import { bShiftDP, toBigNumber } from '@/utils/bignumber.js';
import { mapGetters } from 'vuex';
import { getUniqueId } from '@/utils';

export default {
    name: 'FLendDepositWithdrawConfirmation',

    components: { FLendDepositWithdrawMessage, FMessage, LedgerConfirmationContent, FTokenValue, TxConfirmation },

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
                    asset: {},
                };
            },
        },
        /** Hex number */
        userTokenBalance: {
            type: String,
            default: '',
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
        ...mapGetters(['currentAccount']),

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
         * Defi token
         *
         * @return {DefiToken|*}
         */
        token() {
            return this.reserve.asset;
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
            const web3 = new Web3();
            const { token } = this;
            const { reserve } = this;
            const contractAddress = this.$flend.contracts.lendingPool;
            const accountAddress = this.currentAccount.address;
            let txToSign;
            let bAmount;
            let { currAmount } = this;
            const bUserTokenBalance = toBigNumber(this.userTokenBalance);

            if (!token) {
                return;
            }

            this.dTmpPwdCode = this.tmpPwdCode || getUniqueId();

            bAmount = toBigNumber(currAmount);

            if (bAmount.comparedTo(bUserTokenBalance) === 1) {
                bAmount = bUserTokenBalance;
            }

            if (this.activeStep === 1) {
                bAmount = bShiftDP(bAmount.times(1.05).abs(), token.decimals);

                txToSign = erc20Utils.erc20IncreaseAllowanceTx(
                    token.address,
                    contractAddress,
                    Web3.utils.toHex(bAmount)
                );
            } else if (this.withdraw) {
                txToSign = flendUtils.fLendWithdraw(
                    web3,
                    reserve.assetAddress,
                    Web3.utils.toHex(bShiftDP(bAmount, token.decimals)),
                    accountAddress
                );
            } else {
                txToSign = flendUtils.fLendDeposit(
                    web3,
                    reserve.assetAddress,
                    Web3.utils.toHex(bShiftDP(bAmount, token.decimals)),
                    accountAddress,
                    this.$flend.referralCode
                );
            }

            this.tx = await this.$fWallet.getFLendTransactionToSign(txToSign, accountAddress, contractAddress);
        },

        onSendTransactionSuccess(_data) {
            const params = {
                tx: _data.data.sendTransaction.hash,
                title: 'Success',
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
