<template>
    <f-card class="account-transaction-list-dt">
        <h2 class="dt-heading">
            Transactions <span class="f-records-count">({{ totalCount | formatHexToInt }})</span>
        </h2>

        <template v-if="!dAccountByAddressError">
            <f-data-table
                :columns="dColumns"
                :items="dItems"
                :disable-infinite-scroll="!dHasNext"
                :loading="cLoading"
                first-m-v-column-width="5"
                infinite-scroll
                fixed-header
                f-card-off
                @fetch-more="fetchMore"
            >
                <!--
                <template v-slot:column-timestamp="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            {{ value }}
                        </div>
                    </div>
                    <template v-else>
                        {{ value }}
                    </template>
                </template>
                -->

                <template v-slot:column-address="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <a :href="`${eplorerUrl}address/${value}`" target="_blank" class="break-word">
                                {{ value | formatHash }}
                            </a>
                        </div>
                    </div>
                    <template v-else>
                        <a :href="`${eplorerUrl}address/${value}`" target="_blank" class="break-word">
                            {{ value | formatHash }}
                        </a>
                    </template>
                </template>

                <template v-slot:column-amount="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <template v-if="address">
                                <f-account-transaction-amount
                                    :address="address"
                                    :from="getFrom(item)"
                                    :to="getTo(item)"
                                    :amount="value"
                                />
                            </template>
                            <template v-else>
                                {{ value }}
                            </template>
                        </div>
                    </div>
                    <template v-else>
                        <template v-if="address">
                            <f-account-transaction-amount
                                :address="address"
                                :from="getFrom(item)"
                                :to="getTo(item)"
                                :amount="value"
                            />
                        </template>
                        <template v-else>
                            {{ value }}
                        </template>
                    </template>
                </template>
            </f-data-table>
        </template>

        <template v-else>
            <div class="query-error">{{ dAccountByAddressError }}</div>
        </template>
    </f-card>
</template>

<script>
import FDataTable from '../core/FDataTable/FDataTable.vue';
import gql from 'graphql-tag';
import { WEIToFTM } from '../../utils/transactions.js';
import { timestampToDate, formatNumberByLocale, numToFixed, formatHexToInt, formatDate } from '../../filters.js';
import FAccountTransactionAmount from '../core/FAccountTransactionAmount/FAccountTransactionAmount.vue';
import { getNestedProp } from '../../utils';
import FCard from '../core/FCard/FCard.vue';
import appConfig from '../../../app.config.js';

export default {
    components: {
        FCard,
        FAccountTransactionAmount,
        FDataTable,
    },

    props: {
        /** Use address column instead of columns `from` and `to`. */
        address: {
            type: String,
            default: '',
            required: true,
        },

        /** Number of items per page. */
        itemsPerPage: {
            type: Number,
            default: 40,
        },
    },

    apollo: {
        account: {
            query: gql`
                query AccountByAddress($address: Address!, $cursor: Cursor, $count: Int!) {
                    account(address: $address) {
                        address
                        balance
                        totalValue
                        txCount
                        txList(cursor: $cursor, count: $count) {
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            totalCount
                            edges {
                                cursor
                                transaction {
                                    hash
                                    from
                                    to
                                    value
                                    gasUsed
                                    block {
                                        number
                                        timestamp
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            variables() {
                return {
                    address: this.address,
                    count: this.itemsPerPage,
                    cursor: null,
                };
            },
            result(_data, _key) {
                let data;

                if (_key === 'account') {
                    data = _data.data.account;

                    const edges = data.txList.edges;

                    if (edges && edges.length > 0 && edges[0].id && this.dItems.length > 0) {
                        return;
                    }

                    this.dHasNext = data.txList.pageInfo.hasNext;

                    if (this.dItems.length === 0) {
                        this.dItems = edges;
                    } else {
                        for (let i = 0, len1 = edges.length; i < len1; i++) {
                            this.dItems.push(edges[i]);
                        }
                    }

                    this.totalCount = data.txList.totalCount;
                    this.$emit('records-count', formatHexToInt(data.txList.totalCount));
                }
            },
            error(_error) {
                this.dAccountByAddressError = _error.message;
            },
        },
    },

    data() {
        return {
            totalCount: 0,
            eplorerUrl: appConfig.explorerUrl,
            dItems: [],
            dHasNext: false,
            dAccountByAddressError: '',
            dColumns: [
                /*
                {
                    name: 'hash',
                    label: 'TX Hash',
                    width: '200px',
                    // itemProp: `${!this.withoutCursor ? 'transaction.' : ''}hash`,
                    itemProp: 'transaction.hash',
                },
*/
                {
                    name: 'timestamp',
                    label: 'Time',
                    // itemProp: `${!this.withoutCursor ? 'transaction.' : ''}block.timestamp`,
                    itemProp: 'transaction.block.timestamp',
                    formatter: (_value) => formatDate(timestampToDate(_value), true, true),
                    width: '240px',
                },
                {
                    name: 'address',
                    label: 'Address',
                    // width: '460px',
                    itemProp: 'transaction.from',
                    formatter: (_value, _item) => {
                        // const from = getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}from`);
                        // const to = getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}to`);
                        const from = this.getFrom(_item);
                        const to = this.getTo(_item);

                        if (this.address.toLowerCase() !== from.toLowerCase()) {
                            return from;
                        } else {
                            return to;
                        }
                    },
                    oneLineMode: true,
                    // width: '180px'
                },
                {
                    name: 'amount',
                    label: 'Amount (FTM)',
                    itemProp: 'transaction.value',
                    formatter: (_value) => {
                        return formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2);
                    },
                    width: '150px',
                    css: {
                        textAlign: 'right',
                    },
                },
            ],
        };
    },

    computed: {
        cLoading() {
            return this.$apollo.queries.account.loading;
        },
    },

    methods: {
        /**
         * Get item's 'from' value.
         *
         * @param {Object} _item
         * @return {*}
         */
        getFrom(_item) {
            return getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}from`);
        },

        /**
         * Get item's 'to' value.
         *
         * @param {Object} _item
         * @return {*}
         */
        getTo(_item) {
            return getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}to`);
        },

        fetchMore() {
            const { account } = this;

            if (account && account.txList.pageInfo && account.txList.pageInfo.hasNext) {
                const cursor = account.txList.pageInfo.last;

                this.$apollo.queries.account.fetchMore({
                    variables: {
                        cursor,
                        count: this.itemsPerPage,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        // this.dHasNext = fetchMoreResult.account.pageInfo.hasNext;
                        return fetchMoreResult;
                    },
                });
            }
        },

        WEIToFTM,
        timestampToDate,
    },
};
</script>
