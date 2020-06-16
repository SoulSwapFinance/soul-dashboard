<template>
    <div class="tx-confirmation">
        <f-card class="f-card-double-padding f-data-layout">
            <slot></slot>

            <ledger-message :error="error" @ledger-status-code="onLedgerStatusCode" />

            <transaction-confirmation-form
                :error-message="errorMsg"
                :show-password-field="!currentAccount.isLedgerAccount"
                :password-label="passwordLabel"
                :send-button-label="sendButtonLabel"
                @f-form-submit="onFFormSubmit"
                @go-back="_onGoBack"
            />
        </f-card>

        <f-window
            v-if="currentAccount.isLedgerAccount"
            ref="confirmationWindow"
            modal
            title="Transaction Confirmation"
            style="max-width: 800px;"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
        >
            <!--                <icon data="@/assets/svg/nano-s-confirm-tx.svg" width="300" height="91" />-->
            <div class="align-center"><img src="img/nano-s-confirm-tx.png" alt="fantom nano device" /><br /><br /></div>

            <p class="align-center">Please confirm this transaction on your Ledger device:</p>

            <slot name="window-content"></slot>
        </f-window>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import FWindow from '../core/FWindow/FWindow.vue';
import LedgerMessage from '../LedgerMessage/LedgerMessage.vue';
import TransactionConfirmationForm from '../forms/TransactionConfirmationForm.vue';
import { mapGetters } from 'vuex';
import gql from 'graphql-tag';
import { U2FStatus } from '../../plugins/fantom-nano.js';
import { UPDATE_ACCOUNT_BALANCE } from '../../store/actions.type.js';
import { GAS_LIMITS } from '../../plugins/fantom-web3-wallet.js';

/**
 * Base component for other 'transaction confirmation and send' components.
 */
export default {
    name: 'TxConfirmation',

    components: { TransactionConfirmationForm, LedgerMessage, FWindow, FCard },

    props: {
        /** Transaction object to send */
        tx: {
            type: Object,
            default() {
                return null;
            },
            required: true,
        },
        /** Name of confirmation component in cebab case */
        confirmationCompName: {
            type: String,
            default: '',
        },
        /** Name of component in cebab case */
        goBackCompName: {
            type: String,
            default: '',
        },
        /** Label for button in TransactionConfirmationForm component */
        sendButtonLabel: {
            type: String,
            default: '',
        },
        /** Label for password field in TransactionConfirmationForm component */
        passwordLabel: {
            type: String,
            default: '',
        },
        /** Transaction's gas limit */
        gasLimit: {
            type: String,
            default: GAS_LIMITS.default,
        },
        /**
         * Function called when transaction was successful
         * @param {object} _data
         */
        onSendTransactionSuccess: {
            type: Function,
            default: null,
        },
        /** Function called when 'previous' button was pressed */
        onGoBack: {
            type: Function,
            default: null,
        },
    },

    data() {
        return {
            errorMsg: '',
            error: null,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    mounted() {
        console.log('gasLimit', this.gasLimit);
    },

    methods: {
        sendTransaction(_rawTransaction) {
            this.$apollo
                .mutate({
                    mutation: gql`
                        mutation($tx: Bytes!) {
                            sendTransaction(tx: $tx) {
                                hash
                                from
                                to
                            }
                        }
                    `,
                    variables: {
                        tx: _rawTransaction,
                    },
                })
                .then((_data) => {
                    if (this.onSendTransactionSuccess) {
                        this.onSendTransactionSuccess(_data);
                    }
                })
                .catch((_error) => {
                    this.errorMsg = _error;
                });
        },

        async onFFormSubmit(_event) {
            const { currentAccount } = this;
            const fWallet = this.$fWallet;
            const pwd = _event.detail.data.pwd;
            let rawTx = null;

            if (currentAccount && this.tx && this.tx.to) {
                this.tx.nonce = await fWallet.getTransactionCount(currentAccount.address);
                // console.log('tx', this.tx);

                if (currentAccount.keystore) {
                    delete this.tx.gasLimit;

                    if (pwd) {
                        try {
                            rawTx = await fWallet.signTransaction(this.tx, currentAccount.keystore, pwd);
                        } catch (_error) {
                            console.error(_error);
                            this.errorMsg = _error.toString();
                            // this.errorMsg = 'Invalid password';
                        }
                    }
                } else {
                    delete this.tx.gas;

                    try {
                        this.$refs.confirmationWindow.show();

                        rawTx = await this.$fNano.signTransaction(
                            this.tx,
                            currentAccount.accountId,
                            currentAccount.addressId
                        );

                        this.$refs.confirmationWindow.hide('fade-leave-active');
                    } catch (_error) {
                        this.error = _error;
                        this.$refs.confirmationWindow.hide();
                        // this.errorMsg = _error.toString();
                    }
                }

                if (rawTx) {
                    // console.log('rawTx', rawTx);
                    this.sendTransaction(rawTx);

                    setTimeout(() => {
                        this.$store.dispatch(UPDATE_ACCOUNT_BALANCE);
                    }, 3000);
                }
            }
        },

        _onGoBack() {
            if (this.onGoBack) {
                this.onGoBack();
            } else {
                this.$emit('change-component', {
                    to: this.goBackCompName,
                    from: this.confirmationCompName,
                });
            }
        },

        /**
         * Triggered on 'ledger-status-code' event.
         *
         * @param {string} _code
         */
        onLedgerStatusCode(_code) {
            if (_code === U2FStatus.USER_REJECTED_REQUESTED_ACTION) {
                this.$emit('change-component', {
                    to: 'transaction-reject-message',
                    from: this.confirmationCompName,
                });
            }
        },
    },
};
</script>
