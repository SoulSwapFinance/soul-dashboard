<template>
    <div class="delegation-list-dt">
        <h2 class="dt-heading">
            Delegations <span class="f-records-count">({{ totalCount | formatHexToInt }})</span>
        </h2>

        <template v-if="!delegationsByAddressError">
            <f-data-table
                :columns="columns"
                :items="dItems"
                :disable-infinite-scroll="!hasNext"
                :mobile-view="mobileView"
                :loading="loading"
                first-m-v-column-width="5"
                infinite-scroll
                fixed-header
                f-card-off
                @fetch-more="fetchMore"
            >
            </f-data-table>
        </template>
        <template v-else>
            <div class="query-error">{{ delegationsByAddressError }}</div>
        </template>
    </div>
</template>

<script>
import FDataTable from '@/components/core/FDataTable/FDataTable.vue';
import gql from 'graphql-tag';
import { cloneObject } from '@/utils';
import { formatHexToInt } from '@/filters.js';
// import { formatHexToInt } from '@/filters.js';
export default {
    name: 'DelegationList',

    components: { FDataTable },

    props: {
        /** */
        accountAddress: {
            type: String,
            default: '',
            required: true,
        },
        /** Number of items per page. */
        itemsPerPage: {
            type: Number,
            default: 25,
        },
    },

    apollo: {
        delegationsByAddress: {
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
                                toStakerId
                                createdEpoch
                                createdTime
                                deactivatedEpoch
                                deactivatedTime
                                amount
                            }
                        }
                    }
                }
            `,
            variables() {
                return {
                    address: this.accountAddress,
                    count: this.itemsPerPage,
                    cursor: null,
                };
            },
            result(_data, _key) {
                let data;

                if (_key === 'delegationsByAddress') {
                    data = cloneObject(_data.data.delegationsByAddress);

                    const edges = data.edges;

                    if (edges && edges.length > 0 && edges[0].id && this.dItems.length > 0) {
                        return;
                    }

                    this.hasNext = data.pageInfo.hasNext;

                    if (this.dItems.length === 0) {
                        this.dItems = edges;
                    } else {
                        for (let i = 0, len1 = edges.length; i < len1; i++) {
                            this.dItems.push(edges[i]);
                        }
                    }

                    this.totalCount = data.totalCount;
                    this.$emit('records-count', formatHexToInt(this.totalCount));
                }
            },
            error(_error) {
                this.delegationsByAddressError = _error.message;
            },
        },
    },

    data() {
        return {
            columns: [
                {
                    name: 'createdTime',
                    label: 'Delegation Time',
                    itemProp: 'delegation.createdTime',
                    // formatter: (_value) => formatHexToInt(_value),
                },
                {
                    name: 'validator',
                    label: 'Validator',
                    itemProp: 'delegation.toStakerId',
                },
                {
                    name: 'amount',
                    label: 'Amount',
                    itemProp: 'delegation.amount',
                },
                {
                    name: '',
                    label: 'Expiration Time',
                    // itemProp: 'delegation.amount',
                    formatter: () => '-',
                },
            ],
            dItems: [],
            hasNext: false,
            delegationsByAddressError: '',
            totalCount: 0,
        };
    },

    computed: {
        /**
         * Property is set to `true`, if 'account-transaction-list-dt-mobile-view' breakpoint is reached.
         *
         * @return {Boolean}
         */
        mobileView() {
            const dataTableBreakpoint = this.$store.state.breakpoints['account-transaction-list-dt-mobile-view'];

            return dataTableBreakpoint && dataTableBreakpoint.matches;
        },

        loading() {
            return this.$apollo.queries.delegationsByAddress.loading;
        },
    },

    methods: {
        fetchMore() {
            const { delegationsByAddress } = this;

            if (delegationsByAddress && delegationsByAddress.pageInfo && delegationsByAddress.pageInfo.hasNext) {
                const cursor = delegationsByAddress.pageInfo.last;

                this.$apollo.queries.delegationsByAddress.fetchMore({
                    variables: {
                        cursor,
                        count: this.itemsPerPage,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return fetchMoreResult;
                    },
                });
            }
        },
    },
};
</script>
