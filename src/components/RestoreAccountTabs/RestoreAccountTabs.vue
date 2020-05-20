<template>
    <div class="restore-account-tabs">
        <f-tabs no-style aria-label="Restore Account Tabs" @tab-set="onTabSet">
            <template #keystore-tab>
                <svg xmlns="http://www.w3.org/2000/svg" width="45px" height="54px" viewBox="0 0 45 54">
                    <path
                        fill="#ffb448"
                        d="M40.48,51.05H10.92A4.44,4.44,0,0,1,6.4,46.7V4.35A4.44,4.44,0,0,1,10.92,0h22.3L45,11.58V46.7A4.44,4.44,0,0,1,40.48,51.05Z"
                    ></path>
                    <g fill="#2b3954">
                        <path
                            d="M27.23,3H5.41A5.42,5.42,0,0,0,0,8.42V48.59A5.42,5.42,0,0,0,5.41,54h27a5.41,5.41,0,0,0,5.41-5.41V13.78Zm8,11.82v1.52H25.12V5.59h1ZM32.37,51.42h-27a2.83,2.83,0,0,1-2.83-2.83V8.42A2.83,2.83,0,0,1,5.41,5.59H22.54v12a1.29,1.29,0,0,0,1.29,1.29H35.21V48.59A2.84,2.84,0,0,1,32.37,51.42Z"
                        ></path>
                        <rect
                            x="11.51"
                            y="32.33"
                            width="19.31"
                            height="2.3"
                            transform="translate(-16.73 45) rotate(-74.6)"
                        ></rect>
                        <polygon
                            points="15.54 39.14 8.48 33.52 15.54 27.83 16.99 29.62 12.17 33.51 16.98 37.33 15.54 39.14"
                        ></polygon>
                        <polygon
                            points="26.72 39.14 25.28 37.33 30.09 33.51 25.28 29.62 26.72 27.83 33.78 33.52 26.72 39.14"
                        ></polygon>
                    </g>
                </svg>
                <span>Keystore</span>
            </template>
            <template #mnemonic-tab>
                <svg xmlns="http://www.w3.org/2000/svg" width="45px" height="54px" viewBox="0 0 45 54">
                    <path
                        fill="#ffb448"
                        d="M40.48,51.05H10.92A4.44,4.44,0,0,1,6.4,46.7V4.35A4.44,4.44,0,0,1,10.92,0h22.3L45,11.58V46.7A4.44,4.44,0,0,1,40.48,51.05Z"
                    ></path>
                    <g fill="#2b3954">
                        <path
                            d="M27.23,3H5.41A5.42,5.42,0,0,0,0,8.42V48.59A5.42,5.42,0,0,0,5.41,54h27a5.41,5.41,0,0,0,5.41-5.41V13.78Zm8,11.82v1.52H25.12V5.59h1ZM32.37,51.42h-27a2.83,2.83,0,0,1-2.83-2.83V8.42A2.83,2.83,0,0,1,5.41,5.59H22.54v12a1.29,1.29,0,0,0,1.29,1.29H35.21V48.59A2.84,2.84,0,0,1,32.37,51.42Z"
                        ></path>
                        <path
                            d="M27.41,28.59h-17a1.29,1.29,0,0,1,0-2.58h17a1.29,1.29,0,0,1,0,2.58Zm1.29,4.89a1.29,1.29,0,0,0-1.29-1.29h-17a1.29,1.29,0,0,0,0,2.58h17A1.29,1.29,0,0,0,28.7,33.48Zm0,6.19a1.29,1.29,0,0,0-1.29-1.29h-17a1.29,1.29,0,1,0,0,2.57h17A1.28,1.28,0,0,0,28.7,39.67Z"
                        ></path>
                    </g>
                </svg>
                <span>Mnemonic</span>
            </template>
            <template #private-key-tab>
                <svg
                    class="mt-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="41.15px"
                    height="44.12px"
                    viewBox="0 0 41.15 44.12"
                >
                    <path
                        fill="#ffb448"
                        d="M40.8,30.63l-12.32-15a12.81,12.81,0,0,0,.19-2.25,13.4,13.4,0,1,0-8.2,12.37l-.46.55a16.88,16.88,0,0,1-3.26,1.22L19.51,30a1.38,1.38,0,0,0,.57.31l2.7.8v3.1a1.48,1.48,0,0,0,.37,1l5.36,6.26a1.51,1.51,0,0,0,1.16.53h8.94c.84,0,2-.68,2-1.52l.51-8.82A1.56,1.56,0,0,0,40.8,30.63Z"
                    ></path>
                    <g fill="#2b3954">
                        <path
                            d="M37.53,31.79,26.36,18.38l0,0a12.8,12.8,0,0,0,.26-2.57A13.29,13.29,0,0,0,0,15.79c0,.21,0,.36,0,.49a5,5,0,0,0,.12,1.45,1.52,1.52,0,0,0,1.81,1.18,1.51,1.51,0,0,0,1.18-1.8,2.35,2.35,0,0,1-.06-.72c0-.15,0-.34,0-.6A10.24,10.24,0,1,1,13.31,26a9.59,9.59,0,0,1-7.09-2.85,1.52,1.52,0,1,0-2.17,2.14,12.67,12.67,0,0,0,9.26,3.76h.53a1.59,1.59,0,0,0,.29.35l3.13,2.71a1.59,1.59,0,0,0,.57.31l2.7.8v3.1a1.5,1.5,0,0,0,.37,1l5.36,6.26a1.53,1.53,0,0,0,1.16.53h8.94a1.53,1.53,0,0,0,1.53-1.52V32.76A1.51,1.51,0,0,0,37.53,31.79Zm-2.7,9.28H28.12l-4.53-5.3V32.09a1.53,1.53,0,0,0-1.1-1.46L19,29.6l-1.43-1.23a13.34,13.34,0,0,0,7.6-6.63l9.65,11.58Z"
                        ></path>
                        <circle cx="30.25" cy="35.3" r="2.46"></circle>
                    </g>
                </svg>
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
