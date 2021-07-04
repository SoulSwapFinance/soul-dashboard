<template>
    <div class="gov-proposal-confirmation">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            card-off
            send-button-label="Submit"
            password-label="Please enter your wallet password to vote"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h1 class="with-back-btn">
                <f-back-button :route-name="getBackButtonRoute(compName)" :params="$route.params" />
                Confirmation
            </h1>

            <div class="confirmation-info__">
                <div v-if="d_validator.stakerAddress" class="gov-proposal-detail__validator-info align-center">
                    <h3 class="gov-proposal-confirmation__subtitle">
                        You're voting with
                        <f-placeholder :content-loaded="!!amountDelegated" :replacement-num-chars="10">
                            {{ amountDelegated }}
                        </f-placeholder>
                        FTM delegated to {{ d_validator.stakerInfo.name }} ({{ parseInt(d_validator.id, 16) }})
                        <span v-if="d_validator.stakerInfo._unknown" class="perex">
                            {{ d_validator.stakerAddress }}
                        </span>
                    </h3>
                </div>

                <div class="gov-proposal-detail__voter-votes">
                    <h3 class="gov-proposal-detail__sub-title">Your vote</h3>
                    <div class="gov-proposal-detail__cont-resolved">
                        <ul class="no-markers gov-proposal-detail__options" aria-label="list of proposals">
                            <li v-for="(item, index) in d_proposal.options" :key="`govprpsl${index}`">
                                <div class="row align-items-center no-collapse">
                                    <div class="col col-8 gov-proposal-detail__option">{{ item }}</div>
                                    <div class="col col-4 gov-proposal-detail__vote">{{ getVote(index) }}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" :max-fee="tx._fee" />
            </template>
        </tx-confirmation>
        <template v-else>
            <f-message type="info" role="alert" class="big"> Bad parameters. </f-message>
        </template>
    </div>
</template>

<script>
import TxConfirmation from '@/components/TxConfirmation/TxConfirmation.vue';
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';
import LedgerConfirmationContent from '@/components/LedgerConfirmationContent/LedgerConfirmationContent.vue';
import FMessage from '@/components/core/FMessage/FMessage.vue';
import { mapGetters } from 'vuex';
import { viewHelpersMixin } from '@/mixins/view-helpers.js';
import { toKebabCase } from '@/utils';
import governanceUtils from 'fantom-ledgerjs/src/governance-utils.js';
import Web3 from 'web3';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import { fFetch } from '@/plugins/ffetch.js';
import gql from 'graphql-tag';
import { formatNumberByLocale } from '@/filters.js';
import { WEIToFTM } from '@/utils/transactions.js';

export default {
    name: 'GovProposalConfirmation',

    components: { FPlaceholder, FMessage, LedgerConfirmationContent, FBackButton, TxConfirmation },

    mixins: [viewHelpersMixin],

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
        validator: {
            type: Object,
            default() {
                return {};
            },
        },
        /** Voter's votes */
        votes: {
            type: Array,
            default() {
                return [];
            },
        },
        /** Identifies if component is view (has route). */
        isView: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            tx: {},
            compName: toKebabCase(this.$options.name),
            /**@type {GovernanceProposal} */
            d_proposal: this.proposal,
            /** Proposal's od */
            d_proposalId: this.proposalId,
            /** Governance contract address */
            d_governanceId: this.governanceId,
            d_validator: this.validator,
            /** Voter's votes */
            d_votes: this.votes,
            /** */
            amountDelegated: '',
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * @return {{pendingRewards: number, token: DefiToken}}
         */
        params() {
            const { $route } = this;
            let params = {};

            if ($route) {
                if ($route.query && $route.query.token) {
                    params = $route.query;
                } else if ($route.params) {
                    params = $route.params;
                }
            }

            return params;
        },

        hasCorrectParams() {
            return !!this.d_proposalId && !!this.d_governanceId && !!this.d_proposal.options;
        },
    },

    created() {
        this.setDataFromParams();

        if (!this.hasCorrectParams && this.isView) {
            // redirect
            setTimeout(() => {
                this.$router.replace({
                    name: this.getBackButtonRoute(this.compName),
                    params: this.$route.params,
                });
            }, 3000);
        } else if (this.d_validator.id) {
            this.fetchDelegation(this.d_validator.id).then((_delegation) => {
                if (_delegation && _delegation.amount) {
                    this.amountDelegated = this.formatNumberByLocale(this.WEIToFTM(_delegation.amount));
                }
            });
        }

        this.setTx();
    },

    methods: {
        async setTx() {
            const web3 = new Web3();
            const { params } = this;

            this.tx = await this.$fWallet.getDefiTransactionToSign(
                governanceUtils.governanceVote(
                    web3,
                    params.governanceId,
                    this.d_validator.stakerAddress || this.currentAccount.address,
                    params.proposalId,
                    params.votes
                ),
                this.currentAccount.address
            );
        },

        /**
         * @param {number} _index Option index
         */
        getVote(_index) {
            // const { $fWallet } = this;
            const { d_votes } = this;
            const { opinionScales } = this.d_proposal;

            if (opinionScales && d_votes && d_votes[_index] !== undefined) {
                return parseInt(opinionScales[parseInt(d_votes[_index], 16)], 16);
                // return $fWallet.fromWei(opinionScales[$fWallet.fromWei(d_votes[_index])]);
                // return this.$fWallet.fromWei(d_votes[_index]);
            } else {
                return '-';
            }
        },

        async fetchDelegation(_validatorId) {
            if (!_validatorId) {
                return null;
            }

            try {
                const data = await fFetch.fetchGQLQuery(
                    {
                        query: gql`
                            query Delegation($address: Address!, $staker: BigInt!) {
                                delegation(address: $address, staker: $staker) {
                                    amount
                                }
                            }
                        `,
                        variables: {
                            address: this.currentAccount.address,
                            staker: _validatorId,
                        },
                    },
                    'delegation'
                );

                return data && data.data && data.data.delegation ? data.data.delegation : {};
            } catch (_error) {
                console.error(_error);
            }
        },

        onSendTransactionSuccess(_data) {
            const params = {
                tx: _data.data.sendTransaction.hash,
                title: 'Success',
                continueTo: this.getBackButtonRoute(this.compName),
                continueToParams: this.$route.params,
            };

            this.$router.replace({
                name: `gov-proposal-transaction-success-message`,
                params,
            });
        },

        /**
         * Re-target `'change-component'` event.
         *
         * @param {object} _data
         */
        onChangeComponent(_data) {
            let transactionRejectComp = `gov-proposal-transaction-reject-message`;

            if (_data.to === 'transaction-reject-message') {
                this.$router.replace({
                    name: transactionRejectComp,
                    params: {
                        continueTo: this.getBackButtonRoute(this.compName),
                        continueToParams: this.$route.params,
                    },
                });
            }
        },

        formatNumberByLocale,
        WEIToFTM,
    },
};
</script>
<style>
.gov-proposal-confirmation__subtitle {
    font-size: 21px !important;
}
</style>
