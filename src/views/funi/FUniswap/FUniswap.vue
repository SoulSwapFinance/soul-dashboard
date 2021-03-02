<template>
    <div class="view-funiswap">
        <template v-if="!currentAccount">
            <f-message type="error" with-icon>Bad wallet</f-message>
        </template>
        <template v-else>
            <address-info-box />

            <main class="main">
                <h1>fUNI</h1>
                <f-uniswap-menu />
                <router-view></router-view>
            </main>
        </template>
    </div>
</template>

<script>
import FMessage from '@/components/core/FMessage/FMessage.vue';
import AddressInfoBox from '@/components/AddressInfoBox/AddressInfoBox.vue';
import { mapGetters } from 'vuex';
import {
    DEACTIVATE_ACTIVE_ACCOUNT,
    SET_ACTIVE_ACCOUNT_ADDRESS,
    SET_ACTIVE_ACCOUNT_BY_ADDRESS,
} from '@/store/mutations.type.js';
import { eventBusMixin } from '@/mixins/event-bus.js';
import { appStructureTree } from '@/app-structure.js';
import FUniswapMenu from '@/components/funi/FUniswapMenu/FUniswapMenu.vue';

export default {
    name: 'FUniswap',

    components: { FUniswapMenu, AddressInfoBox, FMessage },

    mixins: [eventBusMixin],

    computed: {
        ...mapGetters(['currentAccount']),

        viewsStructure() {
            const node = appStructureTree.serialize(appStructureTree.get('funiswap'));

            return node ? [JSON.parse(node)] : [];
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
