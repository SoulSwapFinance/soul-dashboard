<template>
    <div class="flendmenu submenu">
        <f-simple-navigation :items="navigation"></f-simple-navigation>
    </div>
</template>

<script>
import FSimpleNavigation from '@/components/core/FSimpleNavigation/FSimpleNavigation.vue';

export default {
    name: 'FLendMenu',

    components: { FSimpleNavigation },

    data() {
        return {
            /** Navigation items. */
            navigation: [
                {
                    url: {
                        name: 'flend-market',
                    },
                    title: 'Market',
                },
                {
                    url: {
                        name: 'flend-deposit',
                    },
                    title: 'Deposit',
                },
                {
                    url: {
                        name: 'flend-borrow',
                    },
                    title: 'Borrow',
                },
            ],
        };
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
