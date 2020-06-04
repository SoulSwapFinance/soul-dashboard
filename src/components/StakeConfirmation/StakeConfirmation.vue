<template>
    <div class="stake-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="stake-confirmation"
            password-label="Please enter your wallet password to delegate your FTM"
            send-button-label="Delegate"
            :on-send-transaction-success="onSendTransactionSuccess"
            :on-go-back="onGoBack"
            @change-component="onChangeComponent"
        >
            <h2>
                Delegate FTM - Confirmation <span class="f-steps"><b>2</b> / 2</span>
            </h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Validator</div>
                    <div class="col break-word">{{ stakeData.name }}, {{ parseInt(stakeData.id) }}</div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send From</div>
                    <div class="col break-word">
                        {{ currentAccount.address }}
                        <span class="f-row-label">
                            ( {{ toFTM(currentAccount.balance) }} FTM
                            <template v-if="currentAccount.name">, {{ currentAccount.name }}</template> )
                        </span>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Amount</div>
                    <div class="col break-word">{{ stakeData.amount }}</div>
                </div>
            </div>

            <template #window-content>
                <ol class="f-data-layout">
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Send To</div>
                            <div class="col break-word">
                                {{ stakeData.tx.to }}
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Send From</div>
                            <div class="col break-word">
                                {{ currentAccount.address }}
                                <span class="f-row-label">
                                    ( {{ toFTM(currentAccount.balance) }} FTM
                                    <template v-if="currentAccount.name">, {{ currentAccount.name }}</template> )
                                </span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Amount</div>
                            <div class="col">{{ stakeData.amount }}</div>
                        </div>
                    </li>
                    <!--
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Max Fee</div>
                            <div class="col">{{ stakeData.tx.fee }}</div>
                        </div>
                    </li>
                    -->
                </ol>
            </template>
        </tx-confirmation>
    </div>
</template>

<script>
import { toFTM } from '../../utils/transactions.js';
import { mapGetters } from 'vuex';
import TxConfirmation from '../TxConfirmation/TxConfirmation.vue';

export default {
    name: 'StakeConfirmation',

    components: { TxConfirmation },

    props: {
        /** Data sent from StakeForm component. Info about transaction, validator and amount of FTM. */
        stakeData: {
            type: Object,
            default() {
                return {};
            },
        },
        /** Increase delegation mode. */
        increaseDelegation: {
            type: Boolean,
            default: false,
        },
        /** Validator info. */
        stakerInfo: {
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
        setTx() {
            this.tx = this.stakeData.tx;
        },

        onSendTransactionSuccess(_data) {
            this.$emit('change-component', {
                to: 'transaction-success-message',
                from: 'stake-confirmation',
                data: {
                    tx: _data.data.sendTransaction.hash,
                    successMessage: 'Delegation Successful',
                },
            });
        },

        onGoBack() {
            this.$emit('change-component', {
                to: 'stake-form',
                from: 'stake-confirmation',
                data: {
                    increaseDelegation: this.increaseDelegation,
                    stakerInfo: this.stakerInfo,
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
