<template>
    <div class="flenddeposits">
        <f-lend-deposit-list />
    </div>
</template>

<script>
import FLendDepositList from '@/components/data-tables/flend/FLendDepositList/FLendDepositList.vue';

export default {
    name: 'FLendDeposits',

    components: { FLendDepositList },
};
</script>
