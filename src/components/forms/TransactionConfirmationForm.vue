<template>
    <div class="check-password-form">
        <f-form center-form @f-form-submit="$emit('f-form-submit', $event)">
            <fieldset class="">
                <legend class="not-visible">Confirm Transaction</legend>

                <div class="form-body">
                    <f-password-field
                        v-if="showPasswordField && showPwdField"
                        :label="passwordLabel"
                        field-size="large"
                        autocomplete="off"
                        name="pwd"
                        :validator="checkPassword"
                        validate-on-input
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                Type a password
                            </f-message>
                        </template>
                    </f-password-field>

                    <div class="align-center form-buttons">
                        <div v-if="errorMessage">
                            <f-message type="error" with-icon>{{ errorMessage }}</f-message>
                            <br />
                        </div>
                        <div v-if="notEnoughFTM">
                            <f-message type="warning" with-icon class="align-left">
                                Warning: Not enough available FTM for gas fees. Transfer FTM to your address to proceed.
                            </f-message>
                            <br />
                        </div>

                        <template v-if="!waiting">
                            <button
                                v-if="showCancelButton"
                                type="button"
                                class="btn secondary large break-word"
                                style="max-width: 100%;"
                                @click="onCancelButtonClick"
                            >
                                {{ cancelButtonLabel }}
                            </button>
                            <button
                                type="submit"
                                class="btn large break-word"
                                style="max-width: 100%;"
                                :disabled="notEnoughFTM || disabledSubmit"
                            >
                                {{ sendButtonLabel }}
                            </button>
                            <div class="gas-info">
                                Estimated Gas:
                                <f-placeholder :content-loaded="!!gasLimit" :replacement-num-chars="4">
                                    {{ formatNumberByLocale(parseInt(gasLimit, 16), 0) }}
                                </f-placeholder>
                            </div>
                        </template>
                        <pulse-loader v-else color="#1969ff"></pulse-loader>
                    </div>
                </div>
            </fieldset>
        </f-form>
    </div>
</template>

<script>
import FForm from '../core/FForm/FForm.vue';
import FPasswordField from '../core/FPasswordField/FPasswordField.vue';
import FMessage from '../core/FMessage/FMessage.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { mapGetters } from 'vuex';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import { formatNumberByLocale } from '@/filters.js';

export default {
    name: 'TransactionConfirmationForm',

    components: { FPlaceholder, FMessage, FPasswordField, FForm, PulseLoader },

    props: {
        showPasswordField: {
            type: Boolean,
            default: false,
        },
        errorMessage: {
            type: String,
            default: '',
        },
        passwordLabel: {
            type: String,
            default: 'Please enter your wallet password to send the transaction',
        },
        sendButtonLabel: {
            type: String,
            default: 'Send',
        },
        cancelButtonLabel: {
            type: String,
            default: 'Cancel',
        },
        showCancelButton: {
            type: Boolean,
            default: false,
        },
        /** Transaction's gas limit */
        gasLimit: {
            type: String,
            default: '',
        },
        /** */
        waiting: {
            type: Boolean,
            default: false,
        },
        /** */
        disabledSubmit: {
            type: Boolean,
            default: false,
        },
        /** */
        tmpPwdCode: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            gasPrice: '',
            showPwdField: true,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * @return {number}
         */
        notEnoughFTM() {
            const { currentAccount } = this;
            let price = 0;

            if (this.gasPrice && currentAccount) {
                price = this.$fWallet.getRemainingBalance(currentAccount.balance, this.gasPrice, this.gasLimit);
            }

            // console.log('price', price);

            return price <= 0;
        },
    },

    created() {
        this._tid = -1;

        this.showPwdField = !this.$fWallet.pwdStorage.isSet(this.tmpPwdCode);

        this.$fWallet.getGasPrice().then((_gasPrice) => {
            this.gasPrice = _gasPrice;
        });

        if (this.showPasswordField && !this.showPwdField) {
            this._tid = setTimeout(() => {
                this.$fWallet.pwdStorage.clear();
                this.showPwdField = true;
            }, 30000);
        }
    },

    beforeDestroy() {
        if (this._tid > -1) {
            clearTimeout(this._tid);
            this._tid = -1;
        }
    },

    methods: {
        checkPassword(_value) {
            return _value && _value.length > 0;
        },

        onCancelButtonClick() {
            this.$emit('cancel-button-click');
        },

        formatNumberByLocale,
    },
};
</script>
<style lang="scss">
@import '../../assets/scss/vars';
.gas-info {
    color: $light-gray-color;
}
</style>
