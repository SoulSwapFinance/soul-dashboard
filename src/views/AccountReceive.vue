<template>
    <div class="view-account-revieve account-main-content-mt">
        <receive-f-t-m :verify="!!this.$route.params.verify" />
    </div>
</template>

<script>
import ReceiveFTM from '../components/ReceiveFTM/ReceiveFTM.vue';

export default {
    components: { ReceiveFTM },
};
</script>

<style lang="scss"></style>
