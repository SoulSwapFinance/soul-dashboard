<template>
    <f-card class="transaction-reject-message f-card-double-padding">
        <h2>Transaction rejected</h2>

        <div class="reject-icon">
            <icon data="@/assets/svg/message/times-circle.svg" width="96" height="96" aria-hidden="true" />
        </div>
    </f-card>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
export default {
    name: 'TransactionRejectMessage',

    components: { FCard },
};
</script>

<style lang="scss">
@import 'style';
</style>
