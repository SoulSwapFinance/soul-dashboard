<template>
    <div class="unstake-confirmation">
        <f-card class="f-card-double-padding f-data-layout">
            <h2>
                Undelegate FTM - Confirmation <span class="f-steps"><b>2</b> / 2</span>
            </h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Validator</div>
                    <div class="col break-word">
                        {{ accountInfo.stakerInfo.stakerInfo.name }}, {{ parseInt(accountInfo.stakerInfo.id) }}
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">From</div>
                    <div class="col break-word">
                        {{ currentAccount.address }}
                        <span class="f-row-label">( {{ toFTM(currentAccount.balance) }} FTM )</span>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Undelegate Amount</div>
                    <div class="col break-word">{{ toFTM(accountInfo.delegation.amount) }}</div>
                </div>
            </div>

            <ledger-message :error="error" @ledger-status-code="onLedgerStatusCode" />

            <transaction-confirmation-form
                :error-message="errorMsg"
                :show-password-field="!currentAccount.isLedgerAccount"
                password-label="Please enter your wallet password to undelegate your FTM"
                send-button-label="Undelegate"
                @f-form-submit="onFFormSubmit"
                @go-back="onGoBack"
            />
        </f-card>

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
            <div class="align-center"><img src="img/nano-s-confirm-tx.png" alt="fantom nano device" /><br /><br /></div>

            <p class="align-center">Please confirm this transaction on your Ledger device:</p>

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
        </f-window>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import LedgerMessage from '../LedgerMessage/LedgerMessage.vue';
import TransactionConfirmationForm from '../forms/TransactionConfirmationForm.vue';
import gql from 'graphql-tag';
import { UPDATE_ACCOUNT_BALANCE } from '../../store/actions.type.js';
import { U2FStatus } from '../../plugins/fantom-nano.js';
import { toFTM } from '../../utils/transactions.js';
import { mapGetters } from 'vuex';
import FWindow from '../core/FWindow/FWindow.vue';
import sfcUtils from 'fantom-ledgerjs/src/sfc-utils.js';

export default {
    name: 'UnstakeConfirmation',

    components: { FWindow, TransactionConfirmationForm, LedgerMessage, FCard },

    props: {
        /** `accountInfo` object from `UnstakeFTM` component. */
        accountInfo: {
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
            tx: {},
            // tmp
            stakeData: {},
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    methods: {
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
                    this.$emit('change-component', {
                        to: 'transaction-success-message',
                        from: 'unstake-confirmation',
                        data: {
                            tx: _data.data.sendTransaction.hash,
                            successMessage: 'Undelegation Successful',
                        },
                    });
                })
                .catch((_error) => {
                    this.errorMsg = _error;
                });
        },

        async onFFormSubmit(_event) {
            const { currentAccount } = this;
            const fWallet = this.$fWallet;
            const pwd = _event.detail.data.pwd;
            let rawTx = null;

            const tx = await this.$fWallet.getSFCTransactionToSign(
                sfcUtils.prepareToWithdrawDelegationTx(),
                this.currentAccount.address,
                '0x30D40'
            );

            this.tx = tx;

            if (currentAccount && tx) {
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
                        this.$refs.confirmationWindow.show();

                        rawTx = await this.$fNano.signTransaction(
                            tx,
                            currentAccount.accountId,
                            currentAccount.addressId
                        );

                        this.$refs.confirmationWindow.hide('scale-center-forward-leave-active');
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
                to: 'unstake-f-t-m',
                from: 'unstake-confirmation',
                data: {
                    accountInfo: this.accountInfo,
                },
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
                    to: 'transaction-reject-message',
                    from: 'unstake-confirmation',
                });
            }
        },

        toFTM,
    },
};
</script>
