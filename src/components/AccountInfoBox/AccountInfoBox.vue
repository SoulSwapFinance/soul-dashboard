<template>
    <f-card class="account-info-box info-box f-card-double-padding">
        <div class="row no-vert-col-padding align-items-center align-center-lg no-collapse">
            <div class="col balances">
                <div class="balance total-balance">
                    <h3 class="align-center-lg">
                        <span>{{ toFTM(accountTotalBalance) }} <span class="ftm">FTM</span></span>
                    </h3>
                    <div class="currency">
                        {{ formatCurrencyByLocale(accountTotalBalance, this.$store.state.tokenPrice) }}
                    </div>
                    <div class="label h3">Total</div>
                </div>
                <div class="balance">
                    <h3 class="align-center-lg">
                        <span>{{ toFTM(accountBalance) }} <span class="ftm">FTM</span></span>
                    </h3>
                    <div class="currency">
                        {{ formatCurrencyByLocale(accountBalance, this.$store.state.tokenPrice) }}
                    </div>
                    <div class="label h3">Available</div>
                </div>
            </div>
            <div class="col-5 col-12-lg align-right align-center-lg"><account-actions-box /></div>
        </div>
    </f-card>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import AccountActionsBox from '../AccountActionsBox/AccountActionsBox.vue';
import { mapGetters } from 'vuex';
import { formatCurrencyByLocale } from '../../filters.js';
import { toFTM } from '../../utils/transactions.js';
import { pollingMixin } from '../../mixins/polling.js';
import { UPDATE_ACCOUNT_BALANCE } from '../../store/actions.type.js';

export default {
    components: { FCard, AccountActionsBox },

    mixins: [pollingMixin],

    computed: {
        ...mapGetters(['currentAccount', 'currentAccountAddress']),

        accountBalance() {
            return this.currentAccount ? this.currentAccount.balance : 0;
        },

        accountTotalBalance() {
            return this.currentAccount ? this.currentAccount.totalBalance : 0;
        },
    },

    mounted() {
        this._polling.start(
            'update-account-balance',
            () => {
                this.$store.dispatch(UPDATE_ACCOUNT_BALANCE);
            },
            6000
        );
    },

    methods: {
        formatCurrencyByLocale,
        toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
