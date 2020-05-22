<template>
    <nav class="dashboard-actions-box actions-box">
        <ul class="no-markers">
            <li>
                <span class="action" title="Connect to Ledger" @click="onConnectToLedgerClick">
                    <button class="btn ledger-accounts-btn large same-size round">
                        <icon data="@/assets/svg/ledger-logo-icon.svg" width="20" height="20" aria-hidden="true" />
                    </button>
                    <span class="link-label ledger-accounts-color">Connect to Ledger</span>
                </span>
            </li>
            <li>
                <span class="action" title="Create Wallet" @click="onCreateAWalletClick">
                    <button class="btn create-account-btn large same-size round">
                        <icon data="@/assets/svg/wallet.svg" width="20" height="20" aria-hidden="true" />
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

        <ledger-accounts-window ref="ledgerAccountsWindow" />
        <create-account-window ref="createAccountWindow" />
        <restore-account-window ref="restoreAccountWindow" />
    </nav>
</template>

<script>
import LedgerAccountsWindow from '../windows/LedgerAccountsWindow/LedgerAccountsWindow.vue';
import CreateAccountWindow from '../windows/CreateAccountWindow/CreateAccountWindow.vue';
import RestoreAccountWindow from '../windows/RestoreAccountWindow/RestoreAccountWindow.vue';

export default {
    name: 'DashboardActionsBox',

    components: { RestoreAccountWindow, CreateAccountWindow, LedgerAccountsWindow },

    methods: {
        onConnectToLedgerClick() {
            this.$refs.ledgerAccountsWindow.show();
        },

        onCreateAWalletClick() {
            this.$refs.createAccountWindow.show();
        },

        onRestoreWalletClick() {
            this.$refs.restoreAccountWindow.show();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
