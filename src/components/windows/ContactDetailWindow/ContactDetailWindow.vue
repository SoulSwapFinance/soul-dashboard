<template>
    <div class="contact-detail-window">
        <f-window
            ref="win"
            modal
            style="max-width: 600px;"
            :title="windowTitle"
            class="double-body-padding"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            @window-hide="onWindowHide"
        >
            <contact-detail-form
                :contact-data="contactData"
                :action="action"
                @contact-detail-form-data="onContactDetailFormData"
            />
        </f-window>
    </div>
</template>

<script>
import FWindow from '../../core/FWindow/FWindow.vue';
import ContactDetailForm from '../../forms/ContactDetailForm.vue';

export default {
    name: 'ContactDetailWindow',

    components: { ContactDetailForm, FWindow },

    props: {
        /** Contact data */
        contactData: {
            type: Object,
            default() {
                return {
                    address: '',
                    order: -1,
                    blockchain: 'fantom',
                };
            },
        },
        /**
         * Type of action with contact.
         *
         * @type {('new' | 'add' | 'edit')}
         */
        action: {
            type: String,
            default: 'new',
            validator: function (_value) {
                return ['new', 'add', 'edit'].indexOf(_value) !== -1;
            },
        },
    },

    computed: {
        windowTitle() {
            const { action } = this;

            if (action === 'new') {
                return 'New Contact';
            } else if (action === 'add') {
                return 'Add Contact';
            } else {
                return 'Edit Contact';
            }
        },
    },

    methods: {
        show() {
            this.$refs.win.show();
        },

        /**
         * Called when `ContactSettingsForm` is submited.
         */
        onContactDetailFormData() {
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

<style scoped></style>
