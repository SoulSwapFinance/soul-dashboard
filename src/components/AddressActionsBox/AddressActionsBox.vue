<template>
    <div class="address-actions-box">
        <ul class="no-markers">
            <li>
                <f-copy-button :text="currentAccount.address" class="btn large light same-size round" />
            </li>
            <li>
                <button
                    class="btn large light same-size round"
                    title="qr code of address"
                    @click="$refs.qrWindow.show()"
                >
                    <icon data="@/assets/svg/qr.svg" width="20" height="20" aria-hidden="true" />
                </button>
            </li>
            <li v-if="!currentAccount.isLedgerAccount">
                <button
                    class="btn large light same-size round"
                    title="download keystore"
                    @click="onDownloadKeystoreClick"
                >
                    <icon data="@/assets/svg/download.svg" width="20" height="20" aria-hidden="true" />
                </button>
            </li>
            <li v-if="currentAccount.isLedgerAccount">
                <router-link
                    :to="{ name: 'account-recieve' }"
                    class="btn large light same-size round"
                    title="Verify Address on Ledger"
                >
                    <icon data="@/assets/svg/check.svg" width="20" height="20" />
                </router-link>
            </li>
        </ul>

        <f-window
            ref="qrWindow"
            modal
            title="Address"
            style="max-width: 620px;"
            transition-enter="scale-center-enter-active"
            transition-leave="scale-center-leave-active"
        >
            <h3 class="break-word h2 align-center" :class="addressCssClass">{{ currentAccount.address }}</h3>
            <vue-q-r-code-component :text="currentAccount.address" class="qr-code" />
        </f-window>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';
import VueQRCodeComponent from 'vue-qrcode-component';
import FWindow from '../core/FWindow/FWindow.vue';

export default {
    components: { FWindow, FCopyButton, VueQRCodeComponent },
    computed: {
        ...mapGetters(['currentAccount']),
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
