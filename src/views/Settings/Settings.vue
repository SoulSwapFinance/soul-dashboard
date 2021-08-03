<template>
    <div class="view-settings">
        <h1>Settings</h1>

        <h2>Wallet</h2>
        <settings-form />

        <h2>SoulSwap</h2>
        <f-uniswap-settings />

        <h2>Metamask</h2>
        <metamask-settings />

        <h2>Links</h2>
        <settings-links />
    </div>
</template>

<script>
import SettingsForm from '@/components/forms/SettingsForm.vue';
import MetamaskSettings from '@/components/metamask/MetamaskSettings/MetamaskSettings.vue';
import FUniswapSettings from '@/components/funi/FUniswapSettings/FUniswapSettings.vue';
import SettingsLinks from '@/views/Settings/SettingsLinks.vue';

export default {
    name: 'Settings',

    components: { SettingsLinks, FUniswapSettings, MetamaskSettings, SettingsForm },
};
</script>

<style lang="scss">
@import 'style';
</style>
