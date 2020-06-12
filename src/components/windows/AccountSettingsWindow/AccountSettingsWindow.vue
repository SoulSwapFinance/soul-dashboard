<template>
    <div class="account-settings-window">
        <f-window
            ref="win"
            modal
            style="max-width: 600px;"
            title="Wallet Settings"
            class="double-body-padding c-footer_"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            @window-hide="onWindowHide"
        >
            <account-settings-form
                :account-data="accountData"
                @account-settings-form-data="onAccountSettingsFormData"
            />
        </f-window>
    </div>
</template>

<script>
import FWindow from '../../core/FWindow/FWindow.vue';
import AccountSettingsForm from '../../forms/AccountSettingsForm.vue';

export default {
    name: 'AccountSettingsWindow',

    components: { AccountSettingsForm, FWindow },

    props: {
        /** Account data */
        accountData: {
            type: Object,
            default() {
                return {
                    address: '',
                    order: -1,
                };
            },
            required: true,
        },
    },

    methods: {
        show() {
            this.$refs.win.show();
        },

        /**
         * Called when `AccountSettingsForm` is submited.
         */
        onAccountSettingsFormData() {
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
