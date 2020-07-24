<template>
    <div class="view-defi-mint-repay-confirmation">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            card-off
            no-previous-button
            :send-button-label="sendButtonLabel"
            :password-label="passwordLabel"
            :gas-limit="gasLimit"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h1 class="with-back-btn">
                <f-back-button :route-name="backButtonRoute" /> Confirmation
                <template v-if="params.steps">({{ params.step }}/{{ params.steps }})</template>
            </h1>

            <div class="info">
                <div v-if="increasedDebt > 0">
                    You’re adding <span class="inc-desc-collateral">{{ increasedDebt.toFixed(2) }} fUSD</span>
                </div>
                <div v-else-if="decreasedDebt > 0">
                    <template v-if="params.step === 1">You’re allowing</template>
                    <template v-else>You’re removing</template>
                    <span class="inc-desc-collateral"> {{ decreasedDebt.toFixed(2) }} fUSD</span>
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
import { GAS_LIMITS, Web3 } from '../../plugins/fantom-web3-wallet.js';
import { mapGetters } from 'vuex';
import { toFTM } from '../../utils/transactions.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import appConfig from '../../../app.config.js';
import defiUtils from 'fantom-ledgerjs/src/defi-utils.js';

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

        /**
         * @return {{debt: number, currDebt: number, address: string, steps: number, step: number}}
         */
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
            let label = '';

            if (this.params.step === 1) {
                label = 'Continue to the next step';
            } else if (this.increasedDebt > 0) {
                label = 'Mint now';
            } else {
                label = 'Repay now';
            }

            return label;
        },

        passwordLabel() {
            let label = '';

            if (this.params.step === 1) {
                label = 'Please enter your wallet password to allow your tokens';
            } else if (this.params.debt > 0) {
                label = 'Please enter your wallet password to rebalance your debt';
            } else {
                label = 'Please enter your wallet password to add your debt';
            }

            return label;
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-mint-repay-confirmation');

            return parentNode ? parentNode.route : '';
        },
    },

    created() {
        if (!this.hasCorrectParams) {
            // redirect to <defi-mint-repay>
            setTimeout(() => {
                this.$router.replace({ name: 'defi-mint-repay' });
            }, 3000);
        } else {
            this.setTx();
        }
    },

    methods: {
        async setTx() {
            /** @type {DefiToken} */
            const token = await this.$defi.fetchTokens(this.currentAccount.address, 'FUSD');
            const contractAddress = appConfig.liquidityPoolContract;
            let txToSign;

            if (!token) {
                return;
            }

            if (this.increasedDebt > 0) {
                txToSign = defiUtils.defiBorrowTokenTx(
                    contractAddress,
                    token.address,
                    Web3.utils.toHex(Web3.utils.toWei(this.increasedDebt.toString()))
                );
            } else if (this.params.step === 1) {
                txToSign = defiUtils.erc20ApproveAmountTx(
                    token.address,
                    contractAddress,
                    Web3.utils.toHex(Web3.utils.toWei(this.decreasedDebt.toString()))
                );
            } else {
                txToSign = defiUtils.defiRepayTokenTx(
                    contractAddress,
                    token.address,
                    Web3.utils.toHex(Web3.utils.toWei(this.decreasedDebt.toString()))
                    // parseInt(this.decreasedDebt * Math.pow(10, token.decimals))
                );
            }

            this.tx = await this.$fWallet.getDefiTransactionToSign(
                txToSign,
                this.currentAccount.address,
                GAS_LIMITS.defi
            );
        },

        onSendTransactionSuccess(_data) {
            const params = {
                tx: _data.data.sendTransaction.hash,
                title: 'Success',
                continueTo: 'defi-mint-repay',
            };

            if (this.params.step === 1) {
                params.continueTo = 'defi-mint-repay-confirmation2';
                params.continueToParams = { ...this.params, step: 2 };
                params.autoContinueToAfter = 2000;
            }

            this.$router.replace({
                name: 'defi-mint-repay-transaction-success-message',
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
