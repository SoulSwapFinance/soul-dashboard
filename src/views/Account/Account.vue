<template>
    <div class="view-account vertical-layout">
        <main class="main">
            <div class="narrow-container">
                <template v-if="!currentAccount">
                    <f-message type="error" with-icon>Bad wallet</f-message>
                </template>
                <template v-else>
                    <address-info-box />
                    <account-header />

                    <!--                <button @click="onRemoveAccountButClick">Remove wallet</button>-->

                    <router-view></router-view>
                </template>
            </div>
        </main>
    </div>
</template>

<script>
// import FCard from "../components/FCard.vue";

import {
    DEACTIVATE_ACTIVE_ACCOUNT,
    REMOVE_ACTIVE_ACCOUNT,
    SET_ACTIVE_ACCOUNT_ADDRESS,
    SET_ACTIVE_ACCOUNT_BY_ADDRESS,
} from '../../store/mutations.type.js';
import { mapGetters } from 'vuex';
import AccountHeader from '../../components/AccountHeader/AccountHeader.vue';
import AddressInfoBox from '../../components/AddressInfoBox/AddressInfoBox.vue';
import FMessage from '../../components/core/FMessage/FMessage.vue';

export default {
    components: {
        FMessage,
        AddressInfoBox,
        AccountHeader,
        // FMessage,
        // FCard
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    created() {
        this.$store.commit(DEACTIVATE_ACTIVE_ACCOUNT);
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
