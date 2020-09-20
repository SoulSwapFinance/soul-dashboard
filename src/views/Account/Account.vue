<template>
    <div class="view-account">
        <template v-if="!currentAccount">
            <f-message type="error" with-icon>Bad wallet</f-message>
        </template>
        <template v-else>
            <address-info-box />
            <account-header />

            <!--            <button @click="onRemoveAccountButClick">Remove wallet</button>-->

            <main class="main">
                <router-view></router-view>
            </main>
        </template>
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
import { eventBusMixin } from '@/mixins/event-bus.js';

export default {
    components: {
        FMessage,
        AddressInfoBox,
        AccountHeader,
        // FMessage,
        // FCard
    },

    mixins: [eventBusMixin],

    computed: {
        ...mapGetters(['currentAccount']),
    },

    watch: {
        $route(_value) {
            const { address } = _value.params;

            if (address && address.toLowerCase() !== this.currentAccount.address.toLowerCase()) {
                this.setActiveAccount(address);
                this._eventBus.emit('account-picked', address);
            }
        },
    },

    created() {
        this.setActiveAccount(this.$route.params.address);
    },

    methods: {
        /**
         * @param {string} _address
         */
        setActiveAccount(_address) {
            this.$store.commit(DEACTIVATE_ACTIVE_ACCOUNT);
            this.$store.commit(SET_ACTIVE_ACCOUNT_BY_ADDRESS, _address);
            this.$store.commit(SET_ACTIVE_ACCOUNT_ADDRESS, _address);
        },

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
