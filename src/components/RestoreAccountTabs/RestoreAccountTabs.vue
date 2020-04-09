<template>
    <div class="restore-account-tabs">
        <div class="tmp-tabs">
            <h2><button @click="onKeystoreTabClick">Keystore file</button></h2>
            <h2><button @click="onMnemonicTabClick">Mnemonic phrase</button></h2>
            <h2><button @click="onPrivateKeyTabClick">Private key</button></h2>
        </div>

        <component :is="dCurrentComponent" v-on="cCurrentComponentListeners"></component>
    </div>
</template>

<script>
import FCard from '../../components/core/FCard/FCard.vue';
import PrivateKeyForm from '../../components/forms/PrivateKeyForm.vue';
import MnemonicForm from '../forms/MnemonicForm.vue';
import KeystoreForm from '../forms/KeystoreForm.vue';
import { findFirstFocusableDescendant } from '../../utils/aria.js';
import { ADD_ACCOUNT } from '../../store/actions.type.js';

export default {
    components: { KeystoreForm, MnemonicForm, PrivateKeyForm, FCard },

    data() {
        return {
            dCurrentComponent: 'keystore-form',
        };
    },

    computed: {
        cCurrentComponentListeners() {
            switch (this.dCurrentComponent) {
                case 'private-key-form':
                    return {
                        'f-form-submit': this.onPrivateKeyFormSubmit,
                    };
                case 'mnemonic-form':
                    return {
                        'f-form-submit': this.onMnemonicFormSubmit,
                    };
                case 'keystore-form':
                    return {
                        'f-form-submit': this.onKeystoreFormSubmit,
                    };
                default:
                    return null;
            }
        },
    },

    mounted() {
        const el = findFirstFocusableDescendant(this.$el);
        if (el) {
            el.focus();
        }
    },

    methods: {
        onPrivateKeyTabClick() {
            this.dCurrentComponent = 'private-key-form';
        },

        onMnemonicTabClick() {
            this.dCurrentComponent = 'mnemonic-form';
        },

        onKeystoreTabClick() {
            this.dCurrentComponent = 'keystore-form';
        },

        onPrivateKeyFormSubmit(_event) {
            const pk = _event.detail.data.pk;

            if (pk) {
                this.$emit('change-component', {
                    detail: {
                        from: 'restore-account-tabs',
                        to: 'create-password-form',
                        data: { pk },
                    },
                });
            }
        },

        onMnemonicFormSubmit(_event) {
            this.onPrivateKeyFormSubmit(_event);
        },

        onKeystoreFormSubmit(_event) {
            const { keystore } = _event.detail.data;

            if (keystore) {
                // save account
                this.$store.dispatch(ADD_ACCOUNT, keystore);
                // go to success view
                this.$emit('change-component', {
                    detail: {
                        from: 'restore-account-tabs',
                        to: 'account-success-message',
                        data: {
                            address: this.$fWallet.toChecksumAddress(keystore.address),
                        },
                    },
                });
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
