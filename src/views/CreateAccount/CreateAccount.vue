<template>
    <div class="create-account-view">
        <f-card class="window">
            <div class="header">
                <h1>
                    Create a new wallet
                    <span class="steps"> {{ dStep }} <span class="count">/ 4</span> </span>
                    <router-link to="/" class="router-link">
                        <icon data="@/assets/svg/times.svg" width="24" height="24"></icon>
                    </router-link>
                </h1>
            </div>
            <div class="body">
                <component
                    :is="dCurrentComponent"
                    v-bind="cCurrentComponentProperties"
                    @change-component="onChangeComponent"
                />
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '../../components/core/FCard/FCard.vue';
import CreatePasswordForm from '../../components/forms/CreatePasswordForm.vue';
import MnemonicPhrase from '../../components/MnemonicPhrase/MnemonicPhrase.vue';
import MnemonicPhraseVerification from '../../components/MnemonicPhraseVerification/MnemonicPhraseVerification.vue';
import AccountSuccessMessage from '../../components/AccountSuccessMessage/AccountSuccessMessage.vue';

const DEFAULT_COMPONENT = 'create-password-form';

export default {
    components: { AccountSuccessMessage, MnemonicPhraseVerification, MnemonicPhrase, FCard, CreatePasswordForm },

    data() {
        return {
            dCurrentComponent: DEFAULT_COMPONENT,
            dStep: 1,
        };
    },

    computed: {
        cCurrentComponentProperties() {
            switch (this.dCurrentComponent) {
                case 'mnemonic-phrase':
                case 'mnemonic-phrase-verification':
                    return {
                        account: this._account,
                    };
                case 'account-success-message':
                    return {
                        address: this._address,
                    };
                default:
                    return null;
            }
        },
    },

    created() {
        this._account = {
            privateKey: '',
            mnemonic: '',
            keystore: null,
        };
        this._address = '';
    },

    methods: {
        /**
         * Delete temporaty properties.
         */
        deleteTmpProps() {
            this.$nextTick(() => {
                this._account = {
                    privateKey: '',
                    mnemonic: '',
                    keystore: null,
                };
                this._address = '';
            });
        },

        setDefaultComponent() {
            this.dCurrentComponent = DEFAULT_COMPONENT;
            this.dStep = 1;
        },

        /**
         * @param {Object} _event
         */
        onChangeComponent(_event) {
            const data = _event.detail;

            if (data.from === 'create-password-form') {
                this._account = data.data.account;
                this.dCurrentComponent = 'mnemonic-phrase';
                this.dStep = 2;
            } else if (data.from === 'mnemonic-phrase') {
                this._account = data.data.account;
                this.dCurrentComponent = 'mnemonic-phrase-verification';
                this.dStep = 3;
            } else if (data.from === 'mnemonic-phrase-verification') {
                this._address = data.data.address;
                this.dCurrentComponent = 'account-success-message';
                this.dStep = 4;
            }

            this.deleteTmpProps();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
