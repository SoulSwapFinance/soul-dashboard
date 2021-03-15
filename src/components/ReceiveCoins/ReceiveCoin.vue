<template>
    <div class="receive-coin">
        <div class="align-center">
            Send your {{ $bnb.getFTMCurrencyByDirection(direction) }} to:

            <template v-if="address">
                <h3 class="address break-word h2">
                    {{ address }} &nbsp;
                    <f-copy-button
                        :text="address"
                        tooltip="Copy address to clipboard"
                        popover-text="Address copied to clipboard"
                        class="btn large light same-size round"
                    />
                    <button class="btn large light same-size round" title="Show QR Code" @click="$refs.qrWindow.show()">
                        <icon data="@/assets/svg/monochrome/Options/QR.svg" width="20" height="20" aria-hidden="true" />
                    </button>
                </h3>

                and then click 'Confirm Deposit' below

                <br /><br />
                <f-message type="warning" class="align-center">
                    All bridge transactions incur a fee of {{ minFTMToTransfer }} FTM, deducted from the transfer
                    amount.
                </f-message>

                <div class="form-buttons">
                    <pulse-loader v-if="loading" color="#1969ff"></pulse-loader>
                    <template v-else>
                        <f-message v-if="error" type="info" with-icon>{{ error }}</f-message>
                        <button class="btn large btn-next" @click="onNextBtnClick">Confirm Deposit</button>
                    </template>
                </div>

                <q-r-code-window ref="qrWindow" :address="address" />
            </template>
            <template v-else-if="error">
                <f-message type="info" with-icon>{{ error }}</f-message>
            </template>
            <template v-else>
                <br /><br />
                <pulse-loader color="#1969ff"></pulse-loader>
            </template>
        </div>
    </div>
</template>

<script>
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { mapGetters } from 'vuex';
import FMessage from '../core/FMessage/FMessage.vue';
import QRCodeWindow from '../windows/QRCodeWindow/QRCodeWindow.vue';
import appConfig from '../../../app.config.js';

export default {
    name: 'ReceiveCoin',

    components: { QRCodeWindow, FMessage, FCopyButton, PulseLoader },

    props: {
        /**
         * Type of coin to receive.
         *
         * @type {('BNB' | 'ETH')}
         */
        coin: {
            type: String,
            default: 'BNB',
            validator: function (_value) {
                return ['BNB', 'ETH'].indexOf(_value) !== -1;
            },
        },
    },

    data() {
        return {
            address: '',
            error: '',
            loading: false,
            stData: {},
            minFTMToTransfer: appConfig.bnbridgeApi.minFTMToTransfer,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        direction() {
            if (this.coin === 'BNB') {
                return 'BinanceToOpera';
            } else {
                return 'EthereumToOpera';
            }
        },
    },

    mounted() {
        this.setAddress();
    },

    methods: {
        async setAddress() {
            try {
                const { direction } = this;

                this.stData = await this.$bnb.swapToken({
                    direction,
                    operaAddress: this.currentAccount.address,
                });

                this.stData.direction = direction;

                this.address = this.stData[this.$bnb.getAddressKeyByDirection(direction)];
            } catch (_error) {
                this.error = _error.message || _error;
            }
        },

        async onNextBtnClick() {
            this.error = '';

            try {
                if (this.stData.uuid) {
                    this.loading = true;
                    const data = await this.$bnb.finalizeSwapToken(this.stData);

                    this.$emit('change-component', {
                        to: 'transaction-completing',
                        from: 'receive-coin',
                        data: {
                            // tx: _data.data.sendTransaction.hash,
                            ...data,
                            ...this.stData,
                        },
                    });

                    this.loading = false;
                }
            } catch (_error) {
                this.loading = false;
                this.error = _error.message || _error;
            }
        },
    },
};
</script>
