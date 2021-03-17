<template>
    <nav class="dashboard-actions-box actions-box">
        <ul class="no-markers">
            <li>
                <span class="action" title="Connect Wallet" @click="onConnectWalletClick">
                    <button class="btn ledger-accounts-btn large same-size round">
                        <icon data="@/assets/svg/connect.svg" width="20" height="20" aria-hidden="true" />
                    </button>
                    <span class="link-label ledger-accounts-color">Connect Wallet</span>
                </span>
            </li>
            <li>
                <span class="action" title="Create Wallet" @click="onCreateAWalletClick">
                    <button class="btn create-account-btn large same-size round">
                        <icon data="@/assets/svg/wallet.svg" width="20" height="20" :fill="false" aria-hidden="true" />
                    </button>
                    <span class="link-label create-account-color">Create Wallet</span>
                </span>
            </li>
            <li>
                <span class="action" title="Restore Wallet" @click="onRestoreWalletClick">
                    <button class="btn restore-account-btn large same-size round">
                        <icon data="@/assets/svg/key.svg" width="20" height="20" aria-hidden="true" />
                    </button>
                    <span class="link-label restore-account-color">Restore Wallet</span>
                </span>
            </li>
        </ul>

        <create-account-window ref="createAccountWindow" />
        <restore-account-window ref="restoreAccountWindow" />
        <connect-wallet-window ref="connectWalletWindow" />
    </nav>
</template>

<script>
import CreateAccountWindow from '../windows/CreateAccountWindow/CreateAccountWindow.vue';
import RestoreAccountWindow from '../windows/RestoreAccountWindow/RestoreAccountWindow.vue';
import ConnectWalletWindow from '@/components/windows/ConnectWalletWindow/ConnectWalletWindow.vue';

export default {
    name: 'DashboardActionsBox',

    components: { ConnectWalletWindow, RestoreAccountWindow, CreateAccountWindow },

    methods: {
        onCreateAWalletClick() {
            this.$refs.createAccountWindow.show();
        },

        onRestoreWalletClick() {
            this.$refs.restoreAccountWindow.show();
        },

        onConnectWalletClick() {
            this.$refs.connectWalletWindow.show();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
