<template>
    <div class="view-defi-manage-collateral-confirmation">
        <tx-confirmation
            v-if="params.currCollateral !== params.collateral"
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
            <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> Collateral - Confirmation</h1>

            <div class="info">
                <div v-if="increasedCollateral > 0">
                    You’re adding <span class="inc-desc-collateral">{{ increasedCollateral.toFixed(2) }} FTM</span> to
                    your collateral
                </div>
                <div v-else-if="decreasedCollateral > 0">
                    You’re removing
                    <span class="inc-desc-collateral">{{ decreasedCollateral.toFixed(2) }} FTM</span> from your
                    collateral
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
        <template v-else>Adjust collateral first, please.</template>
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

export default {
    name: 'DefiManageCollateralConfirmation',

    components: { FBackButton, LedgerConfirmationContent, TxConfirmation },

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

        increasedCollateral() {
            return this.params.currCollateral - this.params.collateral;
        },

        decreasedCollateral() {
            return this.params.collateral - this.params.currCollateral;
        },

        sendButtonLabel() {
            return this.params.collateral > 0 ? 'Rebalance now' : 'Add collateral';
        },

        passwordLabel() {
            return this.params.collateral > 0
                ? 'Please enter your wallet password to rebalance your collateral'
                : 'Please enter your wallet password to add your collateral';
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-manage-collateral-confirmation');

            return parentNode ? parentNode.route : '';
        },
    },

    created() {
        this.setTx();
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
                name: 'defi-manage-collateral-transaction-success-message',
                params: {
                    tx: _data.data.sendTransaction.hash,
                    successMessage: 'Successful',
                    continueTo: 'defi-manage-collateral',
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

<style lang="scss">
@import 'style';
</style>
