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
import SetPasswordForm from '../components/forms/SetPasswordForm.vue';
import SendTransactionForm from '../components/forms/SendTransactionForm.vue';
import TransactionSuccessMessage from '../components/TransactionSuccessMessage/TransactionSuccessMessage.vue';

export default {
    components: { SetPasswordForm, SendTransactionForm, TransactionSuccessMessage },

    data() {
        return {
            currentComponent: 'send-transaction-form',
        };
    },

    computed: {
        currentComponentProperties() {
            switch (this.currentComponent) {
                case 'set-password-form':
                    return {
                        data: this._data_,
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
            if (_data.to === 'set-password-form') {
                this._data_ = _data.data;

                this.currentComponent = 'set-password-form';
            } else if (_data.to === 'transaction-success-message') {
                this._data_ = _data.data.tx;

                this.currentComponent = 'transaction-success-message';
            }

            this.$nextTick(() => {
                this._data_ = null;
            });
        },
    },
};
</script>

<style lang="scss"></style>
