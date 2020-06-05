<template>
    <div class="restore-account-window">
        <f-window
            ref="win"
            modal
            style="max-width: 720px;"
            class="colored-header restore-account-color double-body-padding c-main c-footer"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            @window-hide="onWindowHide"
        >
            <template #title>
                <h2>
                    Restore wallet
                    <span class="steps">
                        {{ dStep }} <span class="count">/ {{ dStepsCount }}</span>
                    </span>
                </h2>
            </template>
            <template #controls>
                <button class="btn white-btn close-btn same-size round light" title="Close window">
                    <icon data="@/assets/svg/times.svg" width="20" height="20" />
                </button>
            </template>
            <component
                :is="dCurrentComponent"
                v-bind="cCurrentComponentProperties"
                @change-component="onChangeComponent"
                @steps-count="onStepsCount"
            ></component>
        </f-window>
    </div>
</template>

<script>
import FWindow from '../../core/FWindow/FWindow.vue';
import RestoreAccount from '../../../views/RestoreAccount/RestoreAccount.vue';

export default {
    name: 'RestoreAccountWindow',

    components: { FWindow },

    mixins: [RestoreAccount],

    methods: {
        show() {
            this.$refs.win.show();
        },

        /**
         * @param {object} _data
         */
        onWindowHide(_data) {
            this.setDefaultComponent();

            this.$emit('window-hide', _data);
        },
    },
};
</script>
