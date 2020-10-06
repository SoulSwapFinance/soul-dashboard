<template>
    <div class="view-funiswap-home">
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
import { mapGetters } from 'vuex';
import FUniswapHomeTabs from '@/components/FUniswapHomeTabs/FUniswapHomeTabs.vue';
import { eventBusMixin } from '@/mixins/event-bus.js';

const DEFAULT_COMPONENT = 'f-uniswap-swap';

export default {
    name: 'FUniswapHome',

    components: { FUniswapHomeTabs, FUniswapSwap },

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
            console.log('tab selected', _tabCode);
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
