<template>
    <div class="view-account vertical-layout">
        <main class="main">
            <div class="narrow-container">
                <address-info-box />
                <account-header />

                <!--
                <f-message v-if="!currentAccount" type="error" with-icon>Bad wallet</f-message>
                <button @click="onRemoveAccountButClick">Remove wallet</button>
                -->

                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script>
// import FCard from "../components/FCard.vue";

import {
    REMOVE_ACTIVE_ACCOUNT,
    SET_ACTIVE_ACCOUNT_ADDRESS,
    SET_ACTIVE_ACCOUNT_BY_ADDRESS,
} from '../../store/mutations.type.js';
import { mapGetters } from 'vuex';
import AccountHeader from '../../components/AccountHeader/AccountHeader.vue';
import AddressInfoBox from '../../components/AddressInfoBox/AddressInfoBox.vue';
// import FMessage from '../../components/core/FMessage/FMessage.vue';

export default {
    components: {
        AddressInfoBox,
        AccountHeader,
        // FMessage,
        // FCard
    },

    computed: {
        ...mapGetters(['currentAccountAddress']),
    },

    created() {
        this.$store.commit(SET_ACTIVE_ACCOUNT_BY_ADDRESS, this.$route.params.address);
        this.$store.commit(SET_ACTIVE_ACCOUNT_ADDRESS, this.$route.params.address);
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

<style lang="scss">
@import 'style';
</style>
