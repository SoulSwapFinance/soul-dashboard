<template>
    <div class="view-defi-mint">
        DeFi Mint

        <defi-price-input :value="tmp" @defi-price-input-change="onDefiPriceInputChange" />
    </div>
</template>

<script>
import DefiPriceInput from '../../components/DefiPriceInput/DefiPriceInput.vue';

export default {
    name: 'DefiMint',

    components: { DefiPriceInput },

    data() {
        return {
            tmp: '25',
        };
    },

    methods: {
        onDefiPriceInputChange(_data) {
            console.log('onDefiPriceInputChange', _data);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
