<template>
    <div class="view-defi-mint">
        DeFi Mint

        <div class="tmp-cont">
            <span>{{ tmp }}</span>
            <f-slider v-model="tmp" min="1" max="100" use-lower-fill-bar />
        </div>
    </div>
</template>

<script>
import FSlider from '../../components/core/FSlider/FSlider.vue';
export default {
    name: 'DefiMint',

    components: { FSlider },

    data() {
        return {
            tmp: 25,
        };
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
