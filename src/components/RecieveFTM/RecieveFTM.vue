<template>
    <div class="verify-ledger-address">
        <f-card class="f-card-double-padding">
            <h2>Receive Opera FTM</h2>

            <h3 class="address break-word h2">
                {{ currentAccount.address }}
            </h3>

            <vue-q-r-code-component :text="currentAccount.address" class="qr-code" />

            <div class="button-footer">
                <button
                    v-show="currentAccount.isLedgerAccount"
                    class="btn large"
                    :disabled="btnDisabled"
                    @click="onVerifyBtnClick"
                >
                    Verify Address on Ledger
                </button>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import VueQRCodeComponent from 'vue-qrcode-component';
import { mapGetters } from 'vuex';

export default {
    name: 'RecieveFTM',

    components: { FCard, VueQRCodeComponent },

    data() {
        return {
            btnDisabled: false,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    methods: {
        onVerifyBtnClick() {
            // this.btnDisabled = true;
            alert('not implemented yet');
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
