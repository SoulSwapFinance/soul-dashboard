<template>
    <div class="claim-rewards-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="claim-rewards-confirmation"
            send-button-label="Claim Rewards"
            password-label="Please enter your wallet password to claim rewards"
            :gas-limit="gasLimit"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h2 class="cont-with-back-btn">
                <span v-if="reStake">Claim & Restake</span>
                <span v-else>Claim Rewards</span>
                <button type="button" class="btn light" @click="onBackBtnClick">Back</button>
            </h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Validator</div>
                    <div class="col break-word">
                        {{ accountInfo.stakerInfo.stakerInfo.name }}, {{ accountInfo.stakerId }}
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Amount</div>
                    <div class="col break-word">{{ toFTM(accountInfo.delegation.pendingRewards.amount) }} FTM</div>
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
    </div>
</template>

<script>
import { toFTM } from '../../utils/transactions.js';
import { mapGetters } from 'vuex';
import sfcUtils from 'fantom-ledgerjs/src/sfc-utils.js';
import TxConfirmation from '../TxConfirmation/TxConfirmation.vue';
import { GAS_LIMITS } from '../../plugins/fantom-web3-wallet.js';
import LedgerConfirmationContent from '../LedgerConfirmationContent/LedgerConfirmationContent.vue';

export default {
    name: 'ClaimRewardsConfirmation',

    components: { LedgerConfirmationContent, TxConfirmation },

    props: {
        /** `accountInfo` object from `StakingInfo` component. */
        accountInfo: {
            type: Object,
            default() {
                return {};
            },
        },
        /***/
        stakerId: {
            type: String,
            default: '',
        },
        /***/
        reStake: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            tx: {},
            gasLimit: GAS_LIMITS.claimRewards,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    // activated() {
    mounted() {
        this.setTx();
    },

    methods: {
        async setTx() {
            this.tx = await this.$fWallet.getSFCTransactionToSign(
                // sfcUtils.claimDelegationRewardsTx(this.accountInfo.toEpoch),
                this.reStake
                    ? sfcUtils.claimDelegationRewardsCompoundTx(200, parseInt(this.stakerId, 16))
                    : sfcUtils.claimDelegationRewardsTx(200, parseInt(this.stakerId, 16)),
                this.currentAccount.address,
                this.gasLimit
            );
        },

        onSendTransactionSuccess(_data) {
            this.$emit('change-component', {
                to: 'transaction-success-message',
                from: 'claim-rewards-confirmation',
                data: {
                    tx: _data.data.sendTransaction.hash,
                    successMessage: this.reStake ? 'Claim & Restake Rewards Successful' : 'Claiming Rewards Successful',
                    continueTo: 'staking-info',
                    continueToParams: {
                        stakerId: this.stakerId,
                    },
                },
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

        onBackBtnClick() {
            this.$emit('change-component', {
                to: 'staking-info',
                from: 'claim-rewards-confirmation',
                data: {
                    stakerId: this.stakerId,
                },
            });
        },

        toFTM,
    },
};
</script>
