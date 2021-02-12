<template>
    <f-info
        window-closeable
        window-class="light"
        window-style="max-width: 500px;"
        window-title="Loan to Value (LTV) Ratio"
        icon-size="16"
        class="debt-limit-f-info"
    >
        <p>
            The Maximum Loan-to-Value ratio represents the maximum borrowing power of a specific collateral. For
            example, if a collateral has a LTV of 75%, the user can borrow up to 0.75 worth of ETH in the principal
            currency for every 1 ETH worth of collateral.
        </p>
    </f-info>
</template>

<script>
import FInfo from '@/components/core/FInfo/FInfo.vue';

export default {
    name: 'FLendLTVInfo',

    components: { FInfo },
};
</script>
