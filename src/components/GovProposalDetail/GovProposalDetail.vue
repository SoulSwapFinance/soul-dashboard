<template>
    <div class="gov-proposal-detail">
        <template v-if="hasCorrectParams">
            <h1 class="with-back-btn">
                <f-back-button :route-name="getBackButtonRoute('gov-proposal-detail')" />
                {{ d_proposal.name }}
            </h1>

            <f-form center-form @f-form-submit="onFormSubmit">
                <fieldset>
                    <legend class="h2 perex">{{ d_proposal.description }}</legend>

                    <div class="form-body">
                        <ul class="no-markers gov-proposal-detail__options" aria-label="list of proposals">
                            <li v-for="(item, index) in d_proposal.options" :key="`govprpsl${index}`">
                                <f-slider
                                    :label="item"
                                    :name="`option${index}`"
                                    :max="sliderMax"
                                    :value="sliderInitialValue"
                                    :labels="sliderLabels"
                                    clickable-labels
                                    use-lower-fill-bar
                                />
                            </li>
                        </ul>

                        <div class="align-center form-buttons">
                            <button type="submit" class="btn large" :disabled="votingDisabled">Vote</button>
                        </div>

                        <div>{{ tmpSelected }}</div>
                    </div>
                </fieldset>
            </f-form>

            <div class="row gov-proposal-detail__dates">
                <div class="col df-data-item">
                    <div class="label">Voting Starts</div>
                    <div class="date">
                        {{ formatDate(timestampToDate(d_proposal.votingStarts), true, true) }}
                    </div>
                </div>
                <div class="col df-data-item">
                    <div class="label">Voting May End</div>
                    <div class="date">
                        {{ formatDate(timestampToDate(d_proposal.votingMayEnd), true, true) }}
                    </div>
                </div>
                <div class="col df-data-item">
                    <div class="label">Voting Ends</div>
                    <div class="date">
                        {{ formatDate(timestampToDate(d_proposal.votingMustEnd), true, true) }}
                    </div>
                </div>
            </div>

            <div v-if="proposalError" class="query-error">{{ proposalError }}</div>
        </template>
        <template v-else>
            <f-message type="info" role="alert" class="big">Select a proposal first, please.</f-message>
        </template>
    </div>
</template>

<script>
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';
import { viewHelpersMixin } from '@/mixins/view-helpers.js';
import FSlider from '@/components/core/FSlider/FSlider.vue';
import FForm from '@/components/core/FForm/FForm.vue';
import { formatDate, prepareTimestamp, timestampToDate } from '@/filters.js';
import FMessage from '@/components/core/FMessage/FMessage.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'GovProposalDetail',

    components: { FMessage, FForm, FSlider, FBackButton },

    mixins: [viewHelpersMixin],

    props: {
        /** @type {GovernanceProposal} */
        proposal: {
            type: Object,
            default() {
                return {};
            },
        },
        govAddress: {
            type: String,
            default: '',
        },
        /** Identifies if component is view (has route). */
        isView: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            /**@type {GovernanceProposal} */
            d_proposal: this.proposal,
            d_govAddress: this.govAddress,
            loading: false,
            proposalError: '',
            tmpSelected: null,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        sliderMax() {
            const { opinionScales } = this.d_proposal;

            return opinionScales ? (opinionScales.length - 1).toString() : '0';
        },

        sliderInitialValue() {
            const { opinionScales } = this.d_proposal;

            return opinionScales ? Math.floor(opinionScales.length / 2).toString() : '0';
        },

        sliderLabels() {
            const { opinionScales } = this.d_proposal;

            return opinionScales ? this.$fWallet.fromWei(opinionScales) : [];
        },

        votingDisabled() {
            const votingStarts = this.d_proposal.votingStarts || '';
            const { state } = this.d_proposal;

            if (state) {
                console.log(state.isResolved, state.state);
            }

            return votingStarts ? prepareTimestamp(votingStarts) > this.now() : true;
        },

        hasCorrectParams() {
            const { d_proposal } = this;

            return !!d_proposal.contract && !!d_proposal.governanceId;
        },
    },

    created() {
        this.setDataFromParams();

        if (!this.hasCorrectParams && this.isView) {
            // redirect
            setTimeout(() => {
                this.$router.replace({ name: this.getBackButtonRoute('gov-proposal-detail') });
            }, 3000);
        }

        // this.fetchProposal();
    },

    methods: {
        async fetchProposal(_govAddress = this.d_proposal.governanceId, _proposalContract = this.d_proposal.contract) {
            if (!_govAddress || !_proposalContract) {
                return;
            }

            this.loading = true;

            try {
                const data = await this.$governance.fetchProposal(_govAddress, this.currentAccount, _proposalContract);

                console.log(data);
            } catch (_error) {
                this.loading = false;
                this.proposalError = _error;
            }
        },

        now() {
            return new Date().getTime();
        },

        onFormSubmit(_event) {
            const { options } = this.d_proposal;
            const { opinionScales } = this.d_proposal;
            const { data } = _event.detail;
            let optionIdxs = [];
            let value = 0;

            if (!this.votingDisabled && options && options.length > 0 && opinionScales && opinionScales.length > 0) {
                for (let i = 0, len1 = options.length; i < len1; i++) {
                    value = parseInt(data[`option${i}`], 10);

                    if (!isNaN(value)) {
                        optionIdxs.push(value);
                    } else {
                        optionIdxs = [];
                        break;
                    }
                }

                if (optionIdxs.length > 0) {
                    this.tmpSelected = optionIdxs.map((_idx) => opinionScales[_idx]);
                    console.log('onSubmit', this.tmpSelected);
                }
            }
        },

        timestampToDate,
        formatDate,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
