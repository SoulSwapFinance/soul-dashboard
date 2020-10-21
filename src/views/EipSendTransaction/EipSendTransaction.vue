<template>
    <div>
        <tx-confirmation
            :tx="tx"
            confirmation-comp-name="claim-rewards-confirmation"
            send-button-label="Confirm"
            password-label="Please enter your wallet password to confirm"
            :gas-limit="gasLimit"
            :on-send-transaction-success="onSendTransactionSuccess"
        >
            <h2>EIP Send Transaction</h2>

            <div class="transaction-info">
                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send From</div>
                    <div class="col break-word">
                        {{ tx.from }}
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Send To</div>
                    <div class="col break-word">
                        {{ tx.to ? tx.to : '(new contract)' }}
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-3 f-row-label">Amount</div>
                    <div class="col">{{ tx.value }}</div>
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
import { GAS_LIMITS } from '@/plugins/fantom-web3-wallet';
import { mapGetters } from 'vuex';

export default {
    name: 'EipSendTransaction',

    components: { TxConfirmation },

    data() {
        return {
            tx: {},
            gasLimit: GAS_LIMITS.defi,
        };
    },

    computed: {
        ...mapGetters(['currentAccount', 'accounts']),
    },

    created() {
        chrome.runtime.sendMessage({ method: 'wallet_sendTransaction_ready', id: this.$route.params.id }, this.init);
    },

    methods: {
        async init(request) {
            let payload = request.params[0];
            if (!payload.from && this.currentAccount) {
                payload.from = this.currentAccount.address;
            }
            if (!payload.from && this.accounts) {
                payload.from = this.accounts[0];
            }
            if (!payload.from) {
                throw 'No active account to send transaction from!';
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
                id: this.$route.params.id,
                response: { result: _data.data.sendTransaction.hash },
            });
            alert('success');
            //window.close();
        },
    },
};
</script>
