<template>
    <div class="defi-deposit-confirmation min-h-100">
        <tx-confirmation
            v-if="hasCorrectParams"
            :tx="tx"
            card-off
            :send-button-label="sendButtonLabel"
            :password-label="passwordLabel"
            :on-send-transaction-success="onSendTransactionSuccess"
            :set-tmp-pwd="params.step === 1"
            :tmp-pwd-code="tmpPwdCode"
            :show-cancel-button="true"
            :window-mode="!isView"
            class="min-h-100"
            @cancel-button-click="$emit('cancel-button-click', $event)"
        >
            <h1 v-if="isView" class="with-back-btn">
                <f-back-button
                    v-if="!params.steps || params.step === 1"
                    :route-name="backButtonRoute"
                    :params="{ token }"
                />
                Confirmation
                <template v-if="params.steps">({{ params.step }}/{{ params.steps }})</template>
            </h1>

            <div class="confirmation-info">
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
                <ledger-confirmation-content :to="tx.to" :amount="0" :max-fee="tx._fee" />
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
import { Web3 } from '../../plugins/fantom-web3-wallet.js';
import { mapGetters } from 'vuex';
import fMintUtils from 'fantom-ledgerjs/src/fmint-utils.js';
import erc20Utils from 'fantom-ledgerjs/src/erc20-utils.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import appConfig from '../../../app.config.js';
import { getUniqueId } from '@/utils';

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
        /** Identifies if component is view (has route). */
        isView: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            tx: {},
            tmpPwdCode: '',
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

            label = 'Submit';
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

            return parentNode ? parentNode.id : '';
        },

        cTokenSymbol() {
            return this.$defi.getTokenSymbol({ symbol: this.token.symbol });
        },
    },

    created() {
        if (!this.hasCorrectParams) {
            // redirect to <defi-deposit>
            if (this.isView) {
                setTimeout(() => {
                    this.$router.replace({ name: this.compName });
                }, 3000);
            }
        } else {
            this.setTx();
        }
    },

    methods: {
        async setTx() {
            const { token } = this;
            const { params } = this;
            let { contractAddress } = this;
            let txToSign;

            if (!token) {
                return;
            }

            const withdrawMax = this.params.collateral - this.decreasedCollateral < 0.000001;

            this.tmpPwdCode = params.tmpPwdCode || getUniqueId();

            if (!contractAddress) {
                contractAddress = this.$defi.contracts.fMint;
            }

            if (this.params.step === 1) {
                txToSign = erc20Utils.erc20IncreaseAllowanceTx(
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
                txToSign = fMintUtils.fMintDepositTokenTx(
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
                txToSign = fMintUtils.fMintWithdrawTokenTx(
                    contractAddress,
                    token.address,
                    withdrawMax
                        ? params.collateralHex
                        : this.correctAmount(
                              Web3.utils.toHex(
                                  this.$defi.shiftDecPointRight(this.decreasedCollateral.toString(), token.decimals)
                              ),
                              true
                          )
                );
            }

            this.tx = await this.$fWallet.getDefiTransactionToSign(txToSign, this.currentAccount.address);
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
                params.continueToParams = { ...this.params, isView: this.isView, step: 2, tmpPwdCode: this.tmpPwdCode };
                params.autoContinueToAfter = appConfig.settings.autoContinueToAfter;
                params.continueButtonLabel = 'Next Step';
                params.title = `${this.params.step}/${this.params.steps}  ${params.title}`;
            } else if (this.params.step === 2) {
                transactionSuccessComp = `${this.compName}-transaction-success-message2`;
                params.continueToParams = { token: { ...this.token } };
            }

            if (this.isView) {
                this.$router.replace({
                    name: transactionSuccessComp,
                    params,
                });
            } else {
                if (this.params.step === 1) {
                    params.continueToParams = {
                        params: { ...params.continueToParams },
                        token: { ...this.token },
                        compName: this.compName,
                    };
                    params.title = `Success`;
                } else if (this.params.step === 2) {
                    params.continueTo = 'hide-window';
                    params.continueButtonLabel = 'Close';
                }

                this.$emit('change-component', {
                    to: transactionSuccessComp,
                    data: { ...params, cardOff: true, windowMode: true },
                });
            }
        },

        // toFTM,
    },
};
</script>
