<template>
    <div class="view-account">
        <h1>Account {{ $route.params.address }}</h1>

        <ul>
            <li>
                <router-link :to="{ name: 'account-send' }">Send</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'account-recieve' }">Recieve</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'account-stake' }">Stake</router-link>
            </li>
        </ul>

        <div class="narrow-container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
// import FCard from "../components/FCard.vue";

export default {
    components: {
        // FCard
    },
};
</script>

<style lang="scss"></style>
