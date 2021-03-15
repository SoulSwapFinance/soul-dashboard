<template>
    <div class="receive-ftm">
        <div class="align-center">
            Send your Opera FTM to:

            <h3 class="address break-word h2" :class="addressCssClass">
                {{ currentAccount.address }} &nbsp;
                <icon
                    v-show="complete && verified"
                    data="@/assets/svg/message/check-circle.svg"
                    width="20"
                    height="20"
                />
                <icon v-show="complete && !verified" data="@/assets/svg/times.svg" width="20" height="20" />
                <f-copy-button
                    :text="currentAccount.address"
                    tooltip="Copy address to clipboard"
                    :hide-popover-after="3100"
                    class="btn large light same-size round"
                >
                    <template #popover-text>
                        Address copied to clipboard. <br />
                        Warning: Use this address to receive Opera FTM only. If you are receiving FTM-ERC20 you need to
                        use a different address!
                    </template>
                </f-copy-button>
                <button class="btn large light same-size round" title="Show QR Code" @click="$refs.qrWindow.show()">
                    <icon data="@/assets/svg/monochrome/Options/QR.svg" width="20" height="20" aria-hidden="true" />
                </button>
            </h3>
        </div>

        <div v-if="currentAccount.isLedgerAccount" class="verify-cont center-v">
            <div>
                <template v-if="verifying">
                    <pulse-loader color="#1969ff"></pulse-loader>
                </template>
                <template v-else>
                    <button class="btn large" :disabled="verifying" @click="onVerifyBtnClick">
                        Verify on Ledger
                    </button>
                    <ledger-message :error="error" />
                </template>
            </div>
        </div>

        <q-r-code-window ref="qrWindow" :address="currentAccount.address">
            <f-message type="warning" with-icon>
                Warning: Use this address to receive Opera FTM only. If you are receiving FTM-ERC20 you need to use a
                different address!
            </f-message>
        </q-r-code-window>

        <f-window
            ref="confirmationWindow"
            modal
            title="Address Verification"
            style="max-width: 620px;"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
        >
            <!--                <icon data="@/assets/svg/nano-s-confirm-tx.svg" width="300" height="91" />-->
            <div class="align-center">
                <img src="img/nano-s-verify-address.png" alt="fantom nano device" /><br /><br />
            </div>

            <p class="align-center">Please verify following address on your Ledger device:</p>

            <h3 class="break-word h2 align-center">{{ currentAccount.address }}</h3>
        </f-window>
    </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { mapGetters } from 'vuex';
import LedgerMessage from '../LedgerMessage/LedgerMessage.vue';
import { U2FStatus } from '../../plugins/fantom-nano.js';
import FWindow from '../core/FWindow/FWindow.vue';
import FCopyButton from '../core/FCopyButton/FCopyButton.vue';
import QRCodeWindow from '../windows/QRCodeWindow/QRCodeWindow.vue';
import FMessage from '../core/FMessage/FMessage.vue';

export default {
    name: 'ReceiveFTM',

    components: { FMessage, QRCodeWindow, FCopyButton, FWindow, LedgerMessage, PulseLoader },

    props: {
        /** Start verify FTM account */
        verifyAccount: {
            type: Boolean,
            default: false,
        },
    },

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

    mounted() {
        if (this.verifyAccount) {
            this.onVerifyBtnClick();
        }
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

                    this.verifying = false;
                    this.verified = this.$fWallet.sameAddresses(account.address, currentAccount.address);
                    this.complete = true;

                    this.$refs.confirmationWindow.hide(this.verified ? 'fade-leave-active' : '');
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
