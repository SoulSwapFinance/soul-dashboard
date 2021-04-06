<template>
    <div class="staking-overview">
        <h2>Staking Overview</h2>

        <div class="row no-vert-col-padding collapse-md">
            <div class="col">
                <div class="row no-collapse">
                    <div class="col f-row-label">Delegated</div>
                    <div class="col">
                        <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                            <template v-if="accountInfo">{{ accountInfo.delegated }} FTM</template>
                        </f-placeholder>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col f-row-label">Pending Rewards</div>
                    <div class="col">
                        <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                            <template v-if="accountInfo">{{ accountInfo.pendingRewards }} FTM</template>
                        </f-placeholder>
                    </div>
                </div>
            </div>

            <div class="col">
                <div class="row no-collapse">
                    <div class="col f-row-label">Claimed Rewards</div>
                    <div class="col">
                        <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                            <template v-if="accountInfo">
                                -
                                <!--{{ accountInfo.claimedRewards }} FTM-->
                            </template>
                        </f-placeholder>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';
import { WEIToFTM } from '@/utils/transactions.js';
import { formatNumberByLocale } from '@/filters.js';

export default {
    name: 'StakingOverview',

    components: { FPlaceholder },

    data() {
        return {
            accountInfo: null,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    created() {
        this.init();
    },

    methods: {
        async init() {
            const data = await Promise.all([this.fetchAccountInfo(), this.fetchDelegations()]);
            const delegations = data[1];
            const accountInfo = {
                delegated: 0,
                pendingRewards: 0,
                claimedRewards: 0,
            };

            delegations.forEach((_delegation) => {
                const { delegation } = _delegation;

                accountInfo.delegated += WEIToFTM(delegation.amount);
                accountInfo.pendingRewards += delegation.pendingRewards
                    ? WEIToFTM(delegation.pendingRewards.amount)
                    : 0;
                accountInfo.claimedRewards += WEIToFTM(delegation.claimedReward);
            });

            Object.keys(accountInfo).forEach((_key) => {
                accountInfo[_key] = formatNumberByLocale(accountInfo[_key]);
            });

            // console.log({ delegations, accountInfo });

            this.accountInfo = accountInfo;
        },

        /**
         * Fetch account info by current account address.
         *
         * @return {Promise<{}>}
         */
        async fetchAccountInfo() {
            const data = await this.$apollo.query({
                query: gql`
                    query AccountByAddress($address: Address!) {
                        account(address: $address) {
                            address
                            stashed
                        }
                    }
                `,
                variables: {
                    address: this.currentAccount.address,
                },
                fetchPolicy: 'network-only',
            });

            return data.data.account;
        },

        /**
         * @return {Promise<[]>}
         */
        async fetchDelegations() {
            return this.$fWallet.fetchAll(
                {
                    query: gql`
                        query DelegationsByAddress($address: Address!, $cursor: Cursor, $count: Int!) {
                            delegationsByAddress(address: $address, cursor: $cursor, count: $count) {
                                pageInfo {
                                    first
                                    last
                                    hasNext
                                    hasPrevious
                                }
                                totalCount
                                edges {
                                    cursor
                                    delegation {
                                        amount
                                        claimedReward
                                        pendingRewards {
                                            amount
                                        }
                                    }
                                }
                            }
                        }
                    `,
                    variables: {
                        address: this.currentAccount.address,
                        count: 100,
                        cursor: null,
                    },
                    fetchPolicy: 'network-only',
                },
                'delegationsByAddress'
            );
        },
    },
};
</script>
