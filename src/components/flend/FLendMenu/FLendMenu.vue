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
                        name: 'f-lend-market',
                    },
                    title: 'Market',
                },
                {
                    url: {
                        name: 'f-lend-deposits',
                    },
                    title: 'Deposits',
                },
                {
                    url: {
                        name: 'f-lend-borrows',
                    },
                    title: 'Borrows',
                },
            ],
        };
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
