<template>
    <span class="f-back-button" @click="onClick">
        <slot>
            <!--<icon data="@/assets/svg/chevron-left.svg" width="12" height="12" aria-hidden="true" />-->
            Back
        </slot>
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
        params: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    methods: {
        onClick() {
            if (this.routeName) {
                this.$router.replace({ name: this.routeName, params: this.params });
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
