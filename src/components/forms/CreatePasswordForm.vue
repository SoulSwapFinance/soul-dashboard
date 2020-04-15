<template>
    <div class="keystore-password-form">
        <f-form @f-form-submit="onFormSubmit" @f-form-change="onFormChange" @f-form-input="onFormInput">
            <fieldset class="">
                <legend><h2>Create a keystore file and password</h2></legend>

                <div class="main">
                    <f-password-field
                        v-model="primaryPwd"
                        :label="cSetPasswordT"
                        type="password"
                        field-size="large"
                        name="primaryPwd"
                        :validator="checkPrimaryPassword"
                        validate-on-input
                    >
                        <template #bottom="sProps">
                            <f-message v-if="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                Make sure to enter at least 8 and max 200 characters, including one upper-case letter, a
                                symbol and a number
                            </f-message>
                            <f-message v-if="!sProps.showErrorMessage" type="info" with-icon>
                                Make sure to enter at least 8 and max 200 characters, including one upper-case letter, a
                                symbol and a number
                            </f-message>
                        </template>
                    </f-password-field>

                    <f-password-field
                        v-model="secondaryPwd"
                        label="Re-enter password"
                        type="password"
                        field-size="large"
                        name="secondaryPwd"
                        :validator="checkSecondaryPassword"
                        validate-on-input
                    >
                        <template #bottom="sProps">
                            <f-message v-if="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                The entered password does not match
                            </f-message>
                        </template>
                    </f-password-field>

                    <f-checkbox v-model="confirmation" name="confirmation">
                        I made a backup of the keystore file and saved the password in a safe.
                        <br />
                        I understand that I will need the password and the keystore file to access my wallet.
                    </f-checkbox>
                </div>

                <div class="footer">
                    <button
                        type="submit"
                        class="btn large break-word"
                        style="max-width: 100%;"
                        :disabled="submitDisabled"
                    >
                        Download keystore file and continue
                    </button>
                </div>
            </fieldset>
        </f-form>
    </div>
</template>

<script>
import FForm from '../core/FForm/FForm.vue';
import { ADD_ACCOUNT } from '../../store/actions.type.js';
import fileDownload from 'js-file-download';
import { findFirstFocusableDescendant } from '../../utils/aria.js';
import FCheckbox from '../core/FCheckbox/FCheckbox.vue';
import FMessage from '../core/FMessage/FMessage.vue';
import FPasswordField from '../core/FPasswordField/FPasswordField.vue';

export default {
    components: {
        FPasswordField,
        FMessage,
        FForm,
        FCheckbox,
    },

    props: {
        // created from restore account view
        restoreAccount: {
            type: Boolean,
            default: false,
        },
        // private key
        privateKey: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            primaryPwd: '',
            secondaryPwd: '',
            confirmation: false,
            submitDisabled: true,
        };
    },

    computed: {
        cSetPasswordT() {
            return this.restoreAccount ? 'Set a new password' : 'Set a password';
        },
    },

    mounted() {
        const el = findFirstFocusableDescendant(this.$el);
        if (el) {
            el.focus();
        }
    },

    methods: {
        getKeystoreFileName(_publicAddress) {
            return `UTC--${new Date().toISOString()} -- ${_publicAddress}`;
        },

        downloadKeystore(_keystore) {
            fileDownload(
                JSON.stringify(_keystore),
                `${this.getKeystoreFileName(this.$fWallet.toChecksumAddress(_keystore.address))}.json`
            );
        },

        checkPrimaryPassword(_value) {
            return this.$fWallet.checkPrimaryPassword(_value);
        },

        checkSecondaryPassword(_value) {
            return _value === this.primaryPwd;
        },

        checkPasswords() {
            return this.checkPrimaryPassword(this.primaryPwd) && this.checkSecondaryPassword(this.secondaryPwd);
        },

        validate() {
            return this.checkPasswords() && this.confirmation;
        },

        onFormInput() {
            this.submitDisabled = !this.validate();
        },

        onFormChange() {
            this.submitDisabled = !this.validate();
        },

        async onFormSubmit(_event) {
            const pwd = _event.detail.data.primaryPwd;
            let account = null;
            let keystore = null;
            const fWallet = this.$fWallet;

            if (this.validate()) {
                if (pwd) {
                    if (this.privateKey) {
                        // from restore account - private key, mnemonic
                        keystore = fWallet.encryptToKeystore(this.privateKey, pwd);
                    } else if (this.restoreAccount) {
                        // from restore account - keystore
                        account = fWallet.createAccount();
                        keystore = fWallet.encryptToKeystore(account.privateKey, pwd);

                        account = null;
                    }

                    if (keystore) {
                        this.downloadKeystore(keystore);

                        if (this.restoreAccount) {
                            // save account
                            this.$store.dispatch(ADD_ACCOUNT, keystore);
                            // go to success view
                            this.$emit('change-component', {
                                detail: {
                                    from: 'create-password-form',
                                    to: 'account-success-message',
                                    data: {
                                        address: fWallet.toChecksumAddress(keystore.address),
                                    },
                                },
                            });
                        }
                    } else if (!this.restoreAccount) {
                        // create new account
                        account = await this.$fWallet.createMnemonic(pwd);
                        this.downloadKeystore(account.keystore);
                        this.$emit('change-component', {
                            detail: {
                                from: 'create-password-form',
                                data: { account },
                            },
                        });
                    }
                }
            }
        },
    },
};
</script>

<style lang="scss"></style>
