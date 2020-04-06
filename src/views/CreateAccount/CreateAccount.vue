<template>
    <div class="create-account-view">
        <f-card class="window">
            <div class="header">
                <h1>Create wallet</h1>
            </div>
            <div class="body">
                <create-password-form @f-form-submit="onCreatePasswordFormSubmit" />
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '../../components/core/FCard/FCard.vue';
import CreatePasswordForm from '../../components/forms/CreatePasswordForm.vue';
import { findFirstFocusableDescendant } from '../../utils/aria.js';
import fileDownload from 'js-file-download';
import { mapGetters } from 'vuex';
import { SET_PRIVATE_KEY } from '../../store/mutations.type.js';

export default {
    components: { CreatePasswordForm, FCard },

    props: {
        // private key
        privateKey: {
            type: String,
            default: '',
        },
    },

    computed: {
        ...mapGetters(['pk']),
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
            const pk = this.pk;
            let account = null;
            let keystore = null;

            if (pwd) {
                // from restore account - private key
                if (pk) {
                    keystore = this.$fWallet.encryptToKeystore(pk, pwd);
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
                }
            }

            if (pk) {
                this.$store.commit(SET_PRIVATE_KEY, '');
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
