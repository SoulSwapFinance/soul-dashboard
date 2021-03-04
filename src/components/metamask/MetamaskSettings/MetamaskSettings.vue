<template>
    <div class="metamasksettings">
        <f-card class="f-card-double-padding">
            <div class="metamasksettings_body">
                <template v-if="isMetamaskInstalled">
                    <div class="metamasksettings_section">
                        <h3>Networks</h3>
                        <button
                            id="add_mainnet_btn"
                            class="btn large"
                            :disabled="addFantomMainnetInProgress"
                            @click="onAddChainClick('mainnet')"
                        >
                            <template v-if="!addFantomMainnetInProgress">
                                Add Fantom Opera Mainnet
                            </template>
                            <pulse-loader v-else color="#fff"></pulse-loader>
                        </button>
                        <button
                            id="add_testnet_btn"
                            class="btn large secondary"
                            :disabled="addFantomTestnetInProgress"
                            @click="onAddChainClick('testnet')"
                        >
                            <template v-if="!addFantomTestnetInProgress">
                                Add Fantom Testnet
                            </template>
                            <pulse-loader v-else color="#1969ff"></pulse-loader>
                        </button>
                    </div>

                    <div class="metamasksettings_section">
                        <h3>Assets</h3>
                        <button
                            id="add_asset_btn"
                            class="btn large"
                            :disabled="addAssetInProgress"
                            @click="onAddAssetClick"
                        >
                            <template v-if="!addAssetInProgress">
                                Add Asset
                            </template>
                            <pulse-loader v-else color="#fff"></pulse-loader>
                        </button>
                        <!--                        <button class="btn large secondary" @click="onAddOwnAssettClick">Add Your Own Asset</button>-->
                    </div>

                    <f-window
                        ref="popover"
                        popover
                        :attach-to="`#${btnId}`"
                        attach-position="auto"
                        preferred-attach-position="top"
                        :attach-margin="[4, 4, 4, 4]"
                        :with-header="false"
                        :hide-after="3000"
                        animation-in="scale-center-enter-active"
                        animation-out="scale-center-leave-active"
                        style="width: auto; max-width: 360px;"
                    >
                        <slot name="popover-text">
                            {{ popoverText }}
                        </slot>
                    </f-window>

                    <defi-token-picker-window
                        ref="tokenPicker"
                        :tokens="defiTokens"
                        @window-hide="stopLoadingIndicators"
                        @defi-token-picked="onDefiTokenPicked"
                    />
                </template>
                <template v-else>
                    Install Metamask
                </template>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '@/components/core/FCard/FCard.vue';
import { OPERA_MAINNET, OPERA_TESTNET } from '@/plugins/metamask/metamask.js';
import FWindow from '@/components/core/FWindow/FWindow.vue';
import { mapGetters } from 'vuex';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import DefiTokenPickerWindow from '@/components/windows/DefiTokenPickerWindow/DefiTokenPickerWindow.vue';

export default {
    name: 'MetamaskSettings',

    components: { DefiTokenPickerWindow, FWindow, FCard, PulseLoader },

    data() {
        return {
            isMetamaskInstalled: true,
            popoverText: '',
            btnId: '',
            addFantomMainnetInProgress: false,
            addFantomTestnetInProgress: false,
            addAssetInProgress: false,
            defiTokens: [],
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    methods: {
        stopLoadingIndicators() {
            this.addFantomMainnetInProgress = false;
            this.addFantomTestnetInProgress = false;
            this.addAssetInProgress = false;
        },

        /**
         * @param {('mainnet' | 'testnet')} _type
         * @return {Promise<void>}
         */
        async onAddChainClick(_type = 'mainnet') {
            const mainnet = _type === 'mainnet';
            const chain = mainnet ? OPERA_MAINNET : OPERA_TESTNET;
            const btnId = mainnet ? 'add_mainnet_btn' : 'add_testnet_btn';

            if (mainnet) {
                this.addFantomMainnetInProgress = true;
            } else {
                this.addFantomTestnetInProgress = true;
            }

            try {
                const response = await this.$metamask.addEthereumChain(chain);

                if (response === null) {
                    this.popoverText = `${chain.chainName} was added to Metamask`;
                    this.btnId = btnId;
                    this.$refs.popover.show();
                }

                this.stopLoadingIndicators();
            } catch (_error) {
                this.stopLoadingIndicators();
                console.error(_error);
            }
        },

        async onAddAssetClick() {
            const accountAddress = this.currentAccount ? this.currentAccount.address : '';
            this.defiTokens =
                this.defiTokens.length > 0 ? this.defiTokens : await this.$defi.fetchTokens(accountAddress);
            this.addAssetInProgress = true;
            this.$refs.tokenPicker.show();
        },

        async onDefiTokenPicked(_token) {
            try {
                const response = await this.$metamask.watchAsset({
                    type: 'ERC20',
                    options: {
                        address: _token.address,
                        symbol: _token.symbol,
                        decimals: _token.decimals,
                        image: _token.logoUrl,
                    },
                });

                if (response) {
                    this.popoverText = `Asset ${_token.symbol} was added to Metamask`;
                    this.btnId = 'add_asset_btn';
                    this.$refs.popover.show();
                }

                this.stopLoadingIndicators();
            } catch (_error) {
                this.stopLoadingIndicators();
                console.error(_error);
            }
        },

        onAddOwnAssettClick() {
            alert('Not implemented yet');
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
