<template>
    <div class="view-account-send account-main-content-mt">
        <h1 class="not-visible">Send</h1>

        <component
            :is="currentComponent"
            v-bind="currentComponentProperties"
            @change-component="onChangeComponent"
        ></component>
    </div>
</template>

<script>
import SendTransactionForm from '../components/forms/SendTransactionForm.vue';
import TransactionSuccessMessage from '../components/TransactionSuccessMessage/TransactionSuccessMessage.vue';
import TransactionConfirmation from '../components/TransactionConfirmation/TransactionConfirmation.vue';

export default {
    components: { SendTransactionForm, TransactionSuccessMessage, TransactionConfirmation },

    data() {
        return {
            currentComponent: 'send-transaction-form',
        };
    },

    computed: {
        currentComponentProperties() {
            switch (this.currentComponent) {
                case 'transaction-confirmation':
                    return {
                        txData: this._data_,
                    };
                case 'transaction-success-message':
                    return {
                        tx: this._data_,
                    };
                default:
                    return null;
            }
        },
    },

    created() {
        // temporary data
        this._data_ = null;
    },

    methods: {
        /**
         * @param {Object} _data
         */
        onChangeComponent(_data) {
            if (_data.to === 'transaction-confirmation') {
                this._data_ = _data.data;
            } else if (_data.to === 'transaction-success-message') {
                this._data_ = _data.data.tx;
            }

            this.currentComponent = _data.to;

            this.$nextTick(() => {
                this._data_ = null;
            });
        },
    },
};
</script>

<style lang="scss"></style>
