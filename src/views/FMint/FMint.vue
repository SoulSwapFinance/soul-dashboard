<template>
    <div class="view-defi">
        <template v-if="!currentAccount">
            <f-message type="error" with-icon>Bad wallet</f-message>
        </template>
        <template v-else>
            <address-info-box />
            <main class="main">
                <f-view-transition watch-route :views-structure="viewsStructure">
                    <router-view></router-view>
                </f-view-transition>
            </main>
        </template>
    </div>
</template>

<script>
import FMessage from '../../components/core/FMessage/FMessage.vue';
import AddressInfoBox from '../../components/AddressInfoBox/AddressInfoBox.vue';
import { mapGetters } from 'vuex';
import FViewTransition from '../../components/core/FViewTransition/FViewTransition.vue';
import { appStructureTree } from '@/app-structure.js';
import {
    DEACTIVATE_ACTIVE_ACCOUNT,
    SET_ACTIVE_ACCOUNT_ADDRESS,
    SET_ACTIVE_ACCOUNT_BY_ADDRESS,
} from '@/store/mutations.type.js';
import { eventBusMixin } from '@/mixins/event-bus.js';

export default {
    name: 'FMint',

    components: { FViewTransition, AddressInfoBox, FMessage },

    mixins: [eventBusMixin],

    computed: {
        ...mapGetters(['currentAccount']),

        viewsStructure() {
            const defiHomeNode = appStructureTree.serialize(appStructureTree.get('defi-fmint'));

            return defiHomeNode ? [JSON.parse(defiHomeNode)] : [];
        },
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
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
