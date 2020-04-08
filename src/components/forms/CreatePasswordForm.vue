<template>
    <div class="keystore-password-form">
        <f-form @f-form-submit="onFormSubmit" @f-form-change="onFormChange" @f-form-input="onFormInput">
            <fieldset class="">
                <legend>Create a keystore file and password</legend>

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

        onFormInput() {
            this.dSubmitDisabled = !(this.checkPasswords() && this.dConfirmation);
        },

        onFormChange() {
            this.dSubmitDisabled = !(this.checkPasswords() && this.dConfirmation);
        },

        onFormSubmit(_event) {
            if (this.checkPasswords() && this.dConfirmation) {
                this.$emit('f-form-submit', _event);
            }
        },
    },
};
</script>

<style lang="scss"></style>
