<template>
    <div class="unstake-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="unstake-confirmation"
            send-button-label="Undelegate"
            password-label="Please enter your wallet password to undelegate your FTM"
            :on-send-transaction-success="onSendTransactionSuccess"
            :on-go-back="onGoBack"
            @change-component="onChangeComponent"
        >
            <h2>
                Undelegate FTM - Confirmation <span class="f-steps"><b>2</b> / 2</span>
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
import { getRandomInt } from '../../utils';
import { GAS_LIMITS } from '../../plugins/fantom-web3-wallet.js';

export default {
    name: 'UnstakeConfirmation',

    components: { TxConfirmation },

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
            this.tx = await this.$fWallet.getSFCTransactionToSign(
                this.undelegateMax
                    ? sfcUtils.prepareToWithdrawDelegationTx()
                    : sfcUtils.prepareToWithdrawDelegationPartTx(getRandomInt(), this.amount),
                this.currentAccount.address,
                GAS_LIMITS.undelegate
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
                },
            });
        },

        onGoBack() {
            this.$emit('change-component', {
                to: 'unstake-f-t-m',
                from: 'unstake-confirmation',
                data: {
                    accountInfo: this.accountInfo,
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
