<template>
    <div class="view-defi-mint-repay-confirmation">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            card-off
            no-previous-button
            confirmation-comp-name="withdraw-ftm-confirmation"
            :send-button-label="sendButtonLabel"
            :password-label="passwordLabel"
            :gas-limit="gasLimit"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> Confirmation</h1>

            <div class="info">
                <div v-if="increasedDebt > 0">
                    You’re adding <span class="inc-desc-collateral">{{ increasedDebt.toFixed(2) }} fUSD</span>
                </div>
                <div v-else-if="decreasedDebt > 0">
                    You’re removing <span class="inc-desc-collateral">{{ decreasedDebt.toFixed(2) }} fUSD</span>
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
        <template v-else>
            <f-message type="info" role="alert" class="big">
                Adjust fUSD first, please.
            </f-message>
        </template>
    </div>
</template>

<script>
import TxConfirmation from '../../components/TxConfirmation/TxConfirmation.vue';
import LedgerConfirmationContent from '../../components/LedgerConfirmationContent/LedgerConfirmationContent.vue';
import { GAS_LIMITS } from '../../plugins/fantom-web3-wallet.js';
import { mapGetters } from 'vuex';
// import sfcUtils from 'fantom-ledgerjs/src/sfc-utils.js';
import { toFTM } from '../../utils/transactions.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';

export default {
    name: 'DefiMintRepayConfirmation',

    components: { FMessage, FBackButton, LedgerConfirmationContent, TxConfirmation },

    data() {
        return {
            tx: {},
            gasLimit: GAS_LIMITS.default,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },

        hasCorrectParams() {
            return this.params.currDebt !== this.params.debt;
        },

        increasedDebt() {
            return this.params.currDebt - this.params.debt;
        },

        decreasedDebt() {
            return this.params.debt - this.params.currDebt;
        },

        sendButtonLabel() {
            return this.increasedDebt > 0 ? 'Mint now' : 'Repay now';
        },

        passwordLabel() {
            return this.params.debt > 0
                ? 'Please enter your wallet password to rebalance your debt'
                : 'Please enter your wallet password to add your debt';
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-mint-repay-confirmation');

            return parentNode ? parentNode.route : '';
        },
    },

    created() {
        this.setTx();

        if (!this.hasCorrectParams) {
            // redirect to <defi-mint-repay>
            setTimeout(() => {
                this.$router.replace({ name: 'defi-mint-repay' });
            }, 3000);
        }
    },

    methods: {
        async setTx() {
            console.log('setTx');
            /*
                const { withdrawRequest } = this;

                this.tx = await this.$fWallet.getSFCTransactionToSign(
                    withdrawRequest.withdrawRequestID
                        ? sfcUtils.withdrawPartTx(parseInt(withdrawRequest.withdrawRequestID, 16))
                        : sfcUtils.withdrawDelegationTx(),
                    this.currentAccount.address,
                    GAS_LIMITS.withdraw
                );
    */
        },

        onSendTransactionSuccess(_data) {
            this.$router.replace({
                name: 'defi-mint-repay-transaction-success-message',
                params: {
                    tx: _data.data.sendTransaction.hash,
                    title: 'Success',
                    continueTo: 'defi-mint-repay',
                },
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
                    name: 'defi-mint-repay-transaction-reject-message',
                    params: {
                        continueTo: 'defi-mint-repay',
                    },
                });
            }
        },

        toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
