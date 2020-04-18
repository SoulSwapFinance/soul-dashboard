<template>
    <div class="send-transaction-form">
        <f-card class="f-card-double-padding">
            <f-form @f-form-submit="onFormSubmit">
                <fieldset class="">
                    <legend class="h2">Please enter your wallet password to send the transaction</legend>

                    <f-password-field
                        label="Password"
                        field-size="large"
                        autocomplete="off"
                        name="pwd"
                        :validator="checkPassword"
                        validate-on-input
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                Type a password
                            </f-message>
                        </template>
                    </f-password-field>

                    <div class="align-center">
                        <f-message v-if="errorMsg" type="error" with-icon>{{ errorMsg }}</f-message>
                        <br />

                        <button type="submit" class="btn large break-word" style="max-width: 100%;">
                            Send
                        </button>
                    </div>
                </fieldset>
            </f-form>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import FForm from '../core/FForm/FForm.vue';
import FPasswordField from '../core/FPasswordField/FPasswordField.vue';
import FMessage from '../core/FMessage/FMessage.vue';
import { mapGetters } from 'vuex';
import gql from 'graphql-tag';
import { UPDATE_ACCOUNT_BALANCE } from '../../store/actions.type.js';

export default {
    components: { FMessage, FPasswordField, FForm, FCard },

    props: {
        data: {
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

    methods: {
        checkPassword(_value) {
            return _value && _value.length > 0;
        },

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
                        from: 'set-password-form',
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

        async onFormSubmit(_event) {
            const { currentAccount } = this;
            const from = currentAccount ? currentAccount.address : '';
            const fWallet = this.$fWallet;
            const { data } = this;
            const pwd = _event.detail.data.pwd;

            if (pwd && currentAccount) {
                try {
                    const rawTx = await fWallet.signTransaction({
                        value: fWallet.web3.utils.toWei(data.amount),
                        from,
                        to: fWallet.toChecksumAddress(data.opera_address),
                        keystore: currentAccount.keystore,
                        password: pwd,
                    });

                    if (rawTx) {
                        this.sendTransaction(rawTx);

                        this.$store.dispatch(UPDATE_ACCOUNT_BALANCE);
                    }
                } catch (_error) {
                    this.errorMsg = 'Invalid password';
                }
            }
        },
    },
};
</script>

<style lang="scss"></style>
