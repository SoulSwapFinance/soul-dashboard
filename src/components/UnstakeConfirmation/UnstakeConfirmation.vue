<template>
    <div class="unstake-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="unstake-confirmation"
            send-button-label="Undelegate"
            password-label="Please enter your wallet password to undelegate your FTM"
            :on-send-transaction-success="onSendTransactionSuccess"
            :tmp-pwd-code="tmpPwdCode"
            @change-component="onChangeComponent"
        >
            <h2 class="cont-with-back-btn">
                <span>
                    Undelegate FTM - Confirmation
                    <span class="f-steps">
                        <template v-if="!isLocked"><b>2</b> / 2</template>
                        <template v-else><b>3</b> / 3</template>
                    </span>
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
                    <div class="col-3 f-row-label">Undelegate Amount</div>
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
import { getRandomInt } from '../../utils';
import LedgerConfirmationContent from '../LedgerConfirmationContent/LedgerConfirmationContent.vue';

export default {
    name: 'UnstakeConfirmation',

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
        /** Unstake maximal amount of FTM tokens */
        undelegateMax: {
            type: Boolean,
            default: false,
        },
        /***/
        stakerId: {
            type: String,
            default: '',
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
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * Returns `true` if delegetion is still locked.
         *
         * @return {boolean}
         */
        isLocked() {
            const { accountInfo } = this;

            return (accountInfo && accountInfo.delegation && accountInfo.delegation.isDelegationLocked) || false;
        },
    },

    // activated() {
    mounted() {
        this.setTx();
    },

    methods: {
        async setTx() {
            const stakerId = parseInt(this.stakerId, 16);
            const amount = this.undelegateMax ? this.accountInfo.amountDelegated : this.$fWallet.toWei(this.amount);

            this.tx = await this.$fWallet.getSFCTransactionToSign(
                sfcUtils.prepareToWithdrawDelegationPartTx(getRandomInt(), stakerId, amount),
                this.currentAccount.address
            );
        },

        onSendTransactionSuccess(_data) {
            this.$emit('change-component', {
                to: 'transaction-success-message',
                from: 'unstake-confirmation',
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
                to: 'unstake-f-t-m',
                from: 'unstake-confirmation',
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
