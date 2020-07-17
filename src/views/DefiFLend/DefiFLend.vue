<template>
    <div class="defi-flend">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> fLend</h1>

        <h2 class="perex">Earn interest on loans. Borrow tokens to trade.</h2>

        <button class="btn large" @click="onBorrowClick">Borrow assets</button>
    </div>
</template>

<script>
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';

export default {
    name: 'DefiFLend',

    components: { FBackButton },

    computed: {
        backButtonRoute() {
            const parentNode = getAppParentNode('defi-flend');

            return parentNode ? parentNode.route : '';
        },
    },

    methods: {
        onBorrowClick() {
            this.$router.push({ name: 'defi-manage-borrow-view' });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
