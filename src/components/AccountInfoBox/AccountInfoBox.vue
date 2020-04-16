<template>
    <f-card class="account-info-box">
        <div class="row no-vert-col-padding no-collapse align-items-center">
            <div class="col">
                <div class="balance">
                    <h3 class="h1">{{ toFTM(accountBalance) }} FTM</h3>
                    <div class="usd">${{ toUSD(accountBalance) }}</div>
                </div>
            </div>
            <div class="col">Account actions</div>
        </div>
    </f-card>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import { mapGetters } from 'vuex';
import gql from 'graphql-tag';
import { formatNumberByLocale, numToFixed } from '../../filters.js';
import { FTMToUSD, WEIToFTM } from '../../utils/transactions.js';

export default {
    components: { FCard },

    apollo: {
        account: {
            query: gql`
                query AccountByAddress($address: Address!) {
                    account(address: $address) {
                        address
                        balance
                        totalValue
                        staker {
                            id
                            createdTime
                            isActive
                        }
                        delegation {
                            toStakerId
                            createdTime
                            amount
                            claimedReward
                            pendingRewards {
                                amount
                                fromEpoch
                                toEpoch
                            }
                        }
                    }
                }
            `,
            variables() {
                return {
                    address: this.currentAccountAddress,
                };
            },
            error(_error) {
                console.log(_error);
                // this.dAccountByAddressError = _error.message;
            },
        },
    },

    computed: {
        ...mapGetters(['currentAccount', 'currentAccountAddress']),

        accountBalance() {
            return this.account ? this.account.balance : this.currentAccount ? this.currentAccount.balance : 0;
        },
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
