<template>
    <f-card class="receive-coins f-card-double-padding">
        <h2>Receive Opera FTM</h2>

        <h3 class="align-center h2">What blockchain are you receiving FTM from?</h3>

        <blockchain-picker @blockchain-pick="onBlockchainPick" />

        <component
            :is="currentComponent"
            v-bind="currentComponentProperties"
            @change-component="onChangeComponent"
        ></component>
    </f-card>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import BlockchainPicker from '../BlockchainPicker/BlockchainPicker.vue';
import ReceiveFTM from './ReceiveFTM.vue';
import ReceiveBNB from './ReceiveBNB.vue';
import ReceiveETH from './ReceiveETH.vue';
import TransactionCompleting from '../TransactionCompleting/TransactionCompleting.vue';
import { eventBusMixin } from '../../mixins/event-bus.js';

const DEFAULT_COMPONENT = 'receive-f-t-m';

export default {
    name: 'ReceiveCoins',

    components: { BlockchainPicker, FCard, ReceiveFTM, ReceiveBNB, ReceiveETH, TransactionCompleting },

    mixins: [eventBusMixin],

    props: {
        /** Start verify FTM account in ReceiveFTM component */
        verifyAccount: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            currentComponent: DEFAULT_COMPONENT,
            // keepAliveExclude: 'BlockchainPicker',
        };
    },

    computed: {
        currentComponentProperties() {
            switch (this.currentComponent) {
                case 'receive-f-t-m':
                    return {
                        verifyAccount: this.verifyAccount,
                    };
                case 'transaction-completing':
                    return {
                        receive: true,
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
         * @param {('opera'|'binance'|'ethereum')} _blockchain
         */
        onBlockchainPick(_blockchain) {
            switch (_blockchain) {
                case 'opera':
                    this.currentComponent = 'ReceiveFTM';
                    break;
                case 'binance':
                    this.currentComponent = 'ReceiveBNB';
                    break;
                case 'ethereum':
                    this.currentComponent = 'ReceiveETH';
                    break;
            }
        },

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
            const { currentComponent } = this;

            this.currentComponent = '';
            this.$nextTick(() => {
                this.currentComponent = currentComponent;
            });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
