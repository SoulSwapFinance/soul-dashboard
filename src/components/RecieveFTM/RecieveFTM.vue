<template>
    <div class="verify-ledger-address">
        <f-card class="f-card-double-padding">
            <h2>Receive Opera FTM</h2>

            <h3 class="address break-word h2" :class="addressCssClass">
                {{ currentAccount.address }} &nbsp;
                <icon
                    v-show="complete && verified"
                    data="@/assets/svg/message/check-circle.svg"
                    width="20"
                    height="20"
                />
                <icon v-show="complete && !verified" data="@/assets/svg/times.svg" width="20" height="20" />
            </h3>

            <div v-if="currentAccount.isLedgerAccount" class="verify-cont center-v">
                <div>
                    <template v-if="verifying">
                        <pulse-loader color="#1969ff"></pulse-loader>
                    </template>
                    <template v-else>
                        <button class="btn large" :disabled="verifying" @click="onVerifyBtnClick">
                            Verify Address on Ledger
                        </button>
                        <ledger-message :error="error" />
                    </template>
                </div>
            </div>

            <vue-q-r-code-component :text="currentAccount.address" class="qr-code" />

            <f-window
                ref="confirmationWindow"
                modal
                title="Address Verification"
                style="max-width: 620px;"
                transition-enter="scale-center-enter-active"
                transition-leave="scale-center-leave-active"
            >
                <!--                <icon data="@/assets/svg/nano-s-confirm-tx.svg" width="300" height="91" />-->
                <div class="align-center">
                    <img src="img/nano-s-verify-address.png" alt="fantom nano device" /><br /><br />
                </div>

                <p>Please verify following address on your Ledger device:</p>

                <h3 class="break-word h2 align-center">{{ currentAccount.address }}</h3>
            </f-window>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import VueQRCodeComponent from 'vue-qrcode-component';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { mapGetters } from 'vuex';
import LedgerMessage from '../LedgerMessage/LedgerMessage.vue';
import { U2FStatus } from '../../plugins/fantom-nano.js';
import FWindow from '../core/FWindow/FWindow.vue';

export default {
    name: 'RecieveFTM',

    components: { FWindow, LedgerMessage, FCard, VueQRCodeComponent, PulseLoader },

    data() {
        return {
            verifying: false,
            complete: false,
            verified: false,
            notVerified: false,
            error: null,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        addressCssClass() {
            return {
                complete: this.complete,
                yes: this.verified,
                no: !this.verified,
            };
        },
    },

    methods: {
        async verifyLedgerAccount() {
            const { currentAccount } = this;

            if (currentAccount) {
                try {
                    this.$refs.confirmationWindow.show();

                    const account = await this.$fNano.getLedgerAccount(
                        currentAccount.accountId,
                        currentAccount.addressId
                    );
                    // const address = await this.tmp();

                    this.$refs.confirmationWindow.hide();

                    this.verifying = false;
                    this.verified = this.$fWallet.sameAddresses(account.address, currentAccount.address);
                    this.complete = true;
                } catch (_error) {
                    this.error = _error;

                    this.verifying = false;
                    this.verified = false;
                    this.complete = _error.statusCode !== U2FStatus.DEVICE_LOCKED;

                    this.$refs.confirmationWindow.hide();
                }
            }
        },

        async tmp() {
            return new Promise((_resolve) => {
                setTimeout(() => {
                    _resolve('0x1994E627454649C95Ea55885c285343092c1473d');
                    // _resolve('0x9CE5434e590ce316C51b3DEbcE422Eb9C1872Df8');
                    // _resolve('0x76AE07E6D236c1aE3F5C3112F387ad82c69A2471');
                }, 1500);
            });
        },

        onVerifyBtnClick() {
            if (!this.verifying) {
                this.verifying = true;
                this.complete = false;
                this.error = null;

                this.verifyLedgerAccount();
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
