<template>
    <div class="send-transaction-form">
        <f-card class="f-card-double-padding">
            <f-form @f-form-submit="onFormSubmit">
                <fieldset class="">
                    <legend class="h2">Send Opera FTM</legend>

                    <f-input
                        label="Amount"
                        field-size="large"
                        type="number"
                        autocomplete="off"
                        :min="0"
                        name="amount"
                        :validator="checkAmount"
                        validate-on-input
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                {{ amountErrMsg }}
                            </f-message>
                        </template>
                    </f-input>

                    <f-input
                        label="To address"
                        field-size="large"
                        name="opera_address"
                        :validator="checkAddress"
                        validate-on-input
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                Enter a valid Opera FTM address
                            </f-message>
                        </template>
                    </f-input>

                    <f-input label="Memo (optional)" field-size="large" name="memo" />

                    <div class="align-center">
                        <button type="submit" class="btn large break-word" style="max-width: 100%;">
                            Send
                        </button>
                    </div>
                </fieldset>
            </f-form>
        </f-card>
    </div>
</template>

<script>
import FForm from '../core/FForm/FForm.vue';
import { findFirstFocusableDescendant } from '../../utils/aria.js';
import FMessage from '../core/FMessage/FMessage.vue';
import FInput from '../core/FInput/FInput.vue';
import FCard from '../core/FCard/FCard.vue';
import { mapGetters } from 'vuex';

export default {
    components: {
        FCard,
        FInput,
        FMessage,
        FForm,
    },

    data() {
        return {
            amountErrMsg: 'Invalid amount',
            gasPrice: '',
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * @return {number}
         */
        remainingBalance() {
            const { currentAccount } = this;
            let price = 0;

            if (this.gasPrice && currentAccount) {
                price = this.$fWallet.getRemainingBalance(currentAccount.balance, this.gasPrice);
            }

            return price;
        },
    },

    created() {
        this.$fWallet.getGasPrice().then((_gasPrice) => {
            this.gasPrice = _gasPrice;
        });
    },

    mounted() {
        const el = findFirstFocusableDescendant(this.$el);
        if (el) {
            el.focus();
        }
    },

    methods: {
        checkAddress(_value) {
            return this.$fWallet.isValidAddress(_value);
        },

        checkAmount(_value) {
            const remainingBalance = parseFloat(this.remainingBalance);
            const value = parseFloat(_value);
            let ok = false;

            this.amountErrMsg = 'Invalid amount';

            if (!isNaN(value)) {
                if (value <= remainingBalance && value > 0) {
                    ok = true;
                } else if (remainingBalance < 0) {
                    this.amountErrMsg = `You have no balance left`;
                } else if (value > 0) {
                    this.amountErrMsg = `You can transfer max ${remainingBalance} (Value + gas * price)`;
                }
            }

            return ok;
        },

        /*
        onFormInput() {
            this.submitDisabled = !this.validate();
        },

        onFormChange() {
            this.submitDisabled = !this.validate();
        },

        */
        async onFormSubmit(_event) {
            const { data } = _event.detail;

            if (this.currentAccount && data.amount) {
                this.$emit('change-component', {
                    from: 'send-transaction-form',
                    to: 'transaction-confirmation',
                    data: {
                        ...data,
                        fee: this.$fWallet.WEIToFTM(this.$fWallet.getTransactionFee(this.gasPrice)),
                    },
                });
            }
        },
    },
};
</script>

<style lang="scss"></style>
