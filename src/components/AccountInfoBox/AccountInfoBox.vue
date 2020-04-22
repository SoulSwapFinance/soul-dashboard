<template>
    <f-card class="account-info-box f-card-double-padding">
        <div class="row no-vert-col-padding align-items-center align-center-sm">
            <div class="col">
                <div class="balance">
                    <h3 class="h1 align-center-sm">{{ toFTM(accountBalance) }} FTM</h3>
                    <div class="usd">${{ toUSD(accountBalance) }}</div>
                </div>
            </div>
            <div class="col align-right align-center-sm"><account-actions-box /></div>
        </div>
    </f-card>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import AccountActionsBox from '../AccountActionsBox/AccountActionsBox.vue';
import { mapGetters } from 'vuex';
import gql from 'graphql-tag';
import { formatNumberByLocale, numToFixed } from '../../filters.js';
import { FTMToUSD, WEIToFTM } from '../../utils/transactions.js';
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
        /**
         * Convert value to FTM.
         *
         * @param {string|number} _value
         * @return {string}
         */
        toFTM(_value) {
            return formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2);
        },

        /**
         * Convert value to USD.
         *
         * @param {string|number} _value
         * @return {string}
         */
        toUSD(_value) {
            return formatNumberByLocale(numToFixed(FTMToUSD(WEIToFTM(_value), this.$store.state.tokenPrice), 2), 2);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
