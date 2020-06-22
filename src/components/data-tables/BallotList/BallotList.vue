<template>
    <div class="ballot-list">
        <f-card class="account-transaction-list-dt" :off="windowMode">
            <h2 v-if="!windowMode" class="dt-heading">
                Ballots <span class="f-records-count">({{ totalCount }})</span>
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
                            <div class="col-4 f-row-label">{{ column.label }}</div>
                            <div class="col-8">
                                <template v-if="item.ballot.detailsUrl">
                                    <a :href="item.ballot.detailsUrl" target="_blank">{{ value }}</a>
                                </template>
                                <template v-else>
                                    {{ value }}
                                </template>
                            </div>
                        </div>
                        <template v-else>
                            <template v-if="item.ballot.detailsUrl">
                                <a :href="item.ballot.detailsUrl" target="_blank">{{ value }}</a>
                            </template>
                            <template v-else>
                                {{ value }}
                            </template>
                        </template>
                    </template>

                    <template v-slot:column-vote="{ value, item, column }">
                        <div v-if="column" class="row no-collapse no-vert-col-padding">
                            <div class="col-4 f-row-label">{{ column.label }}</div>
                            <div class="col-8">
                                <template v-if="item.ballot._proposal">{{ item.ballot._proposal }}</template>
                                <template v-else-if="item.ballot.isOpen">
                                    <button
                                        type="button"
                                        class="btn vote-btn"
                                        :data-ballot-address="item.ballot.address"
                                    >
                                        Vote
                                    </button>
                                </template>
                                <template v-else>-</template>
                            </div>
                        </div>
                        <template v-else>
                            <template v-if="item.ballot._proposal">{{ item.ballot._proposal }}</template>
                            <template v-else-if="item.ballot.isOpen">
                                <button class="btn vote-btn" :data-ballot-address="item.ballot.address">Vote</button>
                            </template>
                            <template v-else>-</template>
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
import { mapGetters } from 'vuex';

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
                                address
                                name
                                detailsUrl
                                start
                                end
                                isOpen
                                isFinalized
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
            async result(_data, _key) {
                let data;

                if (_key === 'ballots') {
                    data = _data.data.ballots;

                    const edges = await this.processEdges(data.edges);

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
                },
                {
                    name: 'start',
                    label: 'Start',
                    itemProp: 'ballot.start',
                    formatter: (_value) => {
                        return formatDate(timestampToDate(_value), true, true);
                    },
                    width: '220px',
                },
                {
                    name: 'end',
                    label: 'End',
                    itemProp: 'ballot.end',
                    formatter: (_value) => {
                        return formatDate(timestampToDate(_value), true, true);
                    },
                    width: '220px',
                },
                {
                    name: 'winner',
                    label: 'Winner',
                    itemProp: 'ballot.winner',
                    formatter: (_value, _item) => {
                        const { proposals } = _item;

                        if (_item.isFinalized && proposals && proposals.length) {
                            return proposals[parseInt(_value)];
                        }

                        return '-';
                    },
                },
                {
                    name: 'vote',
                    label: 'Vote',
                    itemProp: 'ballot._proposal',
                },
            ],
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        cLoading() {
            return this.$apollo.queries.ballots.loading;
        },
    },

    methods: {
        /**
         * Prepare 'vote' column.
         *
         * @param {array} _edges
         */
        async processEdges(_edges) {
            const ballotAddresses = [];

            _edges.forEach((_item) => {
                const { ballot } = _item;

                ballot._proposal = '';
                ballotAddresses.push(ballot.address);
            });

            if (ballotAddresses.length > 0) {
                // send votes request
                const data = await this.$apollo.query({
                    query: gql`
                        query VoteList($voter: Address!, $ballots: [Address!]!) {
                            votes(voter: $voter, ballots: $ballots) {
                                ballot
                                vote
                            }
                        }
                    `,
                    variables: {
                        voter: this.currentAccount.address,
                        ballots: ballotAddresses,
                    },
                    fetchPolicy: 'no-cache',
                });

                if (data) {
                    const { votes } = data.data;

                    console.log(votes);

                    if (votes) {
                        votes.forEach((_item) => {
                            let edge;

                            for (let i = 0, len1 = _edges.length; i < len1; i++) {
                                edge = _edges[i];
                                if (edge.ballot.address === _item.ballot) {
                                    edge._propsal = edge.proposals[parseInt(_item.vote)];
                                    break;
                                }
                            }
                        });
                    }
                }
            }

            return _edges;
        },

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
