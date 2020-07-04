<template>
    <div class="view-dashboard">
        <dashboard-header />

        <h2 class="h1">
            Wallets <span class="f-records-count">({{ accounts.length }})</span>
        </h2>
        <account-list edit-mode />

        <h2 class="h1">
            Contacts <span class="f-records-count">({{ contacts.length }})</span>
        </h2>

        <contact-list edit-mode />
    </div>
</template>

<script>
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader.vue';
import AccountList from '../../components/AccountList/AccountList.vue';
import { mapGetters } from 'vuex';
import ContactList from '../../components/ContactList/ContactList.vue';

export default {
    name: 'Dashboard',

    components: { ContactList, AccountList, DashboardHeader },

    computed: {
        ...mapGetters(['accounts', 'contacts']),
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
