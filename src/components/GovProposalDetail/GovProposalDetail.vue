<template>
    <div class="gov-proposal-detail">
        <template v-if="hasCorrectParams">
            <h1 v-if="isView" class="with-back-btn">
                <f-back-button :route-name="getBackButtonRoute('gov-proposal-detail')" />
                {{ d_proposal.name }}
            </h1>

            <h2 class="perex">{{ d_proposal.description }}</h2>
            <!--<h2 v-if="loading || votingResolved" class="perex">{{ d_proposal.description }}</h2>-->

            <div v-if="loading" class="gov-proposal-detail__loader">
                <pulse-loader color="#1969ff"></pulse-loader>
            </div>
            <template v-else>
                <div v-for="(item, index) in items" :key="item.id" class="gov-proposal-detail__item">
                    <f-form v-if="!votingResolved" center-form @f-form-submit="onFormSubmit">
                        <fieldset>
                            <legend class="h2 perex not-visible">{{ d_proposal.description }}</legend>

                            <div class="form-body">
                                <div v-if="item.validator" class="gov-proposal-detail__validator-info">
                                    <h3>
                                        Validator: {{ item.validator.stakerInfo.name }}
                                        <span v-if="item.validator.stakerInfo._unknown" class="perex">
                                            ({{ item.validator.stakerAddress }})
                                        </span>
                                    </h3>
                                </div>

                                <ul class="no-markers gov-proposal-detail__options" aria-label="list of proposals">
                                    <li
                                        v-for="(optionItem, optionIdx) in d_proposal.options"
                                        :key="`govprpsl${optionIdx}`"
                                    >
                                        <f-slider
                                            :label="optionItem"
                                            :name="`option_${optionIdx}_${index}`"
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
                            </div>

                            <input type="hidden" name="formIndex" :value="index" />
                        </fieldset>
                    </f-form>
                    <div v-else class="cont-600">
                        <div class="gov-proposal-detail__winner">
                            <h3 class="gov-proposal-detail__sub-title">Winner</h3>
                            <b>{{ winner }}</b>
                        </div>

                        <div class="gov-proposal-detail__voter-votes">
                            <h3 class="gov-proposal-detail__sub-title">Your votes</h3>
                            <div class="gov-proposal-detail__cont-resolved">
                                <ul class="no-markers gov-proposal-detail__options" aria-label="list of proposals">
                                    <li
                                        v-for="(optionItem, optionIdx) in d_proposal.options"
                                        :key="`govprpsl${optionIdx}`"
                                    >
                                        <div class="row align-items-center">
                                            <div class="col col-8 gov-proposal-detail__option">{{ optionItem }}</div>
                                            <div class="col col-4 gov-proposal-detail__vote">
                                                {{ getVote(optionIdx) }}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr />
                </div>

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
            </template>

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
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { cloneObject, getUniqueId } from '@/utils';
import { eventBusMixin } from '@/mixins/event-bus.js';
import gql from 'graphql-tag';

export default {
    name: 'GovProposalDetail',

    components: { FMessage, FForm, FSlider, FBackButton, PulseLoader },

    mixins: [viewHelpersMixin, eventBusMixin],

    props: {
        /** @type {GovernanceProposal} */
        proposal: {
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
            /** Proposal's id */
            d_proposalId: this.proposalId,
            /** Governance contract address */
            d_governanceId: this.governanceId,
            governance: {},
            validators: [],
            items: [],
            loading: false,
            proposalError: '',
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

            return opinionScales ? opinionScales.map((_item) => parseInt(_item, 16)) : [];
        },

        votingDisabled() {
            const votingStarts = this.d_proposal.votingStarts || '';

            return (
                (votingStarts ? prepareTimestamp(votingStarts) > this.now() || !this.governance.canVote : true) ||
                this.votingResolved
            );
        },

        votingResolved() {
            const { state } = this.d_proposal;

            return state && state.isResolved;
        },

        winner() {
            const { d_proposal } = this;

            if (d_proposal.state && d_proposal.state.isResolved && d_proposal.state.winnerId && d_proposal.options) {
                return d_proposal.options[this.$fWallet.fromWei(d_proposal.state.winnerId)];
            }

            return '-';
        },

        hasCorrectParams() {
            return !!this.d_proposalId && !!this.d_governanceId;
        },
    },

    async created() {
        this.setDataFromParams();

        if (!this.hasCorrectParams && this.isView) {
            // redirect
            setTimeout(() => {
                this.$router.replace({ name: this.getBackButtonRoute('gov-proposal-detail') });
            }, 3000);
        }

        this._eventBus.on('account-picked', this.onAccountPicked);

        this.init();
    },

    methods: {
        async init() {
            const promises = await Promise.all([this.fetchProposal(), this.fetchValidators()]);

            this.validators = promises[1];

            // set items
            const items = [];
            const { delegationsBy } = this.governance;

            if (delegationsBy && delegationsBy.length > 0) {
                delegationsBy.forEach((_validatorAddress) => {
                    const validator = this.validators.find(
                        (_validator) => _validator.stakerAddress === _validatorAddress
                    );

                    if (validator) {
                        items.push({
                            validator,
                        });
                    }
                });
            } else {
                items.push({
                    validator: null,
                });
            }

            items.forEach((_item) => {
                _item.id = getUniqueId();
            });

            this.items = items;
        },

        async fetchProposal(_govAddress = this.d_governanceId, _proposalId = this.d_proposalId) {
            if (!_govAddress || !_proposalId) {
                return;
            }

            this.loading = true;

            try {
                const data = await this.$governance.fetchProposal(
                    _govAddress,
                    this.currentAccount.address,
                    _proposalId
                );

                // console.log(data);
                this.governance = data;
                this.d_proposal = data.proposal;

                this.loading = false;
            } catch (_error) {
                this.loading = false;
                this.proposalError = _error;
            }
        },

        /**
         * @return {Promise<Array>}
         */
        async fetchValidators() {
            const data = await this.$apollo.query({
                query: gql`
                    query Stakers {
                        stakers {
                            id
                            stakerAddress
                            createdTime
                            stake
                            totalStake
                            delegatedMe
                            poi
                            stakerInfo {
                                name
                                website
                                contact
                                logoUrl
                            }
                        }
                    }
                `,
                fetchPolicy: 'network-only',
            });
            const tUnknown = this.$t('view_validator_list.unknown');
            const { stakers } = data.data;

            stakers.forEach((_staker) => {
                if (!_staker.stakerInfo) {
                    _staker.stakerInfo = {};
                }

                if (!_staker.stakerInfo.name) {
                    _staker.stakerInfo.name = tUnknown;
                    _staker.stakerInfo._unknown = true;
                }
            });

            return stakers || [];
        },

        /**
         * @param {number} _index Option index
         */
        getVote(_index) {
            const { $fWallet } = this;
            const { vote } = this.d_proposal;
            const { opinionScales } = this.d_proposal;

            if (opinionScales && vote && vote.choices && vote.choices[_index] !== undefined) {
                return $fWallet.fromWei(opinionScales[$fWallet.fromWei(vote.choices[_index])]);
                // return this.$fWallet.fromWei(vote.choices[_index]);
            } else {
                return '-';
            }
        },

        now() {
            return new Date().getTime();
        },

        onFormSubmit(_event) {
            // const { $fWallet } = this;
            const { options } = this.d_proposal;
            const { opinionScales } = this.d_proposal;
            const { data } = _event.detail;
            const formIndex = parseInt(data.formIndex);
            let optionIdxs = [];
            let value = 0;
            let validator = null;

            if (
                !this.votingDisabled &&
                options &&
                options.length > 0 &&
                opinionScales &&
                opinionScales.length > 0 &&
                !isNaN(formIndex)
            ) {
                for (let i = 0, len1 = options.length; i < len1; i++) {
                    value = parseInt(data[`option_${i}_${formIndex}`], 10);

                    if (!isNaN(value)) {
                        optionIdxs.push(value);
                    } else {
                        optionIdxs = [];
                        break;
                    }
                }

                if (optionIdxs.length > 0) {
                    validator = this.items[formIndex];

                    this.$router.push({
                        name: 'gov-proposal-confirmation',
                        params: {
                            proposalId: this.d_proposalId,
                            governanceId: this.d_governanceId,
                            validator: validator ? cloneObject(validator.validator) : {},
                            proposal: cloneObject(this.d_proposal),
                            // votes: optionIdxs.map((_idx) => opinionScales[_idx]),
                            // votes: optionIdxs.map((_idx) => $fWallet.toWei(_idx)),
                            votes: optionIdxs.map((_idx) => _idx.toString(16)),
                        },
                    });
                }
            }
        },

        onAccountPicked() {
            this.init();
        },

        timestampToDate,
        formatDate,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
