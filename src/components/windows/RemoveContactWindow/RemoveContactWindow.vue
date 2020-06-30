<template>
    <div class="remove-contact-window">
        <f-window
            ref="win"
            modal
            title="Remove Wallet"
            style="max-width: 560px;"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            @window-hide="onWindowHide"
        >
            <div class="align-center">
                Are you sure you want to remove contact <span class="break-word">{{ contactAddress }}</span> ?
            </div>
            <br />
            <f-message type="warning" with-icon>
                Removing a contact clears it from local storage.
            </f-message>
            <br />
            <div class="align-center form-buttons">
                <button class="btn large secondary" @click="$refs.win.hide()">Cancel</button>
                <button class="btn large" @click="onRemoveBtnClick">Remove</button>
            </div>
        </f-window>
    </div>
</template>

<script>
import FWindow from '../../core/FWindow/FWindow.vue';
import FMessage from '../../core/FMessage/FMessage.vue';
import { mapGetters } from 'vuex';
import { REMOVE_CONTACT } from '../../../store/mutations.type.js';

export default {
    name: 'RemoveContactWindow',

    components: { FMessage, FWindow },

    props: {
        contactAddress: {
            type: String,
            default: '',
        },
    },

    computed: {
        ...mapGetters(['currentAccount', 'getContactAndIndexByAddress']),
    },

    methods: {
        show() {
            this.$refs.win.show();
        },

        onRemoveBtnClick() {
            const contact = this.getContactAndIndexByAddress(this.contactAddress);

            this.$refs.win.hide('fade-leave-active');

            if (contact.contact) {
                this.$store.commit(REMOVE_CONTACT, contact.index);
            }

            this.$emit('contact-removed');
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
