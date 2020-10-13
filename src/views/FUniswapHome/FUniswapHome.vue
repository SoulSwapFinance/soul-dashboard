<template>
    <div class="view-funiswap-home">
        <h1>fUniswap</h1>
        <f-uniswap-home-tabs @tab-selected="onTabSelected" />
        <component
            :is="currentComponent"
            v-bind="currentComponentProperties"
            @change-component="onChangeComponent"
        ></component>
    </div>
</template>

<script>
import FUniswapSwap from '@/components/FUniswapSwap/FUniswapSwap.vue';
import FUniswapAddLiquidity from '@/components/FUniswapAddLiquidity/FUniswapAddLiquidity.vue';
import FUniswapRemoveLiquidity from '@/components/FUniswapRemoveLiquidity/FUniswapRemoveLiquidity.vue';
import { mapGetters } from 'vuex';
import FUniswapHomeTabs from '@/components/FUniswapHomeTabs/FUniswapHomeTabs.vue';
import { eventBusMixin } from '@/mixins/event-bus.js';

const DEFAULT_COMPONENT = 'f-uniswap-swap';

export default {
    name: 'FUniswapHome',

    components: { FUniswapHomeTabs, FUniswapSwap, FUniswapAddLiquidity, FUniswapRemoveLiquidity },

    mixins: [eventBusMixin],

    data() {
        return {
            currentComponent: DEFAULT_COMPONENT,
        };
    },

    computed: {
        ...mapGetters(['fUniswapSlippageTolerance']),

        currentComponentProperties() {
            switch (this.currentComponent) {
                case 'f-uniswap-swap':
                case 'f-uniswap-add-liquidity':
                case 'f-uniswap-remove-liquidity':
                    return {
                        slippageTolerance: this.fUniswapSlippageTolerance,
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

        onTabSelected(_tabCode) {
            if (_tabCode === 'swap') {
                this.currentComponent = 'f-uniswap-swap';
            } else if (_tabCode === 'add-liquidity') {
                this.currentComponent = 'f-uniswap-add-liquidity';
            } else if (_tabCode === 'remove-liquidity') {
                this.currentComponent = 'f-uniswap-remove-liquidity';
            }
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

<style lang="scss">
@import 'style';
</style>
