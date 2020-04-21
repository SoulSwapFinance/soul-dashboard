<template>
    <div class="view-account-dashboard account-main-content-mt">
        <account-transaction-list :address="currentAccount.address" />
    </div>
</template>

<script>
import AccountTransactionList from '../components/data-tables/AccountTransactionList.vue';
import { mapGetters } from 'vuex';

export default {
    components: { AccountTransactionList },

    computed: {
        ...mapGetters(['currentAccount']),
    },
};
</script>

<style lang="scss"></style>
