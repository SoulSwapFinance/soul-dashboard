<template>
    <div class="f-uniswap-pools">
        <pairs-list />
    </div>
</template>

<script>
import PairsList from '@/components/data-tables/PairsList/PairsList.vue';

export default {
    name: 'FUniswapPools',

    components: { PairsList },
};
</script>
