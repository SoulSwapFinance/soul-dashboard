<template>
    <div class="transaction-confirmation">
        <f-card class="f-card-double-padding f-data-layout">
            <h2>Confirm Transaction</h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">To</div>
                    <div class="col break-word">{{ txData.opera_address }}</div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">From</div>
                    <div class="col break-word">{{ currentAccount.address }}</div>
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

            <check-password-form
                :error-message="errorMsg"
                :show-password-field="!currentAccount.isLedgerAccount"
                @f-form-submit="onFFormSubmit"
                @go-back="onGoBack"
            />
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

export default {
    components: { CheckPasswordForm, FCard },

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
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
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

            if (currentAccount) {
                if (pwd && currentAccount.keystore) {
                    try {
                        const rawTx = await fWallet.signTransaction({
                            value: fWallet.web3.utils.toWei(txData.amount),
                            from,
                            to: fWallet.toChecksumAddress(txData.opera_address),
                            keystore: currentAccount.keystore,
                            password: pwd,
                            memo: txData.memo || '',
                        });

                        if (rawTx) {
                            this.sendTransaction(rawTx);

                            this.$store.dispatch(UPDATE_ACCOUNT_BALANCE);
                        }
                    } catch (_error) {
                        this.errorMsg = 'Invalid password';
                    }
                } else {
                    alert('Not implemented yet');
                }
            }
        },

        onGoBack() {
            this.$emit('change-component', {
                from: 'transaction-confirmation',
                to: 'send-transaction-form',
            });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
