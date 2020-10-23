<template>
    <div class="gov-proposal-list">
        <f-card class="account-transaction-list-dt" :off="windowMode">
            <h2 v-if="!windowMode" class="dt-heading">
                Proposals <span class="f-records-count">({{ totalCount }})</span>
            </h2>

            <template v-if="!proposalsError">
                <f-data-table
                    :columns="columns"
                    :items="dItems"
                    :disable-infinite-scroll="!pageInfo.hasNext"
                    :mobile-view="cMobileView"
                    :loading="loading"
                    infinite-scroll
                    fixed-header
                    f-card-off
                    class="f-data-table-body-bg-color"
                    @fetch-more="fetchMore"
                    @click.native="onDataTableClick"
                >
                    <template v-slot:column-startend="{ value, item, column }">
                        <div v-if="column" class="row no-collapse no-vert-col-padding">
                            <div class="col-4 f-row-label">{{ column.label }}</div>
                            <div class="col-8">
                                {{ formatDate(timestampToDate(item.proposal.votingStarts), true, true) }} <br />
                                {{ formatDate(timestampToDate(item.proposal.votingMayEnd), true, true) }}
                            </div>
                        </div>
                        <template v-else>
                            {{ formatDate(timestampToDate(item.proposal.votingStarts), true, true) }} <br />
                            {{ formatDate(timestampToDate(item.proposal.votingMayEnd), true, true) }}
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
import { cloneObject } from '@/utils';

export default {
    name: 'GovProposalList',

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
                    width: '320px',
                },
                {
                    name: 'startend',
                    label: 'Start / End',
                    itemProp: 'proposal.start',
                    formatter: (_value) => {
                        return formatDate(timestampToDate(_value), true, true);
                    },
                    width: '220px',
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
    },

    methods: {
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

                if (edges && edges.length > 0 && edges[0].id && this.dItems.length > 0) {
                    this.loading = false;
                    return;
                }

                this.pageInfo = cloneObject(data.pageInfo);

                this.loading = false;

                if (this.dItems.length === 0) {
                    this.dItems = edges;
                } else {
                    for (let i = 0, len1 = edges.length; i < len1; i++) {
                        this.dItems.push(edges[i]);
                    }
                }

                this.totalCount = formatHexToInt(data.totalCount);
                this.$emit('records-count', this.totalCount);
            } catch (_error) {
                this.loading = false;
                this.proposalsError = _error;
            }
        },

        fetchMore() {
            if (this.pageInfo.hasNext) {
                this.fetchProposals(this.pageInfo.last);
            }
        },

        /**
         * @param {Event} _event
         */
        onDataTableClick(_event) {
            const eVoteBtn = _event.target.closest('.vote-btn');

            if (eVoteBtn) {
                /*
                const proposalAddress = eVoteBtn.getAttribute('data-proposal-address');
                const proposal = this.dItems.find((_item) => _item.proposal.address === proposalAddress);

                if (proposal && proposal.proposal.isOpen && !proposal.proposal._proposal) {
                    this.$emit('proposal-selected', proposal.proposal);
                }
            */
            }
        },

        formatDate,
        timestampToDate,
    },
};
</script>
