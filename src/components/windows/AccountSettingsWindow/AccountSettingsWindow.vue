<template>
    <div class="account-settings-window">
        <f-window
            ref="win"
            modal
            style="max-width: 530px;"
            title="Wallet Settings"
            class="double-body-padding_ c-footer_"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
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
    },
};
</script>
