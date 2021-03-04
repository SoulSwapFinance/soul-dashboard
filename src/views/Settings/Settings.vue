<template>
    <div class="view-settings">
        <h1>Settings</h1>

        <h2>fWallet</h2>
        <settings-form />

        <h2>Metamask</h2>
        <metamask-settings />
    </div>
</template>

<script>
import SettingsForm from '@/components/forms/SettingsForm.vue';
import MetamaskSettings from '@/components/metamask/MetamaskSettings/MetamaskSettings.vue';

export default {
    name: 'Settings',

    components: { MetamaskSettings, SettingsForm },
};
</script>

<style lang="scss">
@import 'style';
</style>
