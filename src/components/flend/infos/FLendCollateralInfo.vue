<template>
    <f-info
        window-closeable
        window-class="light"
        window-style="max-width: 550px;"
        window-title="Adding and removing assets as collateral"
        icon-size="16"
        class="debt-limit-f-info"
    >
        <p>
            Allows you to decide whether to use a deposited asset as collateral. An asset used as collateral will affect
            your borrowing power and health factor
        </p>
    </f-info>
</template>

<script>
import FInfo from '@/components/core/FInfo/FInfo.vue';

export default {
    name: 'FLendCollateralInfo',

    components: { FInfo },
};
</script>
