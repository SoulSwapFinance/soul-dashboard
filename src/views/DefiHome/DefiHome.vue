<template>
    <div class="view-defi-home">
        <defi-menu />
        <defi-home-tabs />
    </div>
</template>

<script>
import DefiMenu from '../../components/DefiMenu/DefiMenu.vue';
import DefiHomeTabs from '@/components/DefiHomeTabs/DefiHomeTabs.vue';

export default {
    name: 'DefiHome',

    components: { DefiHomeTabs, DefiMenu },
};
</script>
