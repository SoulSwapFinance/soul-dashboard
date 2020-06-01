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
                </h3>

                <vue-q-r-code-component :text="address" class="qr-code" />

                <div class="form-buttons">
                    <pulse-loader v-if="loading" color="#1969ff"></pulse-loader>
                    <template v-else>
                        <f-message v-if="error" type="info" with-icon>{{ error }}</f-message>
                        <button class="btn large btn-next" @click="onNextBtnClick">Receive</button>
                    </template>
                </div>
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
import VueQRCodeComponent from 'vue-qrcode-component';
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { mapGetters } from 'vuex';
import FMessage from '../core/FMessage/FMessage.vue';

export default {
    name: 'ReceiveCoin',

    components: { FMessage, FCopyButton, VueQRCodeComponent, PulseLoader },

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
