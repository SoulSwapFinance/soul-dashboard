<template>
    <div class="create-account-window">
        <f-window
            ref="win"
            modal
            style="max-width: 720px;"
            class="colored-header create-account-color double-body-padding c-footer"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            @window-hide="onWindowHide"
        >
            <template #title>
                <h2>
                    Create a new wallet
                    <span class="steps"> {{ dStep }} <span class="count">/ 4</span> </span>
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
            />
        </f-window>
    </div>
</template>

<script>
import FWindow from '../../core/FWindow/FWindow.vue';
import CreateAccount from '../../../views/CreateAccount/CreateAccount.vue';

export default {
    name: 'CreateAccountWindow',

    components: { FWindow },

    mixins: [CreateAccount],

    methods: {
        show() {
            this.$refs.win.show();
        },

        /**
         * Re-target `'window-hide'` event.
         *
         * @param {object} _data
         */
        onWindowHide(_data) {
            this.setDefaultComponent();

            this.$emit('window-hide', _data);
        },
    },
};
</script>
