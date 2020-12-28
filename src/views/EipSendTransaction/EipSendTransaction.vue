<template>
    <div>
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="claim-rewards-confirmation"
            send-button-label="Confirm"
            password-label="Please enter your wallet password to confirm"
            :on-send-transaction-success="onSendTransactionSuccess"
        >
            <h2>EIP Send Transaction</h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send To</div>
                    <div class="col break-word">
                        {{ tx.to ? tx.to : '(new contract)' }}
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send From</div>
                    <div class="col break-word">
                        {{ tx.from }}
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Amount</div>
                    <div class="col">{{ amount }} FTM</div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Data</div>
                    <div class="col">{{ tx.data }}</div>
                </div>
            </div>
        </tx-confirmation>
    </div>
</template>

<script>
/* global chrome */
import TxConfirmation from '@/components/TxConfirmation/TxConfirmation';
import { mapGetters } from 'vuex';
import { SET_ACTIVE_ACCOUNT_BY_ADDRESS } from '@/store/mutations.type';
import { Web3 } from '@/plugins/fantom-web3-wallet';

export default {
    name: 'EipSendTransaction',

    components: { TxConfirmation },

    data() {
        return {
            tx: {},
            gasLimit: '',
        };
    },

    computed: {
        ...mapGetters(['currentAccount', 'accounts']),
        amount() {
            return this.tx.value ? Web3.utils.fromWei(this.tx.value) : '';
        },
    },

    created() {
        chrome.runtime.sendMessage({ method: 'wallet_sendTransaction_ready', id: this.$route.params.id }, this.init);
    },

    methods: {
        async init(request) {
            let payload = request.params[0];
            if (payload.from && (!this.currentAccount || payload.from !== this.currentAccount.address)) {
                this.$store.commit(SET_ACTIVE_ACCOUNT_BY_ADDRESS, payload.from);
            }
            if (payload.gasLimit) {
                this.gasLimit = payload.gasLimit;
            }
            this.tx = await this.$fWallet.getDefiTransactionToSign(payload, payload.from, this.gasLimit);
        },

        onSendTransactionSuccess(_data) {
            console.log('transaction sent', _data);
            chrome.runtime.sendMessage({
                method: 'wallet_sendTransaction_done',
                stid: this.$route.params.id, // send transaction id
                response: _data.data.sendTransaction.hash,
            });
            window.close();
        },
    },
};
</script>
