<template>
    <div class="view-funiswap-home">
        <h1>fUNI</h1>
        <f-uniswap-home-tabs :active-tab="activeTab" @tab-selected="onTabSelected" />
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
import { defer } from '@/utils';

const DEFAULT_COMPONENT = 'f-uniswap-swap';

export default {
    name: 'FUniswapHome',

    components: { FUniswapHomeTabs, FUniswapSwap, FUniswapAddLiquidity, FUniswapRemoveLiquidity },

    mixins: [eventBusMixin],

    data() {
        return {
            currentComponent: DEFAULT_COMPONENT,
            activeTab: 'swap',
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
         * @param {string} _componentName
         * @return {string}
         */
        getTabCodeByComponentName(_componentName) {
            if (_componentName === 'f-uniswap-swap') {
                return 'swap';
            } else if (_componentName === 'f-uniswap-add-liquidity') {
                return 'add-liquidity';
            } else if (_componentName === 'f-uniswap-remove-liquidity') {
                return 'remove-liquidity';
            }

            return '';
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
            const { currentComponent } = this;

            if (!currentComponent) {
                return;
            }

            this.activeTab = '';
            this.currentComponent = '';

            defer(() => {
                this.currentComponent = currentComponent;
                this.activeTab = this.getTabCodeByComponentName(this.currentComponent);
            });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
