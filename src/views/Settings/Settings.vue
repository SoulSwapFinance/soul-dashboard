<template>
    <div class="view-settings">
        <h1>Settings</h1>

        <settings-form />
    </div>
</template>

<script>
import SettingsForm from '../../components/forms/SettingsForm.vue';

export default {
    name: 'Settings',

    components: { SettingsForm },
};
</script>

<style lang="scss">
@import 'style';
</style>
