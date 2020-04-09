<template>
    <div class="create-account-view">
        <f-card class="window">
            <div class="header">
                <h1>Create a new wallet</h1>
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

export default {
    components: { AccountSuccessMessage, MnemonicPhraseVerification, MnemonicPhrase, FCard, CreatePasswordForm },

    data() {
        return {
            dCurrentComponent: 'create-password-form',
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

        /**
         * @param {Object} _event
         */
        onChangeComponent(_event) {
            const data = _event.detail;

            if (data.from === 'create-password-form') {
                this._account = data.data.account;
                this.dCurrentComponent = 'mnemonic-phrase';
            } else if (data.from === 'mnemonic-phrase') {
                this._account = data.data.account;
                this.dCurrentComponent = 'mnemonic-phrase-verification';
            } else if (data.from === 'mnemonic-phrase-verification') {
                this._address = data.data.address;
                this.dCurrentComponent = 'account-success-message';
            }

            this.deleteTmpProps();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
