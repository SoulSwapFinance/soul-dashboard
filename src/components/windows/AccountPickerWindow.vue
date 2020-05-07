<template>
    <div class="account-picker window">
        <f-window
            ref="win"
            modal
            style="max-width: 1050px; height: 100%;"
            title="Pick an Account"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
        >
            <account-list @account-picked="onAccountPicked" />
        </f-window>
    </div>
</template>

<script>
import FWindow from '../core/FWindow/FWindow.vue';
import AccountList from '../AccountList/AccountList.vue';

export default {
    name: 'AccountPickerWindow',

    components: { AccountList, FWindow },

    methods: {
        show() {
            this.$refs.win.show();
        },

        onAccountPicked() {
            this.$refs.win.hide('scale-center-forward-leave-active');
        },
    },
};
</script>
