<template>
    <div class="delegation-lock-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="delegation-lock-confirmation"
            send-button-label="Lock"
            password-label="Please enter your wallet password to lock delegation"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h2 class="cont-with-back-btn">
                <span>
                    Lock Delegation - Confirmation <span class="f-steps"><b>2</b> / 2</span>
                </span>
                <button type="button" class="btn light" @click="onBackBtnClick">Back</button>
            </h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Validator</div>
                    <div class="col break-word">{{ validatorName }}, {{ stakerId | formatHexToInt }}</div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">From</div>
                    <div class="col break-word">
                        {{ currentAccount.address }}
                        <!--<span class="f-row-label">( {{ toFTM(currentAccount.balance) }} FTM )</span>-->
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Lock Delegation Until</div>
                    <div class="col break-word">{{ lockedUntil }} ({{ lockedUntilDays }} days)</div>
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import sfcUtils from 'fantom-ledgerjs/src/sfc-utils.js';
import TxConfirmation from '@/components/TxConfirmation/TxConfirmation.vue';
import LedgerConfirmationContent from '@/components/LedgerConfirmationContent/LedgerConfirmationContent.vue';
import { toFTM } from '@/utils/transactions.js';
import { formatDate, timestampToDate } from '@/filters.js';

/** Day in seconds. */
const dayS = 86400;
/** Minimal lock duration in days. */
const minDays = 14;

export default {
    name: 'DelegationLockConfirmation',

    components: { LedgerConfirmationContent, TxConfirmation },

    props: {
        /***/
        stakerId: {
            type: String,
            default: '',
        },
        /***/
        lockDuration: {
            type: Number,
            default: 0,
        },
        /** Delegation amount to be locked */
        amount: {
            type: Number,
            default: 0,
        },
        /** Total delegation amount (in hex) */
        amountDelegated: {
            type: String,
            default: '',
        },
        /** Lock maximal delegation amount */
        max: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            tx: {},
            validator: null,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * @return {string} Formatted date.
         */
        lockedUntil() {
            return formatDate(timestampToDate(this.now() + this.lockDuration));
        },

        lockedUntilDays() {
            return Math.floor(this.lockDuration / dayS);
        },

        validatorName() {
            const { validator } = this;

            return validator && validator.stakerInfo && validator.stakerInfo.name
                ? validator.stakerInfo.name
                : 'Unknown';
        },

        /*amountHex() {
            return this.max && this.amountDelegated ? this.amountDelegated : this.amount;
        },*/
    },

    mounted() {
        this.init();
    },

    methods: {
        async init() {
            this.validator = await this.$fWallet.getStakerById(this.stakerId);

            this.setTx();
        },

        async setTx() {
            const stakerId = parseInt(this.stakerId, 16);

            if (this.lockDuration > minDays * dayS) {
                this.tx = await this.$fWallet.getSFCTransactionToSign(
                    sfcUtils.lockupDelegationTx(stakerId, this.lockDuration, this.amount),
                    this.currentAccount.address
                );
            }
        },

        /**
         * Get current timestamp in seconds.
         *
         * @return {number}
         */
        now() {
            return Math.floor(new Date().getTime() / 1000);
        },

        onSendTransactionSuccess(_data) {
            this.$emit('change-component', {
                to: 'transaction-success-message',
                from: 'delegation-lock-confirmation',
                data: {
                    tx: _data.data.sendTransaction.hash,
                    successMessage: 'Delegation Lock Successful',
                    continueTo: 'staking-info',
                    continueToParams: {
                        stakerId: this.stakerId,
                    },
                },
            });
        },

        onBackBtnClick() {
            this.$emit('change-component', {
                to: 'delegation-lock',
                from: 'delegation-lock-confirmation',
                data: {
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
