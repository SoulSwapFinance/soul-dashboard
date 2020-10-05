<template>
    <div class="view-funiswap-home">
        <f-uniswap-swap />
    </div>
</template>

<script>
import FUniswapSwap from '@/components/FUniswapSwap/FUniswapSwap.vue';

export default {
    name: 'FUniswapHome',

    components: { FUniswapSwap },
};
</script>
