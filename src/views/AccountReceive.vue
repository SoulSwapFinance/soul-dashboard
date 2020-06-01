<template>
    <div class="view-account-receieve account-main-content-mt">
        <receive-coins :verify-account="!!this.$route.params.verify" />
    </div>
</template>

<script>
import ReceiveCoins from '../components/ReceiveCoins/ReceiveCoins.vue';

export default {
    components: { ReceiveCoins },
};
</script>

<style lang="scss"></style>
