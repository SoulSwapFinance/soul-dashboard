<template>
    <div class="withdraw-ftm-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="withdraw-ftm-confirmation"
            send-button-label="Withdraw"
            password-label="Please enter your wallet password to withdraw your FTM"
            :gas-limit="gasLimit"
            :on-send-transaction-success="onSendTransactionSuccess"
            :on-go-back="onGoBack"
            @change-component="onChangeComponent"
        >
            <h2>
                Withdraw delegated FTM - Confirmation
            </h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Validator</div>
                    <div class="col break-word">
                        {{ accountInfo.stakerInfo.stakerInfo.name }}, {{ parseInt(accountInfo.stakerInfo.id) }}
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">From</div>
                    <div class="col break-word">
                        {{ currentAccount.address }}
                        <span class="f-row-label">( {{ toFTM(currentAccount.balance) }} FTM )</span>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Amount</div>
                    <div class="col break-word">{{ amount }}</div>
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
    </div>
</template>

<script>
import { toFTM } from '../../utils/transactions.js';
import { mapGetters } from 'vuex';
import sfcUtils from 'fantom-ledgerjs/src/sfc-utils.js';
import TxConfirmation from '../TxConfirmation/TxConfirmation.vue';
import { GAS_LIMITS } from '../../plugins/fantom-web3-wallet.js';
import LedgerConfirmationContent from '../LedgerConfirmationContent/LedgerConfirmationContent.vue';

export default {
    name: 'WithdrawFTMConfirmation',

    components: { LedgerConfirmationContent, TxConfirmation },

    props: {
        /** `accountInfo` object from `UnstakeFTM` component. */
        accountInfo: {
            type: Object,
            default() {
                return {};
            },
        },
        /** Amount of FTM tokens to withdraw */
        amount: {
            type: Number,
            default: 1,
        },
        /** `withdrawRequest` object from `WithdrawRequestList` component. */
        withdrawRequest: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    data() {
        return {
            tx: {},
            gasLimit: GAS_LIMITS.withdraw,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    activated() {
        this.setTx();
    },

    methods: {
        async setTx() {
            const { withdrawRequest } = this;

            this.tx = await this.$fWallet.getSFCTransactionToSign(
                withdrawRequest.withdrawRequestID
                    ? sfcUtils.withdrawPartTx(parseInt(withdrawRequest.withdrawRequestID, 16))
                    : sfcUtils.withdrawDelegationTx(),
                this.currentAccount.address,
                GAS_LIMITS.withdraw
            );
        },

        onSendTransactionSuccess(_data) {
            this.$emit('change-component', {
                to: 'transaction-success-message',
                from: 'withdraw-ftm-confirmation',
                data: {
                    tx: _data.data.sendTransaction.hash,
                    successMessage: 'Undelegation Successful',
                    continueTo: 'account-history',
                },
            });
        },

        onGoBack() {
            this.$emit('change-component', {
                to: 'staking-info',
                from: 'withdraw-ftm-confirmation',
                data: {
                    withdrawRequest: this.withdrawRequest,
                },
            });
        },

        /**
         * Re-target `'change-component'` event.
         *
         * @param {object} _data
         */
        onChangeComponent(_data) {
            this.$emit('change-component', _data);
        },

        toFTM,
    },
};
</script>
