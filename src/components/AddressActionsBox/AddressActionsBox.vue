<template>
    <div class="address-actions-box">
        <ul class="no-markers">
            <li>
                <f-copy-button :text="currentAccount.address" class="btn large light same-size round" />
            </li>
            <li>
                <button class="btn large light same-size round" title="qr code of address" @click="onButtonClick">
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
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';

export default {
    components: { FCopyButton },
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

        onButtonClick() {
            alert('not implemented yet');
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
