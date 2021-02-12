<template>
    <div class="flendmarketview">
        <f-view-transition watch-route :views-structure="viewsStructure">
            <router-view></router-view>
        </f-view-transition>
    </div>
</template>

<script>
import FViewTransition from '@/components/core/FViewTransition/FViewTransition.vue';
import { appStructureTree } from '@/app-structure.js';

export default {
    name: 'FLendMarketView',

    components: { FViewTransition },

    computed: {
        viewsStructure() {
            const node = appStructureTree.serialize(appStructureTree.get('f-lend-market-view'));

            return node ? [JSON.parse(node)] : [];
        },
    },
};
</script>
