<template>
    <div class="transaction-confirmation">
        <f-card class="f-card-double-padding f-data-layout">
            <h2>Confirm Transaction</h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send To</div>
                    <div class="col break-word">{{ txData.opera_address }}</div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send From</div>
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
import { Web3 } from '../../plugins/fantom-web3-wallet.js';

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
                        this.errorMsg = _error.toString();
                        // this.errorMsg = 'Invalid password';
                    }
                } else {
                    delete tx.gas;

                    try {
                        console.log(currentAccount);
                        rawTx = await this.$fNano.signTransaction(
                            tx,
                            currentAccount.accountId,
                            currentAccount.addressId
                        );
                    } catch (_error) {
                        this.errorMsg = _error.toString();
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
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
