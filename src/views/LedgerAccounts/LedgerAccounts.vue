<template>
    <div class="ledger-accounts-view">
        <f-card class="window">
            <div class="header">
                <h1>
                    Pick ledger account
                    <router-link to="/" class="router-link">
                        <icon data="@/assets/svg/times.svg" width="24" height="24"></icon>
                    </router-link>
                </h1>
            </div>
            <div class="body">
                <ledger-account-picker show-try-again-button />
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '../../components/core/FCard/FCard.vue';
import LedgerAccountPicker from '../../components/LedgerAccountPicker/LedgerAccountPicker.vue';

export default {
    components: { FCard, LedgerAccountPicker },
};
</script>

<style lang="scss">
@import 'style';
</style>
