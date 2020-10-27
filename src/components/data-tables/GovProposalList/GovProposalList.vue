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
                    fixed-header
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
                                {{ formatDate(timestampToDate(item.proposal.votingMayEnd), true, true) }}
                            </div>
                        </div>
                        <template v-else>
                            {{ formatDate(timestampToDate(item.proposal.votingStarts), true, true) }} <br />
                            {{ formatDate(timestampToDate(item.proposal.votingMayEnd), true, true) }}
                        </template>
                    </template>

                    <template v-slot:column-detail="{ value, item, column }">
                        <div v-if="column" class="row no-collapse no-vert-col-padding">
                            <div class="col-5 f-row-label">{{ column.label }}</div>
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
                    width: '260px',
                },
                {
                    name: 'detail',
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
                // const data = cloneObject(await this.$governance.fetchProposals(_cursor, _count));
                const data = this.getTmpData(_cursor, _count);
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

        getTmpData() {
            const { $fWallet } = this;
            const data = {
                edges: [],
                totalCount: '0x0',
                pageInfo: {
                    hasNext: false,
                },
            };

            data.edges.push({
                proposal: {
                    name: 'In progress',
                    contract: '0xb910b4c8fd8767bc4e53b2ec324e9e6f3fa5c157',
                    votingStarts: '0x5F969E20',
                    votingMayEnd: '0x5FAA8ED0',
                    votingMustEnd: '0x5FB7BDD0',
                },
            });

            data.edges.push({
                proposal: {
                    name: 'Not started yet',
                    contract: '0xc910b4c8fd8767bc4e53b2ec324e9e6f3fa5c157',
                    votingStarts: '0x5F996B50',
                    votingMayEnd: '0x5FAA8ED0',
                    votingMustEnd: '0x5FB7BDD0',
                },
            });

            data.edges.push({
                proposal: {
                    name: 'Resolved, voted',
                    contract: '0xd910b4c8fd8767bc4e53b2ec324e9e6f3fa5c157',
                    votingStarts: '0x5F71DE50',
                    votingMayEnd: '0x5F81B050',
                    votingMustEnd: '0x5F8EDF50',
                    state: {
                        isResolved: true,
                        state: $fWallet.toWei(1),
                    },
                    vote: {
                        weight: $fWallet.toWei(0.2),
                        // choices: [$fWallet.toWei(2), $fWallet.toWei(3), $fWallet.toWei(5)],
                        choices: [$fWallet.toWei(1), $fWallet.toWei(2), $fWallet.toWei(4)],
                    },
                },
            });

            data.edges.push({
                proposal: {
                    name: 'Resolved, not voted',
                    contract: '0xe910b4c8fd8767bc4e53b2ec324e9e6f3fa5c157',
                    votingStarts: '0x5F71DE50',
                    votingMayEnd: '0x5F81B050',
                    votingMustEnd: '0x5F8EDF50',
                    state: {
                        isResolved: true,
                        state: $fWallet.toWei(1),
                    },
                    vote: {
                        weight: $fWallet.toWei(0),
                        choices: [],
                    },
                },
            });

            data.edges.push({
                proposal: {
                    name: 'Proposal - resolved, canceled',
                    contract: '0xf910b4c8fd8767bc4e53b2ec324e9e6f3fa5c157',
                    votingStarts: '0x5F969E20',
                    votingMayEnd: '0x5F81B050',
                    votingMustEnd: '0x5F8EDF50',
                    state: {
                        isResolved: true,
                        state: $fWallet.toWei(4),
                    },
                },
            });

            data.totalCount = data.edges.length.toString(16);

            return data;
        },

        tmpProposalDetail(_proposal) {
            const { $fWallet } = this;
            const params = {
                proposal: {
                    contract: '???',
                    name: 'Proposal 1',
                    // tmp
                    options: [
                        'Option 1 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex non officia tempore.',
                        'Option 2',
                        'Option 3',
                    ],
                    // opinionScales: [0, 20, 30, 40, 50],
                    opinionScales: [
                        $fWallet.toWei(0),
                        $fWallet.toWei(2),
                        $fWallet.toWei(3),
                        $fWallet.toWei(4),
                        $fWallet.toWei(5),
                    ],
                    // votingStarts: '0x5F996B50',
                    votingStarts: '0x5F969E20',
                    votingMayEnd: '0x5FAA8ED0',
                    votingMustEnd: '0x5FB7BDD0',
                    state: {
                        isResolved: false,
                        state: $fWallet.toWei(0),
                    },
                    governanceId: '0xc9838f60b2dbfba3efbf7b042335947f78e8fd6a',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex non officia tempore.',
                },
            };

            if (_proposal) {
                params.proposal = { ...params.proposal, ..._proposal };
            }

            this.$router.push({
                name: 'gov-proposal-detail',
                params,
            });
        },

        onRowAction(_item) {
            console.log(_item);

            this.tmpProposalDetail(_item.proposal);
        },

        formatDate,
        timestampToDate,
    },
};
</script>
