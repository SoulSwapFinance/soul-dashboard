<template>
    <div class="remove-account-window">
        <f-window
            ref="win"
            modal
            title="Remove Wallet"
            style="max-width: 560px"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            @window-hide="onWindowHide"
        >
            <div class="align-center">
                Are you sure you want to remove wallet <span class="break-word">{{ dAccount.address }}</span> ?
            </div>
            <br />
            <f-message type="warning" with-icon>
                Removing a wallet clears it from local storage. You will not be able to access it again unless you
                restore via mnemonic phrase, keystore file or private key. This action is irreversible.
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
import { REMOVE_ACCOUNT_BY_ADDRESS } from '../../../store/actions.type.js';
import { mapGetters } from 'vuex';
import FMessage from '../../core/FMessage/FMessage.vue';

export default {
    name: 'RemoveAccountWindow',

    components: { FMessage, FWindow },

    props: {
        account: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            dAccount: this.currentAccount,
        };
    },

    computed: {
        ...mapGetters(['currentAccount', 'accounts']),
    },

    watch: {
        account(_value) {
            this.dAccount = _value;
        },
    },

    created() {
        this.dAccount = this.currentAccount;
    },

    methods: {
        show() {
            this.$refs.win.show();
        },

        /**
         * Remove account by address.
         *
         * @param {string} _address
         */
        async removeAccount(_address) {
            const activeAccountRemoved = await this.$store.dispatch(REMOVE_ACCOUNT_BY_ADDRESS, _address);

            if (this.accounts.length === 0) {
                this.$router.replace({ path: '/' });
            } else if (activeAccountRemoved && this.$route.name !== 'dashboard') {
                this.$router.replace({ name: 'dashboard' });
            }
        },

        onRemoveBtnClick() {
            this.$refs.win.hide('fade-leave-active');
            this.removeAccount(this.dAccount.address);
            this.$emit('account-removed');
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
