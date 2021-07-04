<template>
    <div class="view-defi-fmint-claim-rewards-confirmation min-h-100">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            card-off
            send-button-label="Submit"
            password-label="Please enter your wallet password to claim rewards"
            :on-send-transaction-success="onSendTransactionSuccess"
            :show-cancel-button="true"
            :window-mode="!isView"
            class="min-h-100"
            @cancel-button-click="$emit('cancel-button-click', $event)"
        >
            <h1 v-if="isView" class="with-back-btn">
                <f-back-button :route-name="backButtonRoute" />
                Confirmation
            </h1>

            <div class="confirmation-info">
                You’re claiming estimated and stashed rewards.
                <!--
                <span class="inc-desc-collateral">
                    <f-token-value :token="params.token" :value="params.pendingRewards" no-currency />
                    {{ cTokenSymbol }}
                </span>
                -->
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
import { getAppParentNode } from '@/app-structure.js';
import FMessage from '@/components/core/FMessage/FMessage.vue';
import fMintUtils from 'fantom-ledgerjs/src/fmint-utils.js';
import { mapGetters } from 'vuex';

export default {
    name: 'DefiFMintClaimRewardsConfirmation',

    components: { FMessage, LedgerConfirmationContent, FBackButton, TxConfirmation },

    props: {
        /** */
        params: {
            type: Object,
            default() {
                return {};
            },
            required: true,
        },
        /** Identifies if component is view (has route). */
        isView: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            tx: {},
            compName: 'defi-fmint-claim-rewards',
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * @return {{pendingRewards: number, token: DefiToken}}
         */
        /*
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
        */

        hasCorrectParams() {
            return !!this.params.token;
        },

        backButtonRoute() {
            const parentNode = getAppParentNode(`${this.compName}-confirmation`);

            return parentNode ? parentNode.id : '';
        },

        cTokenSymbol() {
            return this.$defi.getTokenSymbol({ symbol: this.params.token.symbol });
        },
    },

    created() {
        if (!this.hasCorrectParams) {
            // redirect
            if (this.isView) {
                setTimeout(() => {
                    this.$router.replace({ name: this.backButtonRoute });
                }, 3000);
            }
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

            txToSign = fMintUtils.fMintClaimRewardTx(contractAddress);

            this.tx = await this.$fWallet.getDefiTransactionToSign(txToSign, this.currentAccount.address);
        },

        onSendTransactionSuccess(_data) {
            const params = {
                tx: _data.data.sendTransaction.hash,
                title: 'Success',
                continueTo: this.backButtonRoute,
            };
            const transactionSuccessComp = `${this.compName}-transaction-success-message`;

            if (this.isView) {
                this.$router.replace({
                    name: transactionSuccessComp,
                    params,
                });
            } else {
                params.continueTo = 'hide-window';
                params.continueButtonLabel = 'Close';

                this.$emit('change-component', {
                    to: transactionSuccessComp,
                    data: { ...params, cardOff: true, windowMode: true },
                });
            }
        },
    },
};
</script>
