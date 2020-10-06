<template>
    <div class="view-funiswap-home">
        <f-uniswap-swap :slippage-tolerance="fUniswapSlippageTolerance" />
    </div>
</template>

<script>
import FUniswapSwap from '@/components/FUniswapSwap/FUniswapSwap.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'FUniswapHome',

    components: { FUniswapSwap },

    computed: {
        ...mapGetters(['fUniswapSlippageTolerance']),
    },
};
</script>
