<template>
    <ul class="funiswap-home-tabs no-markers">
        <li>
            <label for="funiswap-home-tabs-swap">
                <input
                    id="funiswap-home-tabs-swap"
                    v-model="tab"
                    type="radio"
                    name="tab"
                    value="swap"
                    class="not-visible"
                />
                <span class="funiswap-home-tabs__title">Swap</span>
            </label>
        </li>
        <li>
            <label for="funiswap-home-tabs-add-liquidity" class="align-center">
                <input
                    id="funiswap-home-tabs-add-liquidity"
                    v-model="tab"
                    type="radio"
                    name="tab"
                    value="add-liquidity"
                    class="not-visible"
                />
                <span class="funiswap-home-tabs__title">Add Liquidity</span>
            </label>
        </li>
        <li>
            <label for="funiswap-home-tabs-remove-liquidity" class="align-right">
                <input
                    id="funiswap-home-tabs-remove-liquidity"
                    v-model="tab"
                    type="radio"
                    name="tab"
                    value="remove-liquidity"
                    class="not-visible"
                />
                <span class="funiswap-home-tabs__title">Remove Liquidity</span>
            </label>
        </li>
    </ul>
</template>

<script>
import appConfig from '../../../app.config.js';

export default {
    name: 'FUniswapHomeTabs',

    props: {
        activeTab: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            tab: this.activeTab,
            appConfig: appConfig,
        };
    },

    watch: {
        activeTab(_value, _oldValue) {
            if (_value !== _oldValue && _value) {
                this.tab = _value;
            }
        },

        tab(_value, _oldValue) {
            if (_value !== _oldValue) {
                this.$emit('tab-selected', _value);
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
