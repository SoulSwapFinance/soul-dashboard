<template>
    <div class="address-actions-box">
        <ul v-if="!verticalMode" class="no-markers">
            <li>
                <f-copy-button
                    :text="currentAccount.address"
                    tooltip="Copy Address"
                    :hide-popover-after="3100"
                    class="btn large light same-size round"
                >
                    <template #popover-text>
                        Address copied to clipboard. <br />
                        Warning: Use this address to receive Opera FTM only. If you are receiving FTM-ERC20 you need to
                        use a different address!
                    </template>
                </f-copy-button>
            </li>
            <li>
                <button class="btn large light same-size round" title="Show QR Code" @click="$refs.qrWindow.show()">
                    <icon data="@/assets/svg/qr.svg" width="20" height="20" aria-hidden="true" />
                </button>
            </li>
            <li v-if="downloadKeystoreFile">
                <button
                    class="btn large light same-size round"
                    title="Download Keystore"
                    @click="onDownloadKeystoreClick"
                >
                    <icon data="@/assets/svg/download.svg" width="20" height="20" aria-hidden="true" />
                </button>
            </li>
            <li v-if="currentAccount.isLedgerAccount">
                <router-link
                    :to="{ name: 'account-receive', params: { verify: true } }"
                    class="btn large light same-size round"
                    title="Verify Address on Ledger"
                >
                    <icon data="@/assets/svg/check.svg" width="20" height="20" />
                </router-link>
            </li>
            <li>
                <button
                    class="btn large light same-size round"
                    title="Edit Wallet"
                    @click="$refs.accountSettingsWindow.show()"
                >
                    <icon data="@/assets/svg/pen.svg" width="16" height="16" aria-hidden="true" />
                </button>
            </li>
        </ul>
        <ul v-else class="no-markers vertical-mode">
            <li>
                <f-copy-button
                    :text="currentAccount.address"
                    :hide-popover-after="3100"
                    class="btn large light"
                    @window-hide="onWindowHide"
                >
                    <icon data="@/assets/svg/copy.svg" width="20" height="20" aria-hidden="true" />
                    Copy Address
                    <template #popover-text>
                        Address copied to clipboard. <br />
                        Warning: Use this address to receive Opera FTM only. If you are receiving FTM-ERC20 you need to
                        use a different address!
                    </template>
                </f-copy-button>
            </li>
            <li>
                <button class="btn large light" @click="$refs.qrWindow.show()">
                    <icon data="@/assets/svg/qr.svg" width="20" height="20" aria-hidden="true" />
                    Show QR Code
                </button>
            </li>
            <li v-if="currentAccount.isLedgerAccount">
                <router-link :to="{ name: 'account-receive', params: { verify: true } }" class="btn large light">
                    <icon data="@/assets/svg/check.svg" width="20" height="20" />
                    Verify Address on Ledger
                </router-link>
            </li>
            <li>
                <button class="btn large light" @click="$refs.accountSettingsWindow.show()">
                    <icon data="@/assets/svg/pen.svg" width="16" height="16" aria-hidden="true" />
                    Edit Wallet
                </button>
            </li>
            <li v-if="downloadKeystoreFile">
                <button class="btn large light" @click="onDownloadKeystoreClick">
                    <icon data="@/assets/svg/download.svg" width="20" height="20" aria-hidden="true" />
                    Download Keystore
                </button>
            </li>
        </ul>

        <q-r-code-window ref="qrWindow" :address="currentAccount.address" @window-hide="onWindowHide">
            <f-message type="info" with-icon>
                Warning: Use this address to receive Opera FTM only. If you are receiving FTM-ERC20 you need to use a
                different address!
            </f-message>
        </q-r-code-window>

        <account-settings-window ref="accountSettingsWindow" :account-data="accountData" @window-hide="onWindowHide" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';
import AccountSettingsWindow from '../windows/AccountSettingsWindow/AccountSettingsWindow.vue';
import QRCodeWindow from '../windows/QRCodeWindow/QRCodeWindow.vue';
import { clientInfo } from '../../utils/client-info.js';
import FMessage from '../core/FMessage/FMessage.vue';

export default {
    components: { FMessage, QRCodeWindow, AccountSettingsWindow, FCopyButton },

    props: {
        /** Show buttons with labels. */
        verticalMode: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        ...mapGetters(['currentAccount']),

        accountData() {
            return {
                address: this.currentAccount.address,
                order: -1,
            };
        },

        downloadKeystoreFile() {
            return !this.currentAccount.isLedgerAccount && !clientInfo.mobile;
        },
    },

    methods: {
        onDownloadKeystoreClick() {
            const { keystore } = this.currentAccount;

            if (keystore) {
                this.$fWallet.downloadKeystore(keystore);
            }
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
