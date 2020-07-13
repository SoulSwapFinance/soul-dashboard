<template>
    <span class="f-back-button" @click="onClick">
        <slot> <icon data="@/assets/svg/chevron-left.svg" width="20" height="20" aria-hidden="true" /> Back </slot>
    </span>
</template>

<script>
export default {
    name: 'FBackButton',

    props: {
        routeName: {
            type: String,
            default: '',
        },
    },

    methods: {
        onClick() {
            if (this.routeName) {
                this.$router.replace({ name: this.routeName });
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
