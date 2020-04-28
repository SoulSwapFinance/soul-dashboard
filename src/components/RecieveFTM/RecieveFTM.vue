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
                    </template>
                </div>
            </div>

            <vue-q-r-code-component :text="currentAccount.address" class="qr-code" />
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import VueQRCodeComponent from 'vue-qrcode-component';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'RecieveFTM',

    components: { FCard, VueQRCodeComponent, PulseLoader },

    data() {
        return {
            verifying: false,
            complete: false,
            verified: false,
            notVerified: false,
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
                    const address = await this.$fNano.getLedgerAccount(
                        currentAccount.accountId,
                        currentAccount.addressId
                    );
                    // const address = await this.tmp();

                    this.verifying = false;
                    this.verified = this.$fWallet.sameAddresses(address, currentAccount.address);
                } catch (e) {
                    console.error(e);
                    this.verified = false;
                    throw e;
                }

                this.complete = true;
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

                this.verifyLedgerAccount();
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
