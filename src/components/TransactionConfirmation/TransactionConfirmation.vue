<template>
    <div class="transaction-confirmation">
        <f-card class="f-card-double-padding f-data-layout">
            <h2>Confirm Transaction</h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send To</div>
                    <div class="col break-word">
                        {{ txData.opera_address }}
                        <span class="f-row-label">( {{ toFTM(sendToAddressBalance.balance) }} FTM )</span>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send From</div>
                    <div class="col break-word">
                        {{ currentAccount.address }}
                        <span class="f-row-label">( {{ toFTM(currentAccount.balance) }} FTM )</span>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Amount</div>
                    <div class="col">{{ txData.amount }}</div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Memo</div>
                    <div class="col">{{ txData.memo }}</div>
                </div>

                <!--
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Fee</div>
                    <div class="col">{{ txData.fee }}</div>
                </div>
                -->
            </div>

            <ledger-message :error="error" @ledger-status-code="onLedgerStatusCode" />

            <check-password-form
                :error-message="errorMsg"
                :show-password-field="!currentAccount.isLedgerAccount"
                @f-form-submit="onFFormSubmit"
                @go-back="onGoBack"
            />

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
                <div class="align-center">
                    <img src="img/nano-s-confirm-tx.png" alt="fantom nano device" /><br /><br />
                </div>

                <p>Please confirm this transaction on your Ledger device:</p>

                <ol class="f-data-layout">
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Send To</div>
                            <div class="col break-word">
                                {{ txData.opera_address }}
                                <span class="f-row-label">( {{ toFTM(sendToAddressBalance.balance) }} FTM )</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Send From</div>
                            <div class="col break-word">
                                {{ currentAccount.address }}
                                <span class="f-row-label">( {{ toFTM(currentAccount.balance) }} FTM )</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Amount</div>
                            <div class="col">{{ txData.amount }}</div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Max Fee</div>
                            <div class="col">{{ txData.fee }}</div>
                        </div>
                    </li>
                </ol>
            </f-window>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import gql from 'graphql-tag';
import CheckPasswordForm from '../forms/TransactionConfirmationForm.vue';
import { mapGetters } from 'vuex';
import { UPDATE_ACCOUNT_BALANCE } from '../../store/actions.type.js';
import { findFirstFocusableDescendant } from '../../utils/aria.js';
import { Web3 } from '../../plugins/fantom-web3-wallet.js';
import LedgerMessage from '../LedgerMessage/LedgerMessage.vue';
import { U2FStatus } from '../../plugins/fantom-nano.js';
import FWindow from '../core/FWindow/FWindow.vue';
import { toFTM } from '../../utils/transactions.js';

export default {
    components: { FWindow, LedgerMessage, CheckPasswordForm, FCard },

    props: {
        // transaction data from SendTransactionForm
        txData: {
            type: Object,
            default() {
                return {};
            },
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

    asyncComputed: {
        async sendToAddressBalance() {
            return await this.$fWallet.getBalance(this.txData.opera_address);
        },
    },

    mounted() {
        if (!this.currentAccount.isLedgerAccount) {
            const el = findFirstFocusableDescendant(this.$el);
            if (el) {
                el.focus();
            }
        }
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
                    this.$emit('change-component', {
                        from: 'transaction-confirmation',
                        to: 'transaction-success-message',
                        data: {
                            tx: _data.data.sendTransaction.hash,
                        },
                    });
                })
                .catch((_error) => {
                    this.errorMsg = _error;
                });
        },

        async onFFormSubmit(_event) {
            const { currentAccount } = this;
            const from = currentAccount ? currentAccount.address : '';
            const fWallet = this.$fWallet;
            const { txData } = this;
            const pwd = _event.detail.data.pwd;
            let rawTx = null;

            if (currentAccount) {
                // transaction to sign
                const tx = await fWallet.getTransactionToSign({
                    value: Web3.utils.toHex(Web3.utils.toWei(txData.amount)),
                    from,
                    to: fWallet.toChecksumAddress(txData.opera_address),
                    memo: txData.memo,
                });

                console.log('tx', tx);

                if (pwd && currentAccount.keystore) {
                    delete tx.gasLimit;

                    try {
                        rawTx = await fWallet.signTransaction(tx, currentAccount.keystore, pwd);
                    } catch (_error) {
                        console.error(_error);
                        this.errorMsg = _error.toString();
                        // this.errorMsg = 'Invalid password';
                    }
                } else {
                    delete tx.gas;

                    try {
                        console.log(currentAccount);
                        this.$refs.confirmationWindow.show();

                        rawTx = await this.$fNano.signTransaction(
                            tx,
                            currentAccount.accountId,
                            currentAccount.addressId
                        );

                        this.$refs.confirmationWindow.hide();
                    } catch (_error) {
                        this.error = _error;
                        this.$refs.confirmationWindow.hide();
                        // this.errorMsg = _error.toString();
                    }
                }

                if (rawTx) {
                    console.log('rawTx', rawTx);
                    this.sendTransaction(rawTx);
                    this.$store.dispatch(UPDATE_ACCOUNT_BALANCE);
                }
            }
        },

        onGoBack() {
            this.$emit('change-component', {
                from: 'transaction-confirmation',
                to: 'send-transaction-form',
            });
        },

        /**
         * Triggered on 'ledger-status-code' event.
         *
         * @param {string} _code
         */
        onLedgerStatusCode(_code) {
            if (_code === U2FStatus.USER_REJECTED_REQUESTED_ACTION) {
                this.$emit('change-component', {
                    from: 'transaction-confirmation',
                    to: 'transaction-reject-message',
                });
            }
        },

        toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
