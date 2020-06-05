<template>
    <div class="withdraw-ftm-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="withdraw-ftm-confirmation"
            send-button-label="Withdraw"
            password-label="Please enter your wallet password to withdraw your FTM"
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
                <ol class="f-data-layout">
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Send To</div>
                            <div class="col break-word">
                                {{ tx.to }}
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">From</div>
                            <div class="col break-word">
                                {{ currentAccount.address }}
                                <span class="f-row-label">( {{ toFTM(currentAccount.balance) }} FTM )</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Amount</div>
                            <div class="col">
                                0
                            </div>
                        </div>
                    </li>
                </ol>
            </template>
        </tx-confirmation>
    </div>
</template>

<script>
import { toFTM } from '../../utils/transactions.js';
import { mapGetters } from 'vuex';
import sfcUtils from 'fantom-ledgerjs/src/sfc-utils.js';
import TxConfirmation from '../TxConfirmation/TxConfirmation.vue';

export default {
    name: 'WithdrawFTMConfirmation',

    components: { TxConfirmation },

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
                '0x30D40'
            );
        },

        onSendTransactionSuccess(_data) {
            this.$emit('change-component', {
                to: 'transaction-success-message',
                from: 'withdraw-ftm-confirmation',
                data: {
                    tx: _data.data.sendTransaction.hash,
                    successMessage: 'Undelegation Successful',
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
