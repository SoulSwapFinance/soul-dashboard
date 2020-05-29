<template>
    <div class="transaction-confirmation">
        <f-card class="f-card-double-padding f-data-layout">
            <h2>
                Send Opera FTM - Confirmation <span class="f-steps"><b>3</b> / 3</span>
            </h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send To</div>
                    <div class="col break-word">
                        {{ sendToAddress }}
                        <span v-show="sendToAddressBalance" class="f-row-label">
                            <template v-if="sendToAddressBalance"> ( {{ sendToAddressBalance }} FTM ) </template>
                        </span>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send From</div>
                    <div class="col break-word">
                        {{ currentAccount.address }}
                        <span class="f-row-label">
                            ( {{ toFTM(currentAccount.balance) }} FTM
                            <template v-if="currentAccount.name">, {{ currentAccount.name }}</template> )
                        </span>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Amount</div>
                    <div class="col">{{ txData.amount }}</div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Memo</div>
                    <div class="col">{{ txData.memo }}</div>
                </div>

                <!--
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Fee</div>
                    <div class="col">{{ txData.fee }}</div>
                </div>
                -->
            </div>

            <ledger-message :error="error" @ledger-status-code="onLedgerStatusCode" />

            <check-password-form
                :error-message="errorMsg"
                :show-password-field="!currentAccount.isLedgerAccount"
                @f-form-submit="onFFormSubmit"
                @go-back="onGoBack"
            />

            <f-window
                v-if="currentAccount.isLedgerAccount"
                ref="confirmationWindow"
                modal
                title="Transaction Confirmation"
                style="max-width: 800px;"
                animation-in="scale-center-enter-active"
                animation-out="scale-center-leave-active"
            >
                <!--                <icon data="@/assets/svg/nano-s-confirm-tx.svg" width="300" height="91" />-->
                <div class="align-center">
                    <img src="img/nano-s-confirm-tx.png" alt="fantom nano device" /><br /><br />
                </div>

                <p class="align-center">Please confirm this transaction on your Ledger device:</p>

                <ol class="f-data-layout">
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Send To</div>
                            <div class="col break-word">
                                {{ txData.opera_address }}
                                <span v-show="sendToAddressBalance" class="f-row-label">
                                    <template v-if="sendToAddressBalance">
                                        ( {{ toFTM(sendToAddressBalance.balance) }} FTM )
                                    </template>
                                </span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Send From</div>
                            <div class="col break-word">
                                {{ currentAccount.address }}
                                <span class="f-row-label">
                                    ( {{ toFTM(currentAccount.balance) }} FTM
                                    <template v-if="currentAccount.name">, {{ currentAccount.name }}</template> )
                                </span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Amount</div>
                            <div class="col">{{ txData.amount }}</div>
                        </div>
                    </li>
                    <li>
                        <div class="row no-collapse">
                            <div class="col-3 f-row-label">Max Fee</div>
                            <div class="col">{{ txData.fee }}</div>
                        </div>
                    </li>
                </ol>
            </f-window>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import gql from 'graphql-tag';
import CheckPasswordForm from '../forms/TransactionConfirmationForm.vue';
import { mapGetters } from 'vuex';
import { UPDATE_ACCOUNT_BALANCE } from '../../store/actions.type.js';
import { findFirstFocusableDescendant } from '../../utils/aria.js';
import { Web3 } from '../../plugins/fantom-web3-wallet.js';
import LedgerMessage from '../LedgerMessage/LedgerMessage.vue';
import { U2FStatus } from '../../plugins/fantom-nano.js';
import FWindow from '../core/FWindow/FWindow.vue';
import { toFTM } from '../../utils/transactions.js';
import { formatNumberByLocale } from '../../filters.js';

export default {
    components: { FWindow, LedgerMessage, CheckPasswordForm, FCard },

    props: {
        // transaction data from SendTransactionForm
        txData: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    data() {
        return {
            errorMsg: '',
            error: null,
            sendToAddress: '',
        };
    },

    computed: {
        ...mapGetters(['currentAccount', 'sendDirection']),
    },

    asyncComputed: {
        async sendToAddressBalance() {
            const { sendDirection } = this;
            let balance = 0;
            let data;

            if (sendDirection === 'OperaToOpera') {
                data = await this.$fWallet.getBalance(this.txData.opera_address);
                balance = this.toFTM(data.balance);
            } else if (sendDirection === 'OperaToBinance') {
                data = await this.$bnb.getBNBBalances(this.txData.bnb_address);
                balance = `BNB address: ${this.txData.bnb_address}, ${formatNumberByLocale(data.balance)}`;
            } else if (sendDirection === 'OperaToEthereum') {
                data = await this.$bnb.getETHBalance(this.txData.eth_address);
                balance = `ETH address: ${this.txData.eth_address}, ${formatNumberByLocale(data)}`;
            }

            return balance;
        },
    },

    created() {
        /** Data for token swap. */
        this._swapTokenData = null;
    },

    mounted() {
        if (!this.currentAccount.isLedgerAccount) {
            const el = findFirstFocusableDescendant(this.$el);
            if (el) {
                el.focus();
            }
        }
    },

    /**
     * Called when component is activated through `keep-alive`.
     */
    activated() {
        this.setSendToAddress();
    },

    methods: {
        async setSendToAddress() {
            const { sendDirection } = this;
            let data;
            let stData = null;

            if (sendDirection === 'OperaToOpera') {
                this.sendToAddress = this.txData.opera_address;
            } else if (sendDirection === 'OperaToBinance') {
                stData = {
                    direction: sendDirection,
                    bnbAddress: this.txData.bnb_address,
                };
            } else if (sendDirection === 'OperaToEthereum') {
                stData = {
                    direction: sendDirection,
                    ethAddress: this.txData.eth_address,
                };
            }

            if (stData) {
                data = await this.$bnb.swapToken(stData);

                this._swapTokenData = {
                    from_opera_address: this.currentAccount.address,
                    ...this.txData,
                    ...data,
                };
                this.sendToAddress = data.opera_address;
                this.txData.opera_address = data.opera_address;

                console.log('_swapTokenData', this._swapTokenData);
            }
        },

        sendTransaction(_rawTransaction) {
            this.$apollo
                .mutate({
                    mutation: gql`
                        mutation($tx: Bytes!) {
                            sendTransaction(tx: $tx) {
                                hash
                                from
                                to
                            }
                        }
                    `,
                    variables: {
                        tx: _rawTransaction,
                    },
                })
                .then((_data) => {
                    if (this._swapTokenData) {
                        this.$emit('change-component', {
                            to: 'transaction-completing',
                            from: 'transaction-confirmation',
                            data: {
                                tx: _data.data.sendTransaction.hash,
                                ...this._swapTokenData,
                            },
                        });
                    } else {
                        this.$emit('change-component', {
                            to: 'transaction-success-message',
                            from: 'transaction-confirmation',
                            data: {
                                tx: _data.data.sendTransaction.hash,
                            },
                        });
                    }
                })
                .catch((_error) => {
                    this.errorMsg = _error;
                });
        },

        async onFFormSubmit(_event) {
            const { currentAccount } = this;
            const from = currentAccount ? currentAccount.address : '';
            const fWallet = this.$fWallet;
            const { txData } = this;
            const pwd = _event.detail.data.pwd;
            let rawTx = null;

            if (currentAccount && this.sendToAddress) {
                // transaction to sign
                const tx = await fWallet.getTransactionToSign({
                    value: Web3.utils.toHex(Web3.utils.toWei(txData.amount)),
                    from,
                    to: fWallet.toChecksumAddress(txData.opera_address),
                    memo: txData.memo,
                });

                console.log('tx', tx);

                if (currentAccount.keystore) {
                    delete tx.gasLimit;

                    if (pwd) {
                        try {
                            rawTx = await fWallet.signTransaction(tx, currentAccount.keystore, pwd);
                        } catch (_error) {
                            console.error(_error);
                            this.errorMsg = _error.toString();
                            // this.errorMsg = 'Invalid password';
                        }
                    }
                } else {
                    delete tx.gas;

                    try {
                        console.log(currentAccount);
                        this.$refs.confirmationWindow.show();

                        rawTx = await this.$fNano.signTransaction(
                            tx,
                            currentAccount.accountId,
                            currentAccount.addressId
                        );

                        this.$refs.confirmationWindow.hide('fade-leave-active');
                    } catch (_error) {
                        this.error = _error;
                        this.$refs.confirmationWindow.hide();
                        // this.errorMsg = _error.toString();
                    }
                }

                if (rawTx) {
                    console.log('rawTx', rawTx);
                    this.sendTransaction(rawTx);

                    setTimeout(() => {
                        this.$store.dispatch(UPDATE_ACCOUNT_BALANCE);
                    }, 3000);
                }
            }
        },

        onGoBack() {
            this.$emit('change-component', {
                from: 'transaction-confirmation',
                to: 'send-transaction-form',
            });
        },

        /**
         * Triggered on 'ledger-status-code' event.
         *
         * @param {string} _code
         */
        onLedgerStatusCode(_code) {
            if (_code === U2FStatus.USER_REJECTED_REQUESTED_ACTION) {
                this.$emit('change-component', {
                    from: 'transaction-confirmation',
                    to: 'transaction-reject-message',
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
