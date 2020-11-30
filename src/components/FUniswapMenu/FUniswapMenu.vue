<template>
    <div class="funiswap-menu">
        <f-simple-navigation :items="navigation"></f-simple-navigation>
    </div>
</template>

<script>
import FSimpleNavigation from '@/components/core/FSimpleNavigation/FSimpleNavigation.vue';

export default {
    name: 'FUniswapMenu',

    components: { FSimpleNavigation },

    data() {
        return {
            /** Navigation items. */
            navigation: [
                {
                    url: {
                        name: 'funiswap-swap',
                    },
                    title: 'Swap',
                },
                {
                    url: {
                        name: 'funiswap-pools',
                    },
                    title: 'Pools',
                },
            ],
        };
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
