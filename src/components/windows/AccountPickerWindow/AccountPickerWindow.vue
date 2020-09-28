<template>
    <div class="account-picker-window">
        <f-window
            ref="win"
            modal
            style="max-width: 1050px;"
            title="Select Wallet"
            class="account-picker-f-window normal-padding"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            @window-hide="onWindowHide"
        >
            <account-list @account-picked="onAccountPicked" />
        </f-window>
    </div>
</template>

<script>
import FWindow from '../../core/FWindow/FWindow.vue';
import AccountList from '../../AccountList/AccountList.vue';

export default {
    name: 'AccountPickerWindow',

    components: { AccountList, FWindow },

    methods: {
        show() {
            this.$refs.win.show();
        },

        onAccountPicked() {
            this.$refs.win.hide('fade-leave-active');
        },

        /**
         * Re-target `'window-hide'` event.
         *
         * @param {object} _data
         */
        onWindowHide(_data) {
            this.$emit('window-hide', _data);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
