<template>
    <div class="ballot-list">
        <f-card class="account-transaction-list-dt" :off="windowMode">
            <h2 v-if="!windowMode" class="dt-heading">
                Ballots <span class="f-records-count">({{ totalCount | formatHexToInt }})</span>
            </h2>

            <template v-if="!ballotsError">
                <f-data-table
                    :columns="columns"
                    :items="dItems"
                    :disable-infinite-scroll="!hasNext"
                    :loading="cLoading"
                    infinite-scroll
                    fixed-header
                    f-card-off
                    @fetch-more="fetchMore"
                >
                    <template v-slot:column-name="{ value, item, column }">
                        <div v-if="column" class="row no-collapse no-vert-col-padding">
                            <div class="col-6 f-row-label">{{ column.label }}</div>
                            <div class="col-6">
                                <a :href="item.detailsUrl" target="_blank">{{ value }}</a>
                            </div>
                        </div>
                        <template v-else>
                            <a :href="item.detailsUrl" target="_blank">{{ value }}</a>
                        </template>
                    </template>
                </f-data-table>
            </template>

            <template v-else>
                <div class="query-error">{{ ballotsError }}</div>
            </template>
        </f-card>
    </div>
</template>

<script>
import FCard from '../../core/FCard/FCard.vue';
import gql from 'graphql-tag';
import { formatDate, formatHexToInt, timestampToDate } from '../../../filters.js';
import FDataTable from '../../core/FDataTable/FDataTable.vue';

export default {
    name: 'BallotList',

    components: { FDataTable, FCard },

    props: {
        /** Number of items per page. */
        itemsPerPage: {
            type: Number,
            default: 40,
        },
        /** Component is used in FWindow. */
        windowMode: {
            type: Boolean,
            default: false,
        },
    },

    apollo: {
        ballots: {
            query: gql`
                query BallotList($cursor: Cursor, $count: Int!) {
                    ballots(cursor: $cursor, count: $count) {
                        totalCount
                        pageInfo {
                            first
                            last
                            hasNext
                            hasPrevious
                        }
                        edges {
                            ballot {
                                name
                                detailsUrl
                                start
                                end
                                winner
                                proposals
                            }
                            cursor
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
            result(_data, _key) {
                let data;

                if (_key === 'ballots') {
                    data = _data.data.ballots;

                    const edges = data.edges;

                    this.hasNext = data.pageInfo.hasNext;

                    if (this.dItems.length === 0) {
                        this.dItems = edges;
                    } else {
                        for (let i = 0, len1 = edges.length; i < len1; i++) {
                            this.dItems.push(edges[i]);
                        }
                    }

                    this.totalCount = formatHexToInt(data.totalCount);
                    this.$emit('records-count', this.totalCount);
                }
            },
            error(_error) {
                this.ballotsError = _error.message;
            },
        },
    },

    data() {
        return {
            totalCount: 0,
            dItems: [],
            hasNext: false,
            ballotsError: '',
            columns: [
                {
                    name: 'name',
                    label: 'Name',
                    itemProp: 'ballot.name',
                    width: '140px',
                },
                {
                    name: 'start',
                    label: 'Start',
                    itemProp: 'ballot.start',
                    formatter: (_value) => {
                        return formatDate(timestampToDate(_value), true, true);
                    },
                },
                {
                    name: 'end',
                    label: 'End',
                    itemProp: 'ballot.end',
                    formatter: (_value) => {
                        return formatDate(timestampToDate(_value), true, true);
                    },
                },
                {
                    name: 'winner',
                    label: 'Winner',
                    itemProp: 'ballot.winner',
                },
                {
                    name: 'vote',
                    label: 'Vote',
                    itemProp: 'ballot.isOpen',
                },
            ],
        };
    },

    computed: {
        cLoading() {
            return this.$apollo.queries.ballots.loading;
        },
    },

    methods: {
        fetchMore() {
            const { ballots } = this;

            if (ballots && ballots.pageInfo && ballots.pageInfo.hasNext) {
                const cursor = ballots.pageInfo.last;

                this.$apollo.queries.ballots.fetchMore({
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
