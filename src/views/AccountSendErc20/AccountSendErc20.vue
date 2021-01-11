<template>
    <div class="view-account-send-erc20 account-main-content-mt">
        <h1 class="not-visible">Send Erc20 token</h1>

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
import SendTransactionForm from '../../components/forms/SendTransactionForm.vue';
import TransactionSuccessMessage from '../../components/TransactionSuccessMessage/TransactionSuccessMessage.vue';
import TransactionConfirmation from '../../components/TransactionConfirmation/TransactionConfirmation.vue';
import TransactionRejectMessage from '../../components/TransactionRejectMessage/TransactionRejectMessage.vue';
import { eventBusMixin } from '@/mixins/event-bus.js';
import { SET_SEND_DIRECTION } from '@/store/mutations.type.js';

const DEFAULT_COMPONENT = 'send-transaction-form';

export default {
    name: 'AccountSendErc20',

    components: {
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
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },

        currentComponentProperties() {
            const { token } = this.params;

            switch (this.currentComponent) {
                case 'send-transaction-form':
                    return {
                        token: { ...token },
                    };
                case 'transaction-confirmation':
                    return {
                        txData: this._data_,
                        token: { ...token },
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
        this.$store.commit(SET_SEND_DIRECTION, 'OperaToOpera');

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
