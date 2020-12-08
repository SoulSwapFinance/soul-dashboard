<template>
    <div class="tx-confirmation-window">
        <f-window
            ref="win"
            modal
            class="tx-confirmation-f-window"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            no-controls
            :hide-on-escape-key="false"
            :body-min-height="bodyMinHeight"
            @window-hide="$emit('window-hide', $event)"
        >
            <template #title>
                <h2>Confirmation</h2>
                <f-steps v-if="stepsCount > 0" :count="stepsCount" :active="activeStep" />
            </template>
            <slot></slot>
        </f-window>
    </div>
</template>

<script>
import FWindow from '@/components/core/FWindow/FWindow.vue';
import FSteps from '@/components/core/FSteps/FSteps.vue';

export default {
    name: 'TxConfirmationWindow',

    components: { FSteps, FWindow },

    props: {
        /** Minimal height of window's body. */
        bodyMinHeight: {
            type: String,
            default: 'auto',
        },
        /** Count of steps */
        stepsCount: {
            type: Number,
            default: 0,
        },
        /** Active step (`<1, stepsCount>`) */
        activeStep: {
            type: Number,
            default: 1,
        },
    },

    data() {
        return {
            currentComponent: '',
        };
    },

    methods: {
        show() {
            this.$refs.win.show();
        },

        hide() {
            this.$refs.win.hide();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
