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
                        <template v-if="!lockExist"><b>2</b> / 2</template>
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
                    <div class="col break-word">{{ dAmount }}</div>
                </div>

                <f-message v-if="amountDiff > 0" type="warning"> {{ amountDiff }} FTM slashing applied </f-message>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" :max-fee="tx._fee" />
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
import FMessage from '@/components/core/FMessage/FMessage.vue';

export default {
    name: 'UnstakeConfirmation',

    components: { FMessage, LedgerConfirmationContent, TxConfirmation },

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
        /** Amount of FTM tokens to unlock. (hex number) */
        toUnlockAmount: {
            type: String,
            default: '',
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
            dAmount: this.amount,
            amountDiff: 0,
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

        lockExist() {
            return this.isLocked && !!this.toUnlockAmount;
        },
    },

    // activated() {
    mounted() {
        this.setTx();
    },

    methods: {
        async setTx() {
            const stakerId = parseInt(this.stakerId, 16);
            let amount = this.undelegateMax ? this.accountInfo.amountDelegated : this.$fWallet.toWei(this.dAmount);
            const unlockedAmount = await this.$fWallet.fetchUnlockedAmount(this.currentAccount.address, this.stakerId);

            // amount is bigger than unlocked amount
            if (unlockedAmount && this.$defi.compareBN(amount, unlockedAmount) === 1) {
                amount = unlockedAmount;
                this.dAmount = this.$fWallet.fromWei(unlockedAmount);
                this.amountDiff = this.amount - this.dAmount;
            }

            // console.log(amount, unlockedAmount, this.amount, this.dAmount, this.amountDiff);

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
