<template>
    <div class="view-account-send account-main-content-mt">
        <h1 class="not-visible">Send</h1>

        <keep-alive :exclude="keepAliveExclude">
            <component
                :is="currentComponent"
                v-bind="currentComponentProperties"
                @change-component="onChangeComponent"
            ></component>
        </keep-alive>
    </div>
</template>

<script>
import SendTransactionForm from '../components/forms/SendTransactionForm.vue';
import TransactionSuccessMessage from '../components/TransactionSuccessMessage/TransactionSuccessMessage.vue';
import TransactionConfirmation from '../components/TransactionConfirmation/TransactionConfirmation.vue';
import TransactionRejectMessage from '../components/TransactionRejectMessage/TransactionRejectMessage.vue';
import { eventBusMixin } from '../mixins/event-bus.js';

const DEFAULT_COMPONENT = 'send-transaction-form';

export default {
    components: { SendTransactionForm, TransactionSuccessMessage, TransactionConfirmation, TransactionRejectMessage },

    mixins: [eventBusMixin],

    data() {
        return {
            currentComponent: DEFAULT_COMPONENT,
            keepAliveExclude: 'SendTransactionForm',
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

        this._eventBus.on('account-picked', this.onAccountPicked);
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

        onAccountPicked() {
            // this.keepAliveExclude = 'SendTransactionForm';
            this.currentComponent = DEFAULT_COMPONENT;
            // this.keepAliveExclude = '';
        },
    },
};
</script>

<style lang="scss"></style>
