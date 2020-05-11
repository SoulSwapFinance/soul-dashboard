<template>
    <div class="dashboard-header">
        <h1>
            Addresses <span class="f-records-count">({{ accounts.length }})</span>
        </h1>

        <header>
            <dashboard-info-box />
        </header>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DashboardInfoBox from '../DashboardInfoBox/DashboardInfoBox.vue';

export default {
    name: 'DashboardHeader',

    components: { DashboardInfoBox },

    /*
    data() {
        return {
            addressesCount: 123,
        };
    },
    */

    computed: {
        ...mapGetters(['accounts']),
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
