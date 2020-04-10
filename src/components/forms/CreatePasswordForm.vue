<template>
    <div class="keystore-password-form">
        <f-form @f-form-submit="onFormSubmit" @f-form-change="onFormChange" @f-form-input="onFormInput">
            <fieldset class="">
                <legend><h2>Create a keystore file and password</h2></legend>

                <div class="main">
                    <label for="primaryPwd">{{ cSetPasswordT }}</label>
                    <input
                        id="primaryPwd"
                        v-model="dPrimaryPwd"
                        type="password"
                        class="large"
                        name="primaryPwd"
                        :invalid="!dPrimaryPwdOk"
                        :aria-invalid="!dPrimaryPwdOk"
                    />
                    <br />
                    <label for="secondaryPwd">Re-enter password</label>
                    <input
                        id="secondaryPwd"
                        v-model="dSecondaryPwd"
                        type="password"
                        class="large"
                        name="secondaryPwd"
                        :invalid="!dSecondaryPwdOk"
                        :aria-invalid="!dSecondaryPwdOk"
                    />
                    <br />
                    <input id="confirmation" v-model="dConfirmation" type="checkbox" name="confirmation" />
                    <label for="confirmation">
                        I made a backup of the keystore file and saved the password in a safe.
                    </label>
                    <br />I understand that I will need the password and the keystore file to access my wallet.
                </div>

                <div class="footer">
                    <button type="submit" class="large break-word" style="max-width: 100%;" :disabled="dSubmitDisabled">
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

export default {
    components: {
        FForm,
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
            dPrimaryPwd: '',
            dPrimaryPwdOk: true,
            dSecondaryPwd: '',
            dSecondaryPwdOk: true,
            dConfirmation: false,
            dSubmitDisabled: true,
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
        checkPasswords() {
            let passwordsOk = false;

            this.dPrimaryPwdOk = this.$fWallet.checkPrimaryPassword(this.dPrimaryPwd);

            if (this.dPrimaryPwdOk) {
                this.dSecondaryPwdOk = this.dPrimaryPwd === this.dSecondaryPwd;
                passwordsOk = this.dSecondaryPwdOk;
            } else {
                passwordsOk = false;
                // this.dSecondaryPwdOk = true;
            }

            return passwordsOk;
        },

        getKeystoreFileName(_publicAddress) {
            return `UTC--${new Date().toISOString()} -- ${_publicAddress}`;
        },

        downloadKeystore(_keystore) {
            fileDownload(
                JSON.stringify(_keystore),
                `${this.getKeystoreFileName(this.$fWallet.toChecksumAddress(_keystore.address))}.json`
            );
        },

        onFormInput() {
            this.dSubmitDisabled = !(this.checkPasswords() && this.dConfirmation);
        },

        onFormChange() {
            this.dSubmitDisabled = !(this.checkPasswords() && this.dConfirmation);
        },

        async onFormSubmit(_event) {
            const pwd = _event.detail.data.primaryPwd;
            let account = null;
            let keystore = null;
            const fWallet = this.$fWallet;

            if (this.checkPasswords() && this.dConfirmation) {
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
