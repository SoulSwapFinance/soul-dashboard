<template>
    <div class="view-account-dashboard">
        <dashboard-header />
        <account-list edit-mode />
    </div>
</template>

<script>
import DashboardHeader from '../components/DashboardHeader/DashboardHeader.vue';
import AccountList from '../components/AccountList/AccountList.vue';

export default {
    name: 'Dashboard',

    components: { AccountList, DashboardHeader },
};
</script>

<style lang="scss"></style>
