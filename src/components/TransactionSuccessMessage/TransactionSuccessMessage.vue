<template>
    <f-card class="transaction-success-message f-card-double-padding">
        <h2>Transaction sent!</h2>

        <h3 class="break-word">
            <a :href="`https://explorer.fantom.network/transactions/${tx}`" target="_blank">{{ tx | formatHash }}</a>
        </h3>

        <div class="success-icon">
            <icon data="@/assets/svg/message/check-circle.svg" width="96" height="96" aria-hidden="true" />
        </div>
    </f-card>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';

export default {
    components: { FCard },

    props: {
        // transaction hash
        tx: {
            type: String,
            default: '',
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
