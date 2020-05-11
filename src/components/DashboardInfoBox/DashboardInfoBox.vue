<template>
    <f-card class="dashboard-info-box info-box f-card-double-padding">
        <div class="row no-vert-col-padding align-items-center align-center-lg no-collapse">
            <div class="col col-6-lg">
                <div class="balance">
                    <h3 class="align-center-lg">
                        <span>{{ formatNumberByLocale(accountsBalance) }} FTM</span>
                    </h3>
                    <div class="currency">
                        {{ formatCurrencyByLocale(accountsBalance, this.$store.state.tokenPrice, false) }}
                    </div>
                    <div class="label h3">Available</div>
                </div>
            </div>
            <div class="col col-6-lg">
                <div class="balance">
                    <h3 class="align-center-lg">
                        <span>{{ formatNumberByLocale(accountsTotalBalance) }} FTM</span>
                    </h3>
                    <div class="currency">
                        {{ formatCurrencyByLocale(accountsTotalBalance, this.$store.state.tokenPrice, false) }}
                    </div>
                    <div class="label h3">Total Balance</div>
                </div>
            </div>
            <div class="col-5 col-12-lg align-right align-center-lg"><dashboard-actions-box /></div>
        </div>
    </f-card>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import { formatCurrencyByLocale, formatNumberByLocale } from '../../filters.js';
import { toFTM, WEIToFTM } from '../../utils/transactions.js';
import { mapGetters } from 'vuex';
import DashboardActionsBox from '../DashboardActionsBox/DashboardActionsBox.vue';

export default {
    name: 'DashboardInfoBox',

    components: { DashboardActionsBox, FCard },

    computed: {
        ...mapGetters(['accounts']),

        accountsBalance() {
            return this.accounts.reduce((_total, _currItem) => {
                return _total + WEIToFTM(_currItem.balance);
            }, 0);
        },

        accountsTotalBalance() {
            return this.accounts.reduce((_total, _currItem) => {
                return _total + WEIToFTM(_currItem.totalBalance);
            }, 0);
        },
    },

    methods: {
        formatCurrencyByLocale,
        formatNumberByLocale,
        WEIToFTM,
        toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
