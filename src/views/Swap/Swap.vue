<template>
    <div class="view-swap">
        <f-view-transition watch-route :views-structure="viewsStructure">
            <router-view></router-view>
        </f-view-transition>
    </div>
</template>

<script>
import FViewTransition from '@/components/core/FViewTransition/FViewTransition.vue';
import { appStructureTree } from '@/app-structure.js';

export default {
    name: 'Swap',

    components: { FViewTransition },

    computed: {
        viewsStructure() {
            const node = appStructureTree.serialize(appStructureTree.get('swap'));

            return node ? [JSON.parse(node)] : [];
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
