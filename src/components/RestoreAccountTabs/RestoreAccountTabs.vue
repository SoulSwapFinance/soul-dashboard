<template>
    <div class="restore-account-tabs">
        <f-tabs no-style aria-label="Restore Account Tabs" @tab-set="onTabSet">
            <template #keystore-tab>
                <icon data="@/assets/svg/keystore.svg" width="45" height="54" original aria-hidden="true" />
                <span>Keystore</span>
            </template>
            <template #mnemonic-tab>
                <icon data="@/assets/svg/mnemonic.svg" width="45" height="54" original aria-hidden="true" />
                <span>Mnemonic</span>
            </template>
            <template #private-key-tab>
                <icon data="@/assets/svg/private-key.svg" width="45" height="54" original aria-hidden="true" />
                <span>Private Key</span>
            </template>

            <f-tab id="keystore-tab" title-slot="keystore-tab" title-class="btn secondary">
                <keystore-form @f-form-submit="onKeystoreFormSubmit" />
            </f-tab>

            <f-tab id="mnemonic-tab" title-slot="mnemonic-tab" title-class="btn secondary">
                <mnemonic-form @f-form-submit="onMnemonicFormSubmit" />
            </f-tab>

            <f-tab id="private-key-tab" title-slot="private-key-tab" title-class="btn secondary">
                <private-key-form @f-form-submit="onPrivateKeyFormSubmit" />
            </f-tab>
        </f-tabs>
    </div>
</template>

<script>
import PrivateKeyForm from '../../components/forms/PrivateKeyForm.vue';
import MnemonicForm from '../forms/MnemonicForm.vue';
import KeystoreForm from '../forms/KeystoreForm.vue';
import { findFirstFocusableDescendant } from '../../utils/aria.js';
import { ADD_ACCOUNT } from '../../store/actions.type.js';
import FTabs from '../core/FTabs/FTabs.vue';
import FTab from '../core/FTabs/FTab.vue';

export default {
    components: { FTab, FTabs, KeystoreForm, MnemonicForm, PrivateKeyForm },

    data() {
        return {
            dCurrentComponent: 'keystore-form',
        };
    },

    mounted() {
        const el = findFirstFocusableDescendant(this.$el);
        if (el) {
            el.focus();
        }
    },

    methods: {
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

        onTabSet(_data) {
            let stepsCount = -1;

            switch (_data.tabId) {
                case 'keystore-tab':
                    stepsCount = 2;
                    break;
                case 'mnemonic-tab':
                case 'private-key-tab':
                    stepsCount = 3;
                    break;
            }

            if (stepsCount > 0) {
                this.$emit('steps-count', stepsCount);
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
