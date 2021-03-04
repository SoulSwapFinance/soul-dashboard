<template>
    <div class="metamasksettings">
        <f-card class="f-card-double-padding">
            <div class="metamasksettings_body">
                <template v-if="isMetamaskInstalled">
                    <div class="metamasksettings_section">
                        <h3>Networks</h3>
                        <button id="add_mainnet_btn" class="btn" @click="onAddChainClick('mainnet')">
                            Add Fantom Opera Mainnet
                        </button>
                        <button id="add_testnet_btn" class="btn secondary" @click="onAddChainClick('testnet')">
                            Add Fantom Testnet
                        </button>

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
                            <slot name="popover-text">{{ popoverText }}</slot>
                        </f-window>
                    </div>

                    <div class="metamasksettings_section">
                        <h3>Assets</h3>
                        <button class="btn" @click="onAddAssetClick">Add Asset</button>
                        <button class="btn secondary" @click="onAddOwnAssettClick">Add Your Own Asset</button>
                    </div>
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

export default {
    name: 'MetamaskSettings',

    components: { FWindow, FCard },

    data() {
        return {
            isMetamaskInstalled: true,
            popoverText: '',
            btnId: '',
        };
    },

    methods: {
        /**
         * @param {('mainnet' | 'testnet')} _type
         * @return {Promise<void>}
         */
        async onAddChainClick(_type = 'mainnet') {
            const chain = _type === 'mainnet' ? OPERA_MAINNET : OPERA_TESTNET;
            const btnId = _type === 'mainnet' ? 'add_mainnet_btn' : 'add_testnet_btn';
            const response = await this.$metamask.addEthereumChain(chain);

            if (response === null) {
                this.popoverText = `${chain.chainName} was added to Metamask`;
                this.btnId = btnId;
                this.$refs.popover.show();
            }
        },

        onAddAssetClick() {
            alert('Not implemented yet');
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
