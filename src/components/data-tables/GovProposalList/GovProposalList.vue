<template>
    <div class="gov-proposal-list">
        <h2 v-if="!windowMode" class="dt-heading">
            Proposals <span class="f-records-count">({{ totalCount }})</span>
        </h2>
        <f-card class="account-transaction-list-dt" :off="windowMode">
            <template v-if="!proposalsError">
                <f-data-table
                    :columns="columns"
                    :items="dItems"
                    :disable-infinite-scroll="!pageInfo.hasNext"
                    :mobile-view="cMobileView"
                    :loading="loading"
                    infinite-scroll
                    fixed-header__
                    action-on-row
                    f-card-off
                    class="f-data-table-body-bg-color"
                    @fetch-more="fetchMore"
                    @row-action="onRowAction"
                >
                    <template v-slot:column-startend="{ value, item, column }">
                        <div v-if="column" class="row no-collapse no-vert-col-padding">
                            <div class="col-4 f-row-label">{{ column.label }}</div>
                            <div class="col-8">
                                {{ formatDate(timestampToDate(item.proposal.votingStarts), true, true) }} <br />
                                {{ formatDate(timestampToDate(item.proposal.votingMustEnd), true, true) }}
                            </div>
                        </div>
                        <template v-else>
                            {{ formatDate(timestampToDate(item.proposal.votingStarts), true, true) }} <br />
                            {{ formatDate(timestampToDate(item.proposal.votingMustEnd), true, true) }}
                        </template>
                    </template>

                    <template v-slot:column-votes="{ value, item, column }">
                        <div v-if="column" class="row no-collapse no-vert-col-padding">
                            <div class="col-4 f-row-label">{{ column.label }}</div>
                            <div class="col break-word">
                                <f-colored-number-range
                                    v-if="value"
                                    :value="value.votes"
                                    :colors="overallVotesColors(value.minVotes)"
                                    show-percentage
                                />
                            </div>
                        </div>
                        <template v-else>
                            <f-colored-number-range
                                v-if="value"
                                :value="value.votes"
                                :colors="overallVotesColors(value.minVotes)"
                                show-percentage
                            />
                        </template>
                    </template>

                    <template v-slot:column-voted="{ value, item, column }">
                        <div v-if="column" class="row no-collapse no-vert-col-padding">
                            <div class="col-4 f-row-label">{{ column.label }}</div>
                            <div class="col break-word">
                                <template v-if="value">{{ value.voted }}/{{ value.total }}</template>
                            </div>
                        </div>
                        <template v-else>
                            <template v-if="value">{{ value.voted }}/{{ value.total }}</template>
                        </template>
                    </template>

                    <template v-slot:column-detail="{ value, item, column }">
                        <div v-if="column" class="row no-collapse no-vert-col-padding">
                            <div class="col-4 f-row-label">{{ column.label }}</div>
                            <div class="col break-word">
                                <button class="btn">Detail</button>
                            </div>
                        </div>
                        <template v-else>
                            <button class="btn">Detail</button>
                        </template>
                    </template>
                </f-data-table>
            </template>

            <template v-else>
                <div class="query-error">{{ proposalsError }}</div>
            </template>
        </f-card>
    </div>
</template>

<script>
import FCard from '../../core/FCard/FCard.vue';
import { formatDate, formatHexToInt, timestampToDate } from '../../../filters.js';
import FDataTable from '../../core/FDataTable/FDataTable.vue';
import { mapGetters } from 'vuex';
import { cloneObject, defer } from '@/utils';
import gql from 'graphql-tag';
import Vue from 'vue';
import FColoredNumberRange from '@/components/core/FColoredNumberRange/FColoredNumberRange.vue';
import { eventBusMixin } from '@/mixins/event-bus.js';

export default {
    name: 'GovProposalList',

    components: { FColoredNumberRange, FDataTable, FCard },

    mixins: [eventBusMixin],

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

    data() {
        return {
            totalCount: 0,
            dItems: [],
            pageInfo: {},
            proposalsError: '',
            loading: false,
            columns: [
                {
                    name: 'name',
                    label: 'Name',
                    itemProp: 'proposal.name',
                    // width: '320px',
                },
                {
                    name: 'startend',
                    label: 'Start / End',
                    itemProp: 'proposal.start',
                    formatter: (_value) => {
                        return formatDate(timestampToDate(_value), true, true);
                    },
                    width: '260px',
                },
                {
                    name: 'winner',
                    label: 'Winner',
                    formatter: (_value, _item) => {
                        const { proposal } = _item;

                        if (
                            proposal &&
                            proposal.state &&
                            proposal.state.isResolved &&
                            proposal.state.winnerId &&
                            proposal.options
                        ) {
                            return proposal.options[parseInt(proposal.state.winnerId, 16)];
                        }

                        return '-';
                    },
                },
                {
                    name: 'votes',
                    label: 'Votes',
                    itemProp: 'proposal',
                    formatter: (_value) => {
                        if (_value._votes) {
                            return {
                                votes: _value._votes,
                                minVotes: this.toPercentage(_value.minVotes),
                            };
                        }

                        return '';
                    },
                },
                {
                    name: 'voted',
                    label: 'Voted',
                    itemProp: 'proposal',
                    formatter: (_value) => {
                        return _value._voted !== undefined ? _value._voted : '';
                    },
                },
                {
                    name: 'detail',
                    width: '130px',
                    css: { textAlign: 'right' },
                },
            ],
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * Property is set to `true`, if 'gov-proposal-list-dt-mobile-view' breakpoint is reached.
         *
         * @return {Boolean}
         */
        cMobileView() {
            const dataTableBreakpoint = this.$store.state.breakpoints['gov-proposal-list-dt-mobile-view'];

            return dataTableBreakpoint && dataTableBreakpoint.matches;
        },
    },

    created() {
        this.fetchProposals();

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        onAccountPicked() {
            this.dItems = [];
            this.fetchProposals();
        },

        /**
         * @param {string} _bn
         */
        toPercentage(_bn) {
            return parseInt(this.toFloat(_bn) * 100, 10);
        },

        /**
         * @param {string} _bn
         */
        toFloat(_bn) {
            return parseFloat(this.$defi.shiftDecPointLeft(_bn, 18));
        },

        /**
         * @param {string} _votes
         * @param {string} _totalWeight
         */
        overallVotes(_votes, _totalWeight) {
            return parseInt(_totalWeight, 16) !== 0 ? (this.toFloat(_votes) / this.toFloat(_totalWeight)) * 100 : 0;
        },

        /**
         * @param {number} _minVotes
         */
        overallVotesColors(_minVotes) {
            return this.$governance.getOverallVotesColors(_minVotes);
        },

        /**
         * Fetch and process proposals.
         *
         * @param {string} [_cursor]
         * @param {number} [_count]
         */
        async fetchProposals(_cursor = '', _count = this.itemsPerPage) {
            this.loading = true;

            try {
                const data = cloneObject(await this.$governance.fetchProposals(_cursor, _count));
                const edges = data.edges;
                const dItemsLen = this.dItems.length;

                if (edges && edges.length > 0 && edges[0].id && dItemsLen > 0) {
                    this.loading = false;
                    return;
                }

                this.pageInfo = cloneObject(data.pageInfo);

                this.loading = false;

                if (dItemsLen === 0) {
                    this.dItems = edges;
                } else {
                    for (let i = 0, len1 = edges.length; i < len1; i++) {
                        this.dItems.push(edges[i]);
                    }
                }

                this.totalCount = formatHexToInt(data.totalCount);
                this.$emit('records-count', this.totalCount);

                const edgesLen = edges.length;

                defer(() => {
                    this.updateTable(dItemsLen, dItemsLen + edgesLen);
                });
            } catch (_error) {
                this.loading = false;
                this.proposalsError = _error;
            }
        },

        /**
         * @param {number} _startIdx
         * @param {number} _endIdx
         */
        async updateTable(_startIdx, _endIdx) {
            const { dItems } = this;
            let item;
            let data;
            let delegationsAndOptionState;
            let delegators = [];
            let voted = 0;

            if (_startIdx >= _endIdx) {
                return;
            }

            for (let i = _startIdx; i < _endIdx; i++) {
                voted = 0;
                item = dItems[i];
                delegationsAndOptionState = await this.fetchProposalDelegationsAndOptionState(
                    item.proposal.governanceId,
                    item.proposal.id
                );

                if (delegators.length === 0) {
                    delegators = delegationsAndOptionState.delegationsBy;
                }

                if (delegators.length > 0) {
                    data = await Promise.all(this.getVotesPromises(delegators, item.proposal));
                    data.forEach((_item) => {
                        if (_item.vote.choices && _item.vote.choices.length > 0) {
                            voted++;
                        }
                    });
                }

                Vue.set(item, 'proposal', {
                    ...item.proposal,
                    _votes: this.overallVotes(
                        delegationsAndOptionState.proposal.optionState.votes,
                        delegationsAndOptionState.proposal.totalWeight
                    ),
                    _voted: {
                        voted,
                        total: delegators.length,
                    },
                });
            }
        },

        getVotesPromises(_delegators, _proposal) {
            const address = this.currentAccount ? this.currentAccount.address : '';

            return _delegators.map((_delegator) =>
                this.$governance.fetchProposalVote(_proposal.governanceId, address, _delegator, _proposal.id)
            );
        },

        /**
         * @param {string} _govAddress
         * @param {string} _proposalId
         * @return {Promise<Object>}
         */
        async fetchProposalDelegationsAndOptionState(_govAddress, _proposalId) {
            const data = await this.$apollo.query({
                query: gql`
                    query GovernanceContract($address: Address!, $from: Address!, $id: BigInt!, $optionId: BigInt!) {
                        govContract(address: $address) {
                            delegationsBy(from: $from)
                            proposal(id: $id) {
                                totalWeight
                                optionState(optionId: $optionId) {
                                    optionId
                                    votes
                                    agreement
                                    agreementRatio
                                }
                            }
                        }
                    }
                `,
                variables: {
                    address: _govAddress,
                    from: this.currentAccount.address,
                    id: _proposalId,
                    optionId: '0x0',
                },
                fetchPolicy: 'network-only',
            });

            return data.data.govContract || {};
        },

        fetchMore() {
            if (this.pageInfo.hasNext) {
                this.fetchProposals(this.pageInfo.last);
            }
        },

        /**
         * @param {{proposal: GovernanceProposal}} _item
         */
        onRowAction(_item) {
            this.$router.push({
                name: 'gov-proposal-detail',
                params: {
                    proposal: cloneObject(_item.proposal),
                    proposalId: _item.proposal.id,
                    governanceId: _item.proposal.governanceId,
                },
            });
        },

        formatDate,
        timestampToDate,
    },
};
</script>
