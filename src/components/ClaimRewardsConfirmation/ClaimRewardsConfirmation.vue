<template>
    <div class="claim-rewards-confirmation">
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="claim-rewards-confirmation"
            go-back-comp-name="staking-info"
            send-button-label="Claim Rewards"
            password-label="Please enter your wallet password to claim rewards"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h2>Claim Rewards</h2>

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
                <ol class="f-data-layout">
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Send To</div>
                            <div class="col break-word">
                                {{ tx.to }}
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">From</div>
                            <div class="col break-word">
                                {{ currentAccount.address }}
                                <span class="f-row-label">( {{ toFTM(currentAccount.balance) }} FTM )</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Amount</div>
                            <div class="col">
                                0
                            </div>
                        </div>
                    </li>
                </ol>
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

export default {
    name: 'ClaimRewardsConfirmation',

    components: { TxConfirmation },

    props: {
        /** `accountInfo` object from `StakingInfo` component. */
        accountInfo: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    data() {
        return {
            tx: {},
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    activated() {
        this.setTx();
    },

    methods: {
        async setTx() {
            this.tx = await this.$fWallet.getSFCTransactionToSign(
                // sfcUtils.claimDelegationRewardsTx(this.accountInfo.toEpoch),
                sfcUtils.claimDelegationRewardsTx(200),
                this.currentAccount.address,
                GAS_LIMITS.claimRewards
            );
        },

        onSendTransactionSuccess(_data) {
            this.$emit('change-component', {
                to: 'transaction-success-message',
                from: 'claim-rewards-confirmation',
                data: {
                    tx: _data.data.sendTransaction.hash,
                    successMessage: 'Claiming Rewards Successful',
                    continueTo: 'account-history',
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

        toFTM,
    },
};
</script>
