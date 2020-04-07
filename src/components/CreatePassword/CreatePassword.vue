<template>
    <div class="create-password">
        <f-card class="window">
            <div class="header">
                <h1>{{ cTitleT }}</h1>
            </div>
            <div class="body">
                <create-password-form :restore-account="restoreAccount" @f-form-submit="onCreatePasswordFormSubmit" />
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '../../components/core/FCard/FCard.vue';
import CreatePasswordForm from '../../components/forms/CreatePasswordForm.vue';
import { findFirstFocusableDescendant } from '../../utils/aria.js';
import fileDownload from 'js-file-download';
import { ADD_ACCOUNT } from '../../store/actions.type.js';

export default {
    components: { CreatePasswordForm, FCard },

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

    computed: {
        cTitleT() {
            return this.restoreAccount ? 'Access wallet' : 'Create wallet';
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

        onCreatePasswordFormSubmit(_event) {
            const pwd = _event.detail.data.primaryPwd;
            let account = null;
            let keystore = null;

            if (pwd) {
                // from restore account - private key
                if (this.privateKey) {
                    keystore = this.$fWallet.encryptToKeystore(this.privateKey, pwd);
                } else {
                    account = this.$fWallet.createAccount();
                    keystore = this.$fWallet.encryptToKeystore(account.privateKey, pwd);

                    account = null;
                }

                if (keystore) {
                    fileDownload(
                        JSON.stringify(keystore),
                        `${this.getKeystoreFileName(this.$fWallet.toChecksumAddress(keystore.address))}.json`
                    );

                    if (this.restoreAccount) {
                        this.$store.dispatch(ADD_ACCOUNT, keystore);
                        this.$router.push({ path: '/' });
                    }
                }
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
