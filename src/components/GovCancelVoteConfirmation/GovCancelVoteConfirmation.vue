<template>
    <div class="gov-cancel-vote-confirmation">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            card-off
            send-button-label="Submit"
            password-label="Please enter your wallet password to cancel vote"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h1 class="with-back-btn">
                <f-back-button :route-name="getBackButtonRoute(compName)" :params="$route.params" />
                Cancel Vote Confirmation
            </h1>

            <div class="confirmation-info__">
                <div v-if="d_validator.stakerAddress" class="gov-proposal-detail__validator-info align-center">
                    <h3>
                        Validator: {{ d_validator.stakerInfo.name }} ({{ parseInt(d_validator.id, 16) }})
                        <span v-if="d_validator.stakerInfo._unknown" class="perex">
                            {{ d_validator.stakerAddress }}
                        </span>
                    </h3>
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

export default {
    name: 'GovCancelVoteConfirmation',

    components: { FMessage, LedgerConfirmationContent, FBackButton, TxConfirmation },

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
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },

        hasCorrectParams() {
            return !!this.d_proposalId && !!this.d_governanceId;
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
        }

        this.setTx();
    },

    methods: {
        async setTx() {
            const web3 = new Web3();
            const { params } = this;

            this.tx = await this.$fWallet.getDefiTransactionToSign(
                governanceUtils.governanceCancelVote(
                    web3,
                    params.governanceId,
                    this.d_validator.stakerAddress || this.currentAccount.address,
                    params.proposalId
                ),
                this.currentAccount.address
            );
        },

        onSendTransactionSuccess(_data) {
            const params = {
                tx: _data.data.sendTransaction.hash,
                title: 'Success',
                continueTo: this.getBackButtonRoute(this.compName),
                continueToParams: this.$route.params,
            };

            this.$router.replace({
                name: `gov-cancel-vote-transaction-success-message`,
                params,
            });
        },

        /**
         * Re-target `'change-component'` event.
         *
         * @param {object} _data
         */
        onChangeComponent(_data) {
            if (_data.to === 'transaction-reject-message') {
                this.$router.replace({
                    name: 'gov-cancel-vote-transaction-reject-message',
                    params: {
                        continueTo: this.getBackButtonRoute(this.compName),
                        continueToParams: this.$route.params,
                    },
                });
            }
        },
    },
};
</script>
