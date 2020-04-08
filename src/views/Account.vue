<template>
    <div class="view-account">
        <h1>Address {{ $route.params.address }}</h1>

        <div v-if="!currentAccount" class="tmp-error">Bad wallet</div>

        <button @click="onRemoveAccountButClick">Remove wallet</button>

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

import { REMOVE_ACTIVE_ACCOUNT, SET_ACTIVE_ACCOUNT_BY_ADDRESS } from '../store/mutations.type.js';
import { mapGetters } from 'vuex';

export default {
    components: {
        // FCard
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    created() {
        this.$store.commit(SET_ACTIVE_ACCOUNT_BY_ADDRESS, this.$route.params.address);
    },

    methods: {
        // tmp
        onRemoveAccountButClick() {
            this.$store.commit(REMOVE_ACTIVE_ACCOUNT);
            this.$router.replace({ path: '/' });
        },
    },
};
</script>

<style lang="scss"></style>
