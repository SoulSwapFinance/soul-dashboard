<template>
    <f-info
        window-closeable
        window-class="light"
        window-style="max-width: 500px;"
        window-title="Liquidation penalty"
        icon-size="16"
        class="debt-limit-f-info"
    >
        <p>
            When a liquidation occurs, liquidators repay part or all of the outstanding borrowed amount on behalf of the
            borrower. In return, they can buy the collateral at a discount and keep the difference as a bonus!
        </p>
    </f-info>
</template>

<script>
import FInfo from '@/components/core/FInfo/FInfo.vue';

export default {
    name: 'FLendLiquidationPenalty',

    components: { FInfo },
};
</script>
