<template>
    <div class="delegation-unlock-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="delegation-unlock-confirmation"
            send-button-label="Unlock"
            password-label="Please enter your wallet password to unlock your delegated FTM"
            set-tmp-pwd
            :tmp-pwd-code="tmpPwdCode"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h2 class="cont-with-back-btn">
                <span>
                    Unlock FTM - Confirmation <span class="f-steps"><b>2</b> / 3</span>
                </span>
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
                    <div class="col-3 f-row-label">Unlock Amount</div>
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
import LedgerConfirmationContent from '../LedgerConfirmationContent/LedgerConfirmationContent.vue';
import { getUniqueId } from '@/utils';

export default {
    name: 'DelegationUnlockConfirmation',

    components: { LedgerConfirmationContent, TxConfirmation },

    props: {
        /** `accountInfo` object from `UnstakeFTM` component. */
        accountInfo: {
            type: Object,
            default() {
                return {};
            },
        },
        /** Amount of FTM tokens to unstake */
        amount: {
            type: Number,
            default: 1,
        },
        /** Unlock maximal amount of FTM tokens */
        undelegateMax: {
            type: Boolean,
            default: false,
        },
        /***/
        stakerId: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            tx: {},
            tmpPwdCode: '',
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
            const stakerId = parseInt(this.stakerId, 16);
            console.log(this.amount, this.undelegateMax, this.$fWallet.toWei(this.amount));

            this.tmpPwdCode = getUniqueId();

            this.tx = await this.$fWallet.getSFCTransactionToSign(
                sfcUtils.unlockDelegationTx(stakerId, this.$fWallet.toWei(this.amount)),
                this.currentAccount.address
            );
        },

        onSendTransactionSuccess(_data) {
            this.$emit('change-component', {
                to: 'transaction-success-message',
                from: 'delegation-unlock-confirmation',
                data: {
                    tx: _data.data.sendTransaction.hash,
                    successMessage: 'Unlock Successful',
                    continueTo: 'unstake-confirmation',
                    continueToParams: {
                        accountInfo: this.accountInfo,
                        amount: this.amount,
                        undelegateMax: this.undelegateMax,
                        stakerId: this.stakerId,
                        tmpPwdCode: this.tmpPwdCode,
                    },
                },
            });
        },

        onBackBtnClick() {
            this.$emit('change-component', {
                to: 'unstake-f-t-m',
                from: 'delegation-unlock-confirmation',
                data: {
                    accountInfo: this.accountInfo,
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
