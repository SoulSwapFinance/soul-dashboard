<template>
    <div class="create-account-view">
        <component :is="cCurrentPanel"></component>
    </div>
</template>

<script>
import CreatePassword from '../../components/CreatePassword/CreatePassword.vue';

export default {
    components: { CreatePassword },

    computed: {
        cCurrentPanel() {
            return 'create-password';
        },
    },
};
</script>

<style lang="scss"></style>
