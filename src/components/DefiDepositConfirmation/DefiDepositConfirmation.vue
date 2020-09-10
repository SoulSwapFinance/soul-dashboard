<template>
    <div class="defi-deposit-confirmation">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            card-off
            :send-button-label="sendButtonLabel"
            :password-label="passwordLabel"
            :gas-limit="gasLimit"
            :on-send-transaction-success="onSendTransactionSuccess"
            :set-tmp-pwd="params.step === 1"
            @change-component="onChangeComponent"
        >
            <h1 class="with-back-btn">
                <f-back-button
                    v-if="!params.steps || params.step === 1"
                    :route-name="backButtonRoute"
                    :params="{ token }"
                />
                Confirmation
                <template v-if="params.steps">({{ params.step }}/{{ params.steps }})</template>
            </h1>

            <div class="info">
                <template v-if="params.step === 1">
                    You’re allowing
                    <span v-if="increasedCollateral > 0" class="inc-desc-collateral">
                        <f-token-value :token="token" :value="increasedCollateral" no-currency /> {{ cTokenSymbol }}
                    </span>
                    <span v-else class="inc-desc-collateral">
                        <f-token-value :token="token" :value="decreasedCollateral" no-currency /> {{ cTokenSymbol }}
                    </span>
                </template>
                <div v-else-if="increasedCollateral > 0">
                    You’re adding
                    <span class="inc-desc-collateral">
                        <f-token-value :token="token" :value="increasedCollateral" no-currency /> {{ cTokenSymbol }}
                    </span>
                    to your collateral
                </div>
                <div v-else-if="decreasedCollateral > 0">
                    You’re removing
                    <span class="inc-desc-collateral">
                        <f-token-value :token="token" :value="decreasedCollateral" no-currency /> {{ cTokenSymbol }}
                    </span>
                    from your collateral
                </div>
            </div>

            <template #window-content>
                <ledger-confirmation-content :to="tx.to" :amount="0" />
            </template>
        </tx-confirmation>
        <template v-else>
            <f-message type="info" role="alert" class="big">
                Adjust collateral first, please.
            </f-message>
        </template>
    </div>
</template>

<script>
import TxConfirmation from '../../components/TxConfirmation/TxConfirmation.vue';
import LedgerConfirmationContent from '../../components/LedgerConfirmationContent/LedgerConfirmationContent.vue';
import { GAS_LIMITS, Web3 } from '../../plugins/fantom-web3-wallet.js';
import { mapGetters } from 'vuex';
import defiUtils from 'fantom-ledgerjs/src/defi-utils.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';

/**
 * Common component for DefiDepositFTMConfirmation a DefiManageDepositConfirmation
 */
export default {
    name: 'DefiDepositConfirmation',

    components: { FTokenValue, FMessage, FBackButton, LedgerConfirmationContent, TxConfirmation },

    props: {
        /** Address of smart contract. */
        contractAddress: {
            type: String,
            default: '',
        },
        /**  */
        compName: {
            type: String,
            default: 'defi-manage-collateral',
        },
        /** @type {DefiToken} */
        token: {
            type: Object,
            default() {
                return {};
            },
        },
        /**
         * Router params.
         *
         * @type {{collateral: number, currCollateral: number, address: string}}
         */
        params: {
            type: Object,
            default() {
                return {};
            },
            required: true,
        },
    },

    data() {
        return {
            tx: {},
            gasLimit: GAS_LIMITS.default,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        hasCorrectParams() {
            return this.params.currCollateral !== this.params.collateral;
        },

        increasedCollateral() {
            return this.params.currCollateral - this.params.collateral;
        },

        decreasedCollateral() {
            return this.params.collateral - this.params.currCollateral;
        },

        sendButtonLabel() {
            let label = '';

            if (this.params.step === 1) {
                label = 'Continue to the next step';
            } else {
                label = 'Submit';
            }
            /*
            else if (this.params.collateral > 0) {
                label = 'Rebalance now';
            } else {
                label = 'Add collateral';
            }
            */

            return label;
        },

        passwordLabel() {
            let label = '';

            if (this.params.step === 1) {
                label = 'Please enter your wallet password to allow your tokens';
            } else if (this.params.collateral > 0) {
                label = 'Please enter your wallet password to rebalance your collateral';
            } else {
                label = 'Please enter your wallet password to add your collateral';
            }

            return label;
        },

        backButtonRoute() {
            const parentNode = getAppParentNode(`${this.compName}-confirmation`);

            return parentNode ? parentNode.route : '';
        },

        cTokenSymbol() {
            return this.$defi.getTokenSymbol({ symbol: this.token.symbol });
        },
    },

    created() {
        if (!this.hasCorrectParams) {
            // redirect to <defi-deposit>
            setTimeout(() => {
                this.$router.replace({ name: this.compName });
            }, 3000);
        } else {
            this.setTx();
        }
    },

    methods: {
        async setTx() {
            const { token } = this;
            let { contractAddress } = this;
            let txToSign;

            if (!token) {
                return;
            }

            if (!contractAddress) {
                contractAddress = this.$defi.contracts.fMint;
            }

            if (this.params.step === 1) {
                txToSign = defiUtils.erc20ApproveAmountTx(
                    token.address,
                    contractAddress,
                    this.correctAmount(
                        Web3.utils.toHex(
                            this.$defi.shiftDecPointRight(
                                Math.abs(this.increasedCollateral * 1.05).toString(),
                                token.decimals
                            )
                        ),
                        this.decreasedCollateral > 0
                    )
                );
            } else if (this.increasedCollateral > 0) {
                txToSign = defiUtils.defiDepositTokenTx(
                    contractAddress,
                    token.address,
                    this.correctAmount(
                        Web3.utils.toHex(
                            this.$defi.shiftDecPointRight(this.increasedCollateral.toString(), token.decimals)
                        ),
                        false
                    )
                );
            } else {
                txToSign = defiUtils.defiWithdrawDepositedTokenTx(
                    contractAddress,
                    token.address,
                    this.correctAmount(
                        Web3.utils.toHex(
                            this.$defi.shiftDecPointRight(this.decreasedCollateral.toString(), token.decimals)
                        ),
                        true
                    )
                );
            }

            this.tx = await this.$fWallet.getDefiTransactionToSign(
                txToSign,
                this.currentAccount.address,
                GAS_LIMITS.defi
            );
        },

        correctAmount(_amount, _withdrawDeposit) {
            const { params } = this;

            if (_withdrawDeposit) {
                if (params.collateralHex && this.$defi.compareBN(_amount, params.collateralHex) === 1) {
                    return params.collateralHex;
                }
            } else {
                if (this.$defi.compareBN(_amount, this.token.availableBalance) === 1) {
                    return this.token.availableBalance;
                }
            }

            return _amount;
        },

        onSendTransactionSuccess(_data) {
            const params = {
                tx: _data.data.sendTransaction.hash,
                title: 'Success',
                continueTo: this.compName,
            };
            let transactionSuccessComp = `${this.compName}-transaction-success-message`;

            if (this.params.step === 1) {
                params.continueTo = `${this.compName}-confirmation2`;
                params.continueToParams = { ...this.params, step: 2 };
                params.autoContinueToAfter = 2000;
            } else if (this.params.step === 2) {
                transactionSuccessComp = `${this.compName}-transaction-success-message2`;
                params.continueToParams = { token: { ...this.token } };
            }

            this.$router.replace({
                name: transactionSuccessComp,
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
                if (this.params.step === 2) {
                    transactionRejectComp = `${this.compName}-transaction-reject-message2`;
                }

                this.$router.replace({
                    name: transactionRejectComp,
                    params: {
                        continueTo: this.compName,
                        continueToParams: { token: { ...this.token } },
                    },
                });
            }
        },

        // toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
