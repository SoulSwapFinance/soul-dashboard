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
                <f-card v-if="votingResolved" class="gov-proposal-detail__winner cont-600">
                    <h3 class="gov-proposal-detail__sub-title">Winner</h3>
                    <b>{{ winner }}</b>
                </f-card>

                <div v-for="(item, index) in items" :key="item.id" class="gov-proposal-detail__item">
                    <f-form v-if="!votingResolved && !item.vote" center-form @f-form-submit="onFormSubmit">
                        <fieldset>
                            <legend class="h2 perex not-visible">{{ d_proposal.description }}</legend>

                            <div class="form-body">
                                <div v-if="item.validator" class="gov-proposal-detail__validator-info">
                                    <h3>
                                        Validator: {{ item.validator.stakerInfo.name }} ({{
                                            parseInt(item.validator.id, 16)
                                        }})
                                        <span v-if="item.validator.stakerInfo._unknown" class="perex">
                                            {{ item.validator.stakerAddress }}
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

                                <div v-if="!canVote" class="align-center">
                                    <f-message type="warning" with-icon>
                                        You can't vote, you have no delegations.
                                    </f-message>
                                    <br />
                                </div>
                                <div v-else-if="!votingStarts">
                                    <f-message type="warning" with-icon>
                                        You can't vote, voting doesn't start yet.
                                    </f-message>
                                    <br />
                                </div>

                                <div class="align-center form-buttons">
                                    <button type="submit" class="btn large" :disabled="votingDisabled">Vote</button>
                                </div>
                            </div>

                            <input type="hidden" name="formIndex" :value="index" />
                        </fieldset>
                    </f-form>
                    <div v-else class="cont-600">
                        <div v-if="item.validator" class="gov-proposal-detail__validator-info">
                            <h3>
                                Validator: {{ item.validator.stakerInfo.name }}
                                <span v-if="item.validator.stakerInfo._unknown" class="perex">
                                    ({{ item.validator.stakerAddress }})
                                </span>
                            </h3>
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
                                                {{ formatVote(optionIdx, item.vote) }}
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
import FCard from '@/components/core/FCard/FCard.vue';

export default {
    name: 'GovProposalDetail',

    components: { FCard, FMessage, FForm, FSlider, FBackButton, PulseLoader },

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

        canVote() {
            return this.governance.canVote;
        },

        votingStarts() {
            const votingStarts = this.d_proposal.votingStarts || '';

            return votingStarts && prepareTimestamp(votingStarts) <= this.now();
        },

        votingDisabled() {
            return !this.votingStarts || !this.canVote || this.votingResolved;

            /*
            const votingStarts = this.d_proposal.votingStarts || '';

            return (
                (votingStarts ? prepareTimestamp(votingStarts) > this.now() || !this.canVote : true) ||
                this.votingResolved
            );
*/
        },

        votingResolved() {
            const { state } = this.d_proposal;

            return state && state.isResolved;
        },

        winner() {
            const { d_proposal } = this;

            if (d_proposal.state && d_proposal.state.isResolved && d_proposal.state.winnerId && d_proposal.options) {
                return d_proposal.options[parseInt(d_proposal.state.winnerId, 16)];
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
                _item.vote = null;
            });

            this.items = items;

            this.setVotes();

            // console.log('items', items);
            // console.log('proposal', this.d_proposal);
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

        async getVotesPromise(_delegatedTo = '', _govAddress = this.d_governanceId, _proposalId = this.d_proposalId) {
            if (!_govAddress || !_delegatedTo || !_proposalId) {
                return;
            }

            return this.$governance.fetchProposalVote(
                _govAddress,
                this.currentAccount.address,
                _delegatedTo,
                _proposalId
            );
        },

        async setVotes() {
            const { items } = this;
            const delegators = [];
            const promises = [];

            items.forEach((_item) => {
                const { validator } = _item;

                if (validator && validator.stakerAddress && !_item.vote) {
                    delegators.push(validator.stakerAddress);
                }
            });

            delegators.forEach((_delegatorAddress) => {
                promises.push(this.getVotesPromise(_delegatorAddress));
            });

            if (promises.length > 0) {
                try {
                    const data = await Promise.all(promises);
                    const { votingResolved } = this;

                    data.forEach((_vote) => {
                        const item = items.find(
                            (_item) => _item.validator && _item.validator.stakerAddress === _vote.delegatedTo
                        );

                        if (item) {
                            if (votingResolved || (_vote.vote.choices && _vote.vote.choices.length > 0)) {
                                item.vote = cloneObject(_vote.vote);
                            }
                        }
                    });
                } catch (_error) {
                    this.proposalError = _error;
                }
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
        formatVote(_index, _vote) {
            const { opinionScales } = this.d_proposal;

            if (opinionScales && _vote && _vote.choices && _vote.choices[_index] !== undefined) {
                return parseInt(opinionScales[parseInt(_vote.choices[_index], 16)], 16);
                // return parseInt(vote.choices[_index], 16);
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
                            validator: validator && validator.validator ? cloneObject(validator.validator) : {},
                            proposal: cloneObject(this.d_proposal),
                            // votes: optionIdxs.map((_idx) => opinionScales[_idx]),
                            // votes: optionIdxs.map((_idx) => $fWallet.toWei(_idx)),
                            votes: optionIdxs.map((_idx) => `0x${_idx.toString(16)}`),
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
