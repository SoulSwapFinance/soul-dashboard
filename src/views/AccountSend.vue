<template>
    <div class="view-account-send account-main-content-mt">
        <h1 class="not-visible">Send</h1>

        <!-- <keep-alive :exclude="keepAliveExclude"> -->
        <keep-alive>
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
import BlockchainPickerForm from '../components/forms/BlockchainPickerForm.vue';
import TransactionCompleting from '../components/TransactionCompleting/TransactionCompleting.vue';
import { eventBusMixin } from '../mixins/event-bus.js';

const DEFAULT_COMPONENT = 'blockchain-picker-form';

export default {
    components: {
        TransactionCompleting,
        BlockchainPickerForm,
        SendTransactionForm,
        TransactionSuccessMessage,
        TransactionConfirmation,
        TransactionRejectMessage,
    },

    mixins: [eventBusMixin],

    data() {
        return {
            currentComponent: DEFAULT_COMPONENT,
            // keepAliveExclude: 'BlockchainPicker',
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
                    return this._data_;
                case 'transaction-completing':
                    return {
                        tokenSwapData: this._data_,
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
            this._data_ = _data.data;

            this.currentComponent = _data.to;

            this.$nextTick(() => {
                this._data_ = null;
            });
        },

        onAccountPicked() {
            if (this.currentComponent !== DEFAULT_COMPONENT) {
                this.currentComponent = DEFAULT_COMPONENT;
            } else {
                // to reset send-transaction-form properly
                this.currentComponent = '';
                this.$nextTick(() => {
                    this.currentComponent = DEFAULT_COMPONENT;
                });
            }
        },
    },
};
</script>

<style lang="scss"></style>
