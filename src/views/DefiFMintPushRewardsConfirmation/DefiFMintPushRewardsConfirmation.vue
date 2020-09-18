<template>
    <div class="view-defi-fmint-push-rewards-confirmation">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            card-off
            send-button-label="Submit"
            password-label="Please enter your wallet password"
            :gas-limit="gasLimit"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h1 class="with-back-btn">
                <f-back-button :route-name="backButtonRoute" />
                Confirmation
            </h1>

            <div class="confirmation-info">
                You’re pushing rewards to distribution.
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
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
import { getAppParentNode } from '@/app-structure.js';
import { GAS_LIMITS } from '@/plugins/fantom-web3-wallet.js';
import FMessage from '@/components/core/FMessage/FMessage.vue';
import fMintUtils from 'fantom-ledgerjs/src/fmint-utils.js';
import { mapGetters } from 'vuex';

export default {
    name: 'DefiFMintPushRewardsConfirmation',

    components: { FMessage, LedgerConfirmationContent, FBackButton, TxConfirmation },

    data() {
        return {
            tx: {},
            gasLimit: GAS_LIMITS.pushRewards,
            compName: 'defi-fmint-push-rewards',
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * @return {{token: DefiToken}}
         */
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },

        hasCorrectParams() {
            return !!this.params.token;
        },

        backButtonRoute() {
            const parentNode = getAppParentNode(`${this.compName}-confirmation`);

            return parentNode ? parentNode.route : '';
        },
    },

    created() {
        if (!this.hasCorrectParams) {
            // redirect
            setTimeout(() => {
                this.$router.replace({ name: this.backButtonRoute });
            }, 3000);
        } else {
            this.setTx();
        }
    },

    methods: {
        async setTx() {
            const { token } = this.params;
            const contractAddress = this.$defi.contracts.fMintReward;
            let txToSign;

            if (!token) {
                return;
            }

            txToSign = fMintUtils.fMintPushRewardTx(contractAddress);

            this.tx = await this.$fWallet.getDefiTransactionToSign(
                txToSign,
                this.currentAccount.address,
                this.gasLimit
            );
        },

        onSendTransactionSuccess(_data) {
            const params = {
                tx: _data.data.sendTransaction.hash,
                title: 'Success',
                continueTo: this.backButtonRoute,
            };

            this.$router.replace({
                name: `${this.compName}-transaction-success-message`,
                params,
            });
        },

        /**
         * Re-target `'change-component'` event.
         *
         * @param {object} _data
         */
        onChangeComponent(_data) {
            let transactionRejectComp = `${this.compName}-transaction-reject-message`;

            if (_data.to === 'transaction-reject-message') {
                this.$router.replace({
                    name: transactionRejectComp,
                    params: {
                        continueTo: this.backButtonRoute,
                        // continueToParams: { token: { ...this.token } },
                    },
                });
            }
        },
    },
};
</script>
