<template>
    <div class="view-dashboard">
        <dashboard-header />

        <h2 class="h1">
            Wallets <span class="f-records-count">({{ accounts.length }})</span>
        </h2>
        <account-list edit-mode />
    </div>
</template>

<script>
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader.vue';
import AccountList from '../../components/AccountList/AccountList.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Dashboard',

    components: { AccountList, DashboardHeader },

    computed: {
        ...mapGetters(['accounts']),
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
