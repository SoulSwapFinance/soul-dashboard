<template>
    <div class="view-transition animation-container children-absolute">
        <transition :name="transitionName">
            <slot></slot>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'FViewTransition',

    props: {
        watchRoute: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            transitionName: '',
        };
    },

    watch: {
        $route(_to) {
            if (this.watchRoute) {
                if (_to.name === 'defi-home') {
                    this.transitionName = 'slide-right';
                } else {
                    this.transitionName = 'slide-left';
                }
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
