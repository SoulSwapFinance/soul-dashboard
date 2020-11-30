<template>
    <div class="view-add-liquidity">
        <f-view-transition watch-route :views-structure="viewsStructure">
            <router-view></router-view>
        </f-view-transition>
    </div>
</template>

<script>
import FViewTransition from '@/components/core/FViewTransition/FViewTransition.vue';
import { appStructureTree } from '@/app-structure.js';

export default {
    name: 'AddLiquidity',

    components: { FViewTransition },

    computed: {
        viewsStructure() {
            const node = appStructureTree.serialize(appStructureTree.get('add-liquidity'));

            return node ? [JSON.parse(node)] : [];
        },
    },
};
</script>
