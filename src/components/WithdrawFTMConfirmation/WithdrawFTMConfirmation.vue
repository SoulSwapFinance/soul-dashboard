<template>
    <div class="withdraw-ftm-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="withdraw-ftm-confirmation"
            send-button-label="Withdraw"
            password-label="Please enter your wallet password to withdraw your FTM"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h2 class="cont-with-back-btn">
                <span>Withdraw delegated FTM - Confirmation</span>
                <button type="button" class="btn light" @click="onBackBtnClick">Back</button>
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

                <!--                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Transaction Value</div>
                    <div class="col break-word">0</div>
                </div>-->
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0">
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Transaction Value</div>
                            <div class="col">
                                0
                            </div>
                        </div>
                    </li>
                </ledger-confirmation-content>
            </template>
        </tx-confirmation>
    </div>
</template>

<script>
import { toFTM } from '../../utils/transactions.js';
import { mapGetters } from 'vuex';
import sfcUtils from 'fantom-ledgerjs/src/sfc-utils.js';
import TxConfirmation from '../TxConfirmation/TxConfirmation.vue';
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
        stakerId: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            tx: {},
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    // activated() {
    mounted() {
        this.setTx();
    },

    methods: {
        async setTx() {
            const { withdrawRequest } = this;

            if (withdrawRequest.withdrawRequestID) {
                console.log(withdrawRequest);
                this.tx = await this.$fWallet.getSFCTransactionToSign(
                    sfcUtils.withdrawPartTx(
                        parseInt(withdrawRequest.stakerID, 16),
                        parseInt(withdrawRequest.withdrawRequestID, 16)
                    ),
                    this.currentAccount.address
                );
            } else {
                throw 'Need withdrawRequestID :(';
            }
        },

        onSendTransactionSuccess(_data) {
            this.$emit('change-component', {
                to: 'transaction-success-message',
                from: 'withdraw-ftm-confirmation',
                data: {
                    tx: _data.data.sendTransaction.hash,
                    successMessage: 'Undelegation Successful',
                    continueTo: 'staking-info',
                    continueToParams: {
                        stakerId: this.stakerId,
                    },
                },
            });
        },

        onBackBtnClick() {
            this.$emit('change-component', {
                to: 'staking-info',
                from: 'withdraw-ftm-confirmation',
                data: {
                    withdrawRequest: this.withdrawRequest,
                    stakerId: this.stakerId,
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
