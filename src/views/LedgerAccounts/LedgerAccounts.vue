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
import { ADD_LEDGER_ACCOUNT } from '../../store/actions.type.js';

export default {
    components: { FCard, LedgerAccountPicker },

    async beforeRouteLeave(_to, _from, _next) {
        if (_from.name === 'ledger-accounts' && _to.name === 'account-history') {
            if (_to.params && _to.params.address) {
                await this.$store.dispatch(ADD_LEDGER_ACCOUNT, _to.params);
            }
        }

        _next();
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
