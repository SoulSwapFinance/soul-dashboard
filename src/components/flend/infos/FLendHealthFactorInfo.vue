<template>
    <f-info
        window-closeable
        window-class="light"
        window-style="max-width: 400px;"
        window-title="Health factor"
        icon-size="16"
        class="debt-limit-f-info"
    >
        <p>
            The health factor represents the safety of your loan derived from the proportion of collateral versus amount
            borrowed. Keep it above 1 to avoid liquidation.
        </p>
    </f-info>
</template>

<script>
import FInfo from '@/components/core/FInfo/FInfo.vue';

export default {
    name: 'FLendHealthFactorInfo',

    components: { FInfo },
};
</script>
