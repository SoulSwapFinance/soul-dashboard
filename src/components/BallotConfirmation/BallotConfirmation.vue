<template>
    <div class="ballot-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="withdraw-ftm-confirmation"
            send-button-label="Vote"
            password-label="Please enter your wallet password to vote"
            :gas-limit="gasLimit"
            :on-send-transaction-success="onSendTransactionSuccess"
            :on-go-back="onGoBack"
            @change-component="onChangeComponent"
        >
            <h2>
                Vote - Confirmation <span class="f-steps"><b>2</b> / 2</span>
            </h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Poll Name</div>
                    <div class="col break-word">
                        <template v-if="ballot.detailsUrl">
                            <a :href="ballot.detailsUrl" target="_blank">{{ ballot.name }}</a>
                        </template>
                        <template v-else>
                            {{ ballot.name }}
                        </template>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Vote</div>
                    <div class="col break-word">
                        {{ getProposalById(proposal, ballot.proposals).name }}
                    </div>
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
    </div>
</template>

<script>
import TxConfirmation from '../TxConfirmation/TxConfirmation.vue';
import { GAS_LIMITS } from '../../plugins/fantom-web3-wallet.js';
import { mapGetters } from 'vuex';
import sfcUtils from 'fantom-ledgerjs/src/sfc-utils.js';
import { toFTM } from '../../utils/transactions.js';
import LedgerConfirmationContent from '../LedgerConfirmationContent/LedgerConfirmationContent.vue';

export default {
    name: 'BallotConfirmation',

    components: { LedgerConfirmationContent, TxConfirmation },

    props: {
        /** Ballot data object. */
        ballot: {
            type: Object,
            default() {
                return {};
            },
            required: true,
        },
        /** Id of `ballot.proposals` array item. */
        proposal: {
            type: Number,
            default: -1,
        },
    },

    data() {
        return {
            tx: {},
            gasLimit: GAS_LIMITS.ballot,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    created() {
        this.setTx();
    },

    methods: {
        async setTx() {
            if (this.proposal > -1) {
                this.tx = await this.$fWallet.getSFCTransactionToSign(
                    sfcUtils.ballotVote(this.ballot.address, this.proposal),
                    this.currentAccount.address,
                    this.gasLimit
                );
            }
        },

        /**
         * @param {int} _id
         * @param {array} _proposals
         * @return {Object}
         */
        getProposalById(_id, _proposals) {
            return _proposals.find((_item) => _item.id === _id) || {};
        },

        onSendTransactionSuccess(_data) {
            this.$emit('change-component', {
                to: 'transaction-success-message',
                from: 'ballot-confirmation',
                data: {
                    tx: _data.data.sendTransaction.hash,
                    successMessage: 'Polls Successful',
                    continueTo: 'account-history',
                },
            });
        },

        onGoBack() {
            this.$emit('change-component', {
                to: 'ballot-form',
                from: 'ballot-confirmation',
                data: this.ballot,
            });
        },

        /**
         * Re-target `'change-component'` event.
         *
         * @param {object} _data
         */
        onChangeComponent(_data) {
            this.$emit('change-component', _data);
        },

        toFTM,
    },
};
</script>
