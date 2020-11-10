<template>
    <div class="defi-mint-sftm-confirmation">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            :card-off="isView"
            send-button-label="Submit"
            password-label="Please enter your wallet password to mint sFTM"
            :gas-limit="gasLimit"
            :on-send-transaction-success="onSendTransactionSuccess"
            @change-component="onChangeComponent"
        >
            <h1 v-if="isView" class="with-back-btn">
                <f-back-button :route-name="getBackButtonRoute(compName)" :params="$route.params" />
                Confirmation
            </h1>
            <h2 v-else class="cont-with-back-btn">
                <span>
                    Mint sFTM - Confirmation
                </span>
                <button type="button" class="btn light" @click="onBackBtnClick">Back</button>
            </h2>

            <div class="confirmation-info">You’re minting {{ dAmountDelegated }} sFTM</div>

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
import { GAS_LIMITS } from '@/plugins/fantom-web3-wallet.js';
import FMessage from '@/components/core/FMessage/FMessage.vue';
import { mapGetters } from 'vuex';
// import { viewHelpersMixin } from '@/mixins/view-helpers.js';
import { toKebabCase } from '@/utils';
import sfcUtils from 'fantom-ledgerjs/src/sfc-utils.js';
import Web3 from 'web3';

export default {
    name: 'DefiMintSFTMConfirmation',

    components: { FMessage, LedgerConfirmationContent, FBackButton, TxConfirmation },

    // mixins: [viewHelpersMixin],

    props: {
        /***/
        stakerId: {
            type: String,
            default: '',
        },
        /***/
        amountDelegated: {
            type: String,
            default: '',
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
            gasLimit: GAS_LIMITS.claimRewards,
            compName: toKebabCase(this.$options.name),
            dAmountDelegated: 0,
            d_stakerId: this.stakerId,
            d_amountDelegated: this.amountDelegated,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        hasCorrectParams() {
            return !!this.d_stakerId;
        },
    },

    created() {
        // this.setDataFromParams();

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

            await this.$defi.init();

            if (!this.$defi.contracts.StakeTokenizerContract) {
                return;
            }

            this.dAmountDelegated = this.$fWallet.WEIToFTM(this.d_amountDelegated);

            this.tx = await this.$fWallet.getDefiTransactionToSign(
                sfcUtils.sfcTokenizeLockedStake(
                    web3,
                    this.$defi.contracts.StakeTokenizerContract,
                    parseInt(this.d_stakerId, 16)
                ),
                this.currentAccount.address,
                GAS_LIMITS.defi
            );
        },

        onSendTransactionSuccess(_data) {
            if (!this.isView) {
                this.$emit('change-component', {
                    to: 'transaction-success-message',
                    from: this.compName,
                    data: {
                        tx: _data.data.sendTransaction.hash,
                        // successMessage: 'Undelegation Successful',
                        continueTo: 'staking-info',
                        continueToParams: {
                            stakerId: this.d_stakerId,
                        },
                    },
                });
            } else {
                const params = {
                    tx: _data.data.sendTransaction.hash,
                    title: 'Success',
                    continueTo: this.getBackButtonRoute(this.compName),
                    continueToParams: this.$route.params,
                };

                this.$router.replace({
                    name: `defi-mint-sftm-transaction-success-message`,
                    params,
                });
            }
        },

        onBackBtnClick() {
            this.$emit('change-component', {
                to: 'staking-info',
                from: this.compName,
                data: {
                    stakerId: this.d_stakerId,
                },
            });
        },

        /**
         * Re-target `'change-component'` event.
         *
         * @param {object} _data
         */
        onChangeComponent(_data) {
            let transactionRejectComp = `defi-mint-sftm-transaction-reject-message`;

            if (!this.isView) {
                this.$emit('change-component', _data);
            } else if (_data.to === 'transaction-reject-message') {
                this.$router.replace({
                    name: transactionRejectComp,
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
