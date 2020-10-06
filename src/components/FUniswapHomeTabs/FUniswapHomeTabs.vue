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
            <label for="funiswap-home-tabs-pool">
                <input
                    id="funiswap-home-tabs-pool"
                    v-model="tab"
                    type="radio"
                    name="tab"
                    value="pool"
                    class="not-visible"
                />
                <span class="funiswap-home-tabs__title">Pool</span>
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
