<template>
    <nav class="dashboard-actions-box actions-box">
        <ul class="no-markers">
            <li>
                <span class="action" title="Connect to Ledger" @click="onConnectToLedgerClick">
                    <button class="btn large same-size round">
                        <icon data="@/assets/svg/dashboard.svg" width="20" height="20" aria-hidden="true" />
                    </button>
                    <span class="link-label">Connect to Ledger</span>
                </span>
            </li>
            <li>
                <span class="action" title="Create a Wallet" @click="onCreateAWalletClick">
                    <button class="btn large same-size round">
                        <icon data="@/assets/svg/dashboard.svg" width="20" height="20" aria-hidden="true" />
                    </button>
                    <span class="link-label">Create a Wallet</span>
                </span>
            </li>
            <li>
                <span class="action" title="Restore Wallet" @click="onRestoreWalletClick">
                    <button class="btn large same-size round">
                        <icon data="@/assets/svg/dashboard.svg" width="20" height="20" aria-hidden="true" />
                    </button>
                    <span class="link-label">Restore Wallet</span>
                </span>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'DashboardActionsBox',

    methods: {
        onConnectToLedgerClick() {
            alert('not implemented yet');
        },

        onCreateAWalletClick() {
            alert('not implemented yet');
        },

        onRestoreWalletClick() {
            alert('not implemented yet');
        },
    },
};
</script>
