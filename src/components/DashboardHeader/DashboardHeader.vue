<template>
    <div class="dashboard-header">
        <h1>Home</h1>
        <header>
            <dashboard-info-box />
        </header>
    </div>
</template>

<script>
import DashboardInfoBox from '../DashboardInfoBox/DashboardInfoBox.vue';

export default {
    name: 'DashboardHeader',

    components: { DashboardInfoBox },
};
</script>

<style lang="scss">
@import 'style';
</style>
