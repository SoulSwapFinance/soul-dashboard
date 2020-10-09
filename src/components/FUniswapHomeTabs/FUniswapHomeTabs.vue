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
            <label for="funiswap-home-tabs-add-liquidity">
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
            <label for="funiswap-home-tabs-remove-liquidity">
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
export default {
    name: 'FUniswapHomeTabs',

    data() {
        return {
            tab: 'swap',
        };
    },

    watch: {
        tab(_value) {
            this.$emit('tab-selected', _value);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
