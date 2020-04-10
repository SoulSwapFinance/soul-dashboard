<template>
    <div class="keystore-form">
        <f-form ref="keystore-form" @f-form-submit="onFormSubmit">
            <fieldset>
                <legend class="not-visible">Keystore file</legend>

                <div class="main">
                    <br />

                    <f-file-input-button
                        name="keystore-file"
                        accept="application/json"
                        class="secondary large w100p"
                        @change="onKeystoreFileChange"
                    >
                        <icon data="@/assets/svg/upload.svg" width="20" height="20"></icon> &nbsp; Upload keystore file
                    </f-file-input-button>
                    <div v-if="dKeystoreUploadMsg" class="success-msg">{{ dKeystoreUploadMsg }}</div>
                    <br />

                    <div v-if="dKeystoreErrorMsg" class="tmp-error">{{ dKeystoreErrorMsg }}</div>
                    <br />

                    <label for="pwd">Enter your wallet password</label>
                    <input
                        id="pwd"
                        type="password"
                        class="large"
                        name="pwd"
                        :invalid="!dPrimaryPwdOk"
                        :aria-invalid="!dPrimaryPwdOk"
                        @input="onPwdInput"
                    />
                </div>

                <div class="footer">
                    <div v-if="dErrorMsg" class="tmp-error">{{ dErrorMsg }}</div>

                    <button type="submit" class="large" :disabled="dSubmitDisabled">
                        Unlock wallet
                    </button>
                </div>
            </fieldset>
        </f-form>
    </div>
</template>

<script>
import FForm from '../core/FForm/FForm.vue';
import FFileInputButton from '../core/FFileInputButton/FFileInputButton.vue';
import { FileReaderP } from '../../utils/file-reader.js';
import { mapGetters } from 'vuex';

export default {
    components: {
        FForm,
        FFileInputButton,
    },

    data() {
        return {
            dPrimaryPwdOk: true,
            dSubmitDisabled: true,
            dKeystoreErrorMsg: '',
            dKeystoreUploadMsg: '',
            dErrorMsg: '',
        };
    },

    computed: {
        ...mapGetters(['getAccountByAddress']),
    },

    created() {
        this._fileReader = new FileReaderP();
        this._pwd = '';
        this._keystore = null;
    },

    beforeDestroy() {
        this._fileReader = null;
    },

    methods: {
        checkForm() {
            this.dSubmitDisabled = !this._pwd || this._keystore === null;
        },

        async onKeystoreFileChange(_event) {
            const files = _event.target.files;

            if (files.length === 1) {
                try {
                    this._keystore = await this._fileReader.readAsJSON(files[0]);
                    this.dKeystoreErrorMsg = '';
                    this.dKeystoreUploadMsg = 'Keystore sucessfully loaded';
                    this.checkForm();
                } catch (e) {
                    this._keystore = null;
                    this.dKeystoreErrorMsg = 'Not valid JSON file.';
                    this.checkForm();
                }
            }
        },

        onPwdInput(_event) {
            this._pwd = _event.target.value;

            this.dPrimaryPwdOk = this._pwd.length > 0;

            /*
            this.dPrimaryPwdOk = this.$fWallet.checkPrimaryPassword(this._pwd);
            if (!this.dPrimaryPwdOk) {
                this._pwd = '';
            }
            */

            this.checkForm();
        },

        onFormSubmit(_event) {
            try {
                const account = this.$fWallet.decryptFromKeystore(this._keystore, this._pwd);

                if (account) {
                    if (this.getAccountByAddress(account.address)) {
                        this.dErrorMsg = 'An account with this address already exist';
                    } else {
                        _event.detail.data.keystore = this._keystore;
                        this.$emit('f-form-submit', _event);
                    }
                }

                this._keystore = null;
                this._pwd = '';
            } catch (_error) {
                this.dErrorMsg = 'Bad keystore file or password.';
            }
        },
    },
};
</script>

<style lang="scss"></style>
