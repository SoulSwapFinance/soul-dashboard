<template>
    <div class="transaction-list-dt">
        <template v-if="!dTransactionListError">
            <f-data-table
                :columns="dColumns"
                :hidden-columns="hiddenColumns"
                :items="dItems"
                :mobile-view="cMobileView"
                :disable-infinite-scroll="!dHasNext"
                :loading="cLoading"
                :f-card-off="fCardOff"
                first-m-v-column-width="5"
                infinite-scroll
                fixed-header
                @fetch-more="onFetchMore"
            >
                <template v-slot:column-timestamp="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <timeago
                                :datetime="timestampToDate(value)"
                                :auto-update="1"
                                :converter-options="{ includeSeconds: true }"
                            ></timeago>
                        </div>
                    </div>
                    <template v-else>
                        <timeago
                            :datetime="timestampToDate(value)"
                            :auto-update="1"
                            :converter-options="{ includeSeconds: true }"
                        ></timeago>
                    </template>
                </template>

                <template v-slot:column-address="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <router-link :to="{ name: 'address-detail', params: { id: value } }" :title="value">{{
                                value | formatHash
                            }}</router-link>
                        </div>
                    </div>
                    <template v-else>
                        <router-link :to="{ name: 'address-detail', params: { id: value } }" :title="value">{{
                            value | formatHash
                        }}</router-link>
                    </template>
                </template>

                <template v-slot:column-amount="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <template v-if="addressCol">
                                <f-account-transaction-amount
                                    :address="addressCol"
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
                        <template v-if="addressCol">
                            <f-account-transaction-amount
                                :address="addressCol"
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
            <div class="query-error">{{ dTransactionListError }}</div>
        </template>
    </div>
</template>

<script>
import FDataTable from '../core/FDataTable/FDataTable.vue';
import gql from 'graphql-tag';
import { WEIToFTM } from '../../utils/transactions.js';
import { formatHexToInt, timestampToDate, numToFixed, formatNumberByLocale } from '../../filters.js';
import { getNestedProp } from '../../utils';
import FAccountTransactionAmount from '../core/FAccountTransactionAmount/FAccountTransactionAmount.vue';

export default {
    components: {
        FAccountTransactionAmount,
        FDataTable,
    },

    props: {
        /** No pagination, no 'transaction.' prefix on columns. */
        withoutCursor: {
            type: Boolean,
            default: false,
        },

        /** Use address column instead of columns `from` and `to`. */
        addressCol: {
            type: String,
            default: '',
        },

        /** Array of column names to be hidden. */
        hiddenColumns: {
            type: Array,
            default() {
                return [];
            },
        },

        /**
         * Data and action.
         * Actions:
         * '' - replace items
         * 'append' - append new items
         */
        items: {
            type: Object,
            default() {
                return {
                    action: '',
                    data: [],
                };
            },
        },

        /** Number of items per page. */
        itemsPerPage: {
            type: Number,
            default: 40,
        },

        /** Display loading message. */
        loading: {
            type: Boolean,
            default: false,
        },

        /** If `true`, f-card element in data table will be without any style. */
        fCardOff: {
            type: Boolean,
            default: false,
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
                    address: this.id,
                    count: this.itemsPerPage,
                    cursor: null,
                };
            },
            error(_error) {
                this.dAccountByAddressError = _error.message;
            },
        },
    },
    /*
    apollo: {
        transactions: {
            query: gql`
                query TransactionList($cursor: Cursor, $count: Int!) {
                    transactions(cursor: $cursor, count: $count) {
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
            `,
            variables() {
                return {
                    cursor: null,
                    count: this.itemsPerPage,
                };
            },
            skip() {
                return this.dOutsideData;
            },
            error(_error) {
                this.dTransactionListError = _error.message;
            },
        },
    },
*/

    data() {
        return {
            dItems: [],
            dHasNext: false,
            dOutsideData: !!this.items.action,
            dTransactionListError: '',
            dColumns: [
                {
                    name: 'hash',
                    label: this.$t('view_transaction_list.tx_hash'),
                    width: '200px',
                    itemProp: `${!this.withoutCursor ? 'transaction.' : ''}hash`,
                },
                {
                    name: 'timestamp',
                    label: this.$t('view_transaction_list.time'),
                    itemProp: `${!this.withoutCursor ? 'transaction.' : ''}block.timestamp`,
                    // width: '220px',
                    hidden: this.cMobileView,
                },
                {
                    name: 'address',
                    label: this.$t('view_transaction_list.address'),
                    // width: '460px',
                    itemProp: `${!this.withoutCursor ? 'transaction.' : ''}from`,
                    formatter: (_value, _item) => {
                        // const from = getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}from`);
                        // const to = getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}to`);
                        const from = this.getFrom(_item);
                        const to = this.getTo(_item);

                        if (this.addressCol.toLowerCase() !== from.toLowerCase()) {
                            return from;
                        } else {
                            return to;
                        }
                    },
                    oneLineMode: true,
                    hidden: !this.addressCol,
                    // width: '180px'
                },
                {
                    name: 'amount',
                    label: `${this.$t('view_transaction_list.amount')} (FTM)`,
                    itemProp: `${!this.withoutCursor ? 'transaction.' : ''}value`,
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

    watch: {
        items(_newItems) {
            this.setItems(_newItems);
        },

        transactions(_data) {
            this.$emit('records-count', formatHexToInt(_data.totalCount));

            this.setItems({
                action: this.appendItems ? 'append' : 'replace',
                hasNext: _data.pageInfo.hasNext,
                data: _data.edges,
            });
        },

        /**
         * Watch route change and reset some properties, if only route parameter changes (whole component is reused,
         * not rendered from scratch!).
         *
         * @param {object} _to
         * @param {object} _from
         */
        $route(_to, _from) {
            if (_to.name === _from.name) {
                this.appendItems = false;
                this.dHasNext = false;
            }
        },
    },

    computed: {
        /**
         * Property is set to `true`, if 'ttransaction-list-dt-mobile-view' breakpoint is reached.
         *
         * @return {Boolean}
         */
        cMobileView() {
            const dataTableBreakpoint = this.$store.state.breakpoints['transaction-list-dt-mobile-view'];

            return dataTableBreakpoint && dataTableBreakpoint.matches;
        },

        cLoading() {
            return this.loading || this.$apollo.queries.transactions.loading;
        },
    },

    created() {
        /** If `true`, transaction items will be appended. */
        this.appendItems = false;
    },

    methods: {
        setItems(_items) {
            const { action, data, hasNext } = _items;

            if (action === 'replace') {
                this.dItems = data;
            } else if (action === 'append') {
                for (let i = 0, len1 = data.length; i < len1; i++) {
                    this.dItems.push(data[i]);
                }
            } else {
                throw new Error(`Unknown items action '${action}'`);
            }

            this.dHasNext = !!hasNext;
        },

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

        onFetchMore() {
            const { transactions } = this;

            if (this.dOutsideData) {
                this.$emit('fetch-more');
            } else {
                if (transactions && transactions.pageInfo && transactions.pageInfo.hasNext) {
                    const cursor = transactions.pageInfo.last;

                    this.$apollo.queries.transactions.fetchMore({
                        variables: {
                            cursor,
                            count: this.itemsPerPage,
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                            this.appendItems = true;

                            return fetchMoreResult;
                        },
                    });
                }
            }
        },

        WEIToFTM,
        timestampToDate,
        numToFixed,
        formatNumberByLocale,
    },
};
</script>
