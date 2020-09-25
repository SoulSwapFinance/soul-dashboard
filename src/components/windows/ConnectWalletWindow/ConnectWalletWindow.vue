<template>
    <div class="defi-token-picker-window">
        <f-window
            ref="win"
            modal
            style="max-width: 400px;"
            title="Connect Wallet"
            class="account-picker-f-window"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            @window-hide="$emit('window-hide', $event)"
        >
            <wallet-list @wallet-picked="onWalletPicked" />
        </f-window>

        <ledger-accounts-window ref="ledgerAccountsWindow" />
    </div>
</template>

<script>
import FWindow from '@/components/core/FWindow/FWindow.vue';
import LedgerAccountsWindow from '@/components/windows/LedgerAccountsWindow/LedgerAccountsWindow.vue';
import WalletList from '@/components/WalletList/WalletList.vue';
export default {
    name: 'ConnectWalletWindow',

    components: { WalletList, LedgerAccountsWindow, FWindow },

    methods: {
        show() {
            this.$refs.win.show();
        },

        onWalletPicked(_wallet) {
            this.$refs.win.hide('fade-leave-active');

            if (_wallet.code === 'metamask') {
                alert('Not implemented yet');
            } else if (_wallet.code === 'ledger') {
                this.$refs.ledgerAccountsWindow.show();
            }
        },
    },
};
</script>
