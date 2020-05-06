<template>
    <div class="view-account-history account-main-content-mt">
        <account-transaction-list :address="currentAccount.address" />
    </div>
</template>

<script>
import AccountTransactionList from '../components/data-tables/AccountTransactionList.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'AccountHistory',

    components: { AccountTransactionList },

    computed: {
        ...mapGetters(['currentAccount']),
    },
};
</script>
