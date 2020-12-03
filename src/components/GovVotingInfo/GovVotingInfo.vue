<template>
    <div class="gov-voting-info">
        <f-card class="cont-650">
            <h3 class="gov-voting-info__title">
                Total Votes <br />
                <f-colored-number-range :value="overallVotes" :colors="overallVotesColors" show-percentage />
                <span class="perex">(min. {{ minVotes }}%)</span>
            </h3>

            <f-data-table
                :columns="columns"
                :items="options"
                f-card-off
                class="gov-voting-info__table f-data-table-body-bg-color"
            >
                <template v-slot:column-agreementRatio="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <f-colored-number-range :value="value" :colors="overallVotesColors" show-percentage />
                        </div>
                    </div>
                    <template v-else>
                        <f-colored-number-range :value="value" :colors="overallVotesColors" show-percentage />
                    </template>
                </template>
            </f-data-table>
        </f-card>
    </div>
</template>

<script>
import FCard from '@/components/core/FCard/FCard.vue';
import FColoredNumberRange from '@/components/core/FColoredNumberRange/FColoredNumberRange.vue';
import FDataTable from '@/components/core/FDataTable/FDataTable.vue';
import Vue from 'vue';

export default {
    name: 'GovVotingInfo',

    components: { FDataTable, FColoredNumberRange, FCard },

    props: {
        /** @type {GovernanceContract} */
        governance: {
            type: Object,
            default() {
                return {};
            },
        },
        /** Proposal's id */
        proposalId: {
            type: String,
            default: '',
        },
        /** Governance contract address */
        governanceId: {
            type: String,
            default: '',
        },
        optionStates: {
            type: Array,
            default() {
                return null;
            },
        },
    },

    data() {
        return {
            /** @type {OptionState[]} */
            options: [],
            /** @type {GovernanceProposal} */
            proposal: {},
            votes: 0,
            columns: [
                {
                    name: 'name',
                    label: 'Option',
                    width: '55%',
                },
                {
                    name: 'agreementRatio',
                    label: 'Agreement',
                    formatter: (_value) => this.toFloat(_value) * 100,
                    css: {
                        textAlign: 'right',
                    },
                },
            ],
        };
    },

    computed: {
        overallVotes() {
            const { totalWeight } = this.proposal;

            return parseInt(totalWeight, 16) !== 0 ? (this.votes / this.toFloat(totalWeight)) * 100 : 0;
        },

        overallVotesColors() {
            return this.$governance.getOverallVotesColors(this.minVotes);
        },

        minVotes() {
            return parseInt(this.toFloat(this.proposal.minVotes) * 100, 10);
        },

        minAgreement() {
            return parseInt(this.toFloat(this.proposal.minAgreement) * 100, 10);
        },
    },

    watch: {
        optionStates() {
            this.init();
        },
    },

    created() {
        this.proposal = this.governance.proposal;

        setTimeout(() => {
            this.init();
        }, 10);
    },

    methods: {
        async init() {
            const { proposal } = this;
            const { optionStates } = this;
            const _optionStates =
                optionStates || (await this.$governance.fetchProposalOptionStates(this.governanceId, this.proposalId));

            _optionStates.forEach((_option) => {
                _option.name = proposal.options[parseInt(_option.optionId, 16)] || '';

                if (this.votes === 0) {
                    this.votes = this.toFloat(_option.votes);
                }
            });

            // update second column's label
            const col = this.columns[1];
            Vue.set(col, 'label', `Agreement (min. ${this.minAgreement}%)`);

            this.options = _optionStates;
        },

        toFloat(_bn) {
            return parseFloat(this.$defi.shiftDecPointLeft(_bn, 18));
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
