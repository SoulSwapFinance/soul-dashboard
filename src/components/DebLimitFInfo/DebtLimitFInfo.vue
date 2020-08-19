<template>
    <f-info window-closeable window-class="light" class="debt-limit-f-info">
        If your debt reaches 100% of your Debt Limit, your collateral will be liquidated. This percentage increases when
        your collateral value falls, or when you borrow more.
    </f-info>
</template>

<script>
import FInfo from '@/components/core/FInfo/FInfo.vue';

export default {
    name: 'DebtLimitFInfo',

    components: { FInfo },
};
</script>
