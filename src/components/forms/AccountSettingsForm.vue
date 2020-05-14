<template>
    <div class="account-settings-form">
        <f-form ref="keystore-form" center-form @f-form-submit="onFormSubmit">
            <fieldset>
                <legend class="not-visible">Settings for wallet {{ accountName }}</legend>

                <div class="form-body">
                    <span class="form-label">Address</span>
                    {{ account.address }}
                    <br /><br />

                    <f-input
                        :value="accountName"
                        type="text"
                        label="Name"
                        field-size="large"
                        name="name"
                        validate-on-input
                        :validator="checkName"
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                This field cannot be blank
                            </f-message>
                        </template>
                    </f-input>

                    <f-input
                        :value="accountOrder"
                        type="number"
                        autocomplete="off"
                        min="1"
                        :max="accounts.length.toString(10)"
                        step="1"
                        label="Order"
                        field-size="large"
                        name="order"
                        validate-on-input
                        :validator="checkOrder"
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                Value must be between 1 and {{ accounts.length }}
                            </f-message>
                        </template>
                    </f-input>

                    <div class="align-center form-buttons">
                        <button type="submit" class="btn large">Save</button>
                    </div>
                </div>
            </fieldset>
        </f-form>
    </div>
</template>

<script>
import FForm from '../core/FForm/FForm.vue';
import FInput from '../core/FInput/FInput.vue';
import { mapGetters } from 'vuex';
import FMessage from '../core/FMessage/FMessage.vue';
import { UPDATE_ACCOUNT } from '../../store/actions.type.js';

export default {
    name: 'AccountSettingsForm',

    components: { FMessage, FInput, FForm },

    props: {
        /** Account data */
        accountData: {
            type: Object,
            default() {
                return {
                    address: '',
                    order: -1,
                };
            },
            required: true,
        },
    },

    data() {
        return {
            account: {},
        };
    },

    computed: {
        ...mapGetters(['getAccountByAddress', 'accounts', 'getAccountAndIndexByAddress']),

        /**
         * @return {string}
         */
        accountName() {
            return this.account.name || this.account.address;
        },

        /**
         * @return {string}
         */
        accountOrder() {
            let order = this.accountData.order;

            if (order === -1) {
                const { index } = this.getAccountAndIndexByAddress(this.accountData.address);
                order = index + 1;
            }

            return order.toString(10);
        },
    },

    mounted() {
        this.account = this.getAccountByAddress(this.accountData.address);
    },

    methods: {
        /**
         * @param {string} _value
         * @return {boolean}
         */
        checkName(_value) {
            return !!_value.trim();
        },

        /**
         * @param {string} _value
         * @return {boolean}
         */
        checkOrder(_value) {
            let ok = false;
            const value = parseInt(_value);

            if (!isNaN(value)) {
                ok = value > 0 && value <= this.accounts.length;
            }

            return ok;
        },

        /**
         * @param {{detail: {data: {}}}} _event
         */
        onFormSubmit(_event) {
            const { accountData } = this;
            const { data } = _event.detail;
            const { name } = data;
            const order = parseInt(data.order);
            let changed = false;

            if (this.checkName(name) && this.checkOrder(order)) {
                const adName = this.account.name || accountData.address;

                changed = adName !== name || parseInt(this.accountOrder) !== order;

                if (changed) {
                    this.$store.dispatch(UPDATE_ACCOUNT, { address: accountData.address, name, order });
                }

                this.$emit('account-settings-form-data', { name, order, changed });
            }
        },
    },
};
</script>
