<template>
    <div class="address-actions-box">
        <ul class="no-markers">
            <li>
                <f-copy-button :text="currentAccount.address" class="btn large light same-size round" />
            </li>
            <li>
                <button
                    class="btn large light same-size round"
                    title="QR code of address"
                    @click="$refs.qrWindow.show()"
                >
                    <icon data="@/assets/svg/qr.svg" width="20" height="20" aria-hidden="true" />
                </button>
            </li>
            <li v-if="!currentAccount.isLedgerAccount">
                <button
                    class="btn large light same-size round"
                    title="Download keystore"
                    @click="onDownloadKeystoreClick"
                >
                    <icon data="@/assets/svg/download.svg" width="20" height="20" aria-hidden="true" />
                </button>
            </li>
            <li v-if="currentAccount.isLedgerAccount">
                <router-link
                    :to="{ name: 'account-receive' }"
                    class="btn large light same-size round"
                    title="Verify Address on Ledger"
                >
                    <icon data="@/assets/svg/check.svg" width="20" height="20" />
                </router-link>
            </li>
            <li>
                <button
                    class="btn large light same-size round"
                    title="Edit Account"
                    @click="$refs.accountSettingsWindow.show()"
                >
                    <icon data="@/assets/svg/pen.svg" width="16" height="16" aria-hidden="true" />
                </button>
            </li>
        </ul>

        <f-window
            ref="qrWindow"
            modal
            title="Address"
            style="max-width: 620px;"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
        >
            <h3 class="break-word h2 align-center">{{ currentAccount.address }}</h3>
            <vue-q-r-code-component :text="currentAccount.address" class="qr-code" />
        </f-window>

        <account-settings-window ref="accountSettingsWindow" :account-data="accountData" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';
import VueQRCodeComponent from 'vue-qrcode-component';
import FWindow from '../core/FWindow/FWindow.vue';
import AccountSettingsWindow from '../windows/AccountSettingsWindow/AccountSettingsWindow.vue';

export default {
    components: { AccountSettingsWindow, FWindow, FCopyButton, VueQRCodeComponent },

    computed: {
        ...mapGetters(['currentAccount']),

        accountData() {
            return {
                address: this.currentAccount.address,
                order: -1,
            };
        },
    },

    methods: {
        onDownloadKeystoreClick() {
            const { keystore } = this.currentAccount;

            if (keystore) {
                this.$fWallet.downloadKeystore(keystore);
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
