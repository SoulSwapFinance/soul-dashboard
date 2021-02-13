<template>
    <div class="flendborrow">
        <f-lend-borrow-list />
    </div>
</template>

<script>
import FLendBorrowList from '@/components/data-tables/FLendBorrowList/FLendBorrowList.vue';

export default {
    name: 'FLendBorrow',

    components: { FLendBorrowList },
};
</script>
