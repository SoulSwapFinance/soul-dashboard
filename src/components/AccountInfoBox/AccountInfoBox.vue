<template>
    <f-card class="account-info-box info-box f-card-double-padding">
        <div class="row no-vert-col-padding align-items-center align-center-lg no-collapse">
            <div class="col col-6-lg">
                <div class="balance">
                    <h3 class="align-center-lg">
                        <span>{{ toFTM(accountBalance) }} FTM</span>
                    </h3>
                    <div class="currency">
                        {{ formatCurrencyByLocale(accountBalance, this.$store.state.tokenPrice) }}
                    </div>
                    <div class="label h3">Available</div>
                </div>
            </div>
            <div class="col col-6-lg">
                <div class="balance">
                    <h3 class="align-center-lg">
                        <span>{{ toFTM(accountTotalBalance) }} FTM</span>
                    </h3>
                    <div class="currency">
                        {{ formatCurrencyByLocale(accountTotalBalance, this.$store.state.tokenPrice) }}
                    </div>
                    <div class="label h3">Total</div>
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
import gql from 'graphql-tag';
import { formatCurrencyByLocale } from '../../filters.js';
import { toFTM } from '../../utils/transactions.js';
import { pollingMixin } from '../../mixins/polling.js';

export default {
    components: { FCard, AccountActionsBox },

    mixins: [pollingMixin],

    apollo: {
        account: {
            query: gql`
                query AccountByAddress($address: Address!) {
                    account(address: $address) {
                        address
                        balance
                        totalValue
                        txCount
                    }
                }
            `,
            // pollInterval: 3000,
            variables() {
                return {
                    address: this.currentAccountAddress,
                };
            },
            result(_data) {
                if (_data.data.account) {
                    this.dAccount = _data.data.account;
                }
            },
            error(_error) {
                console.log(_error);
                // this.dAccountByAddressError = _error.message;
            },
        },
    },

    data() {
        return {
            dAccount: {},
        };
    },

    computed: {
        ...mapGetters(['currentAccount', 'currentAccountAddress']),

        accountBalance() {
            return this.account ? this.account.balance : this.currentAccount ? this.currentAccount.balance : 0;
        },

        accountTotalBalance() {
            return this.account ? this.account.totalValue : this.currentAccount ? this.currentAccount.totalBalance : 0;
        },
    },

    mounted() {
        this._polling.start(
            'acount-query',
            () => {
                if (!this.$apollo.queries.account.loading) {
                    this.$apollo.queries.account.refresh();
                }
            },
            3000
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
