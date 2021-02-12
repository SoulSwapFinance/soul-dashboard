<template>
    <f-info
        window-closeable
        window-class="light"
        window-style="max-width: 500px;"
        window-title="Liquidation threshold"
        icon-size="16"
        class="debt-limit-f-info"
    >
        <p>
            This represents the threshold at which a borrow position will be considered undercollateralized and subject
            to liquidation for each collateral. For example, if a collateral has a liquidation threshold of 80%, it
            means that the loan will be liquidated when the debt value is worth 80% of the collateral value.
        </p>
    </f-info>
</template>

<script>
import FInfo from '@/components/core/FInfo/FInfo.vue';

export default {
    name: 'FLendLiquidationTresholdInfo',

    components: { FInfo },
};
</script>
