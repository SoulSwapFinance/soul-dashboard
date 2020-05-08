<template>
    <div class="account-list">
        <ul class="no-markers">
            <li v-for="account in accounts" :key="account.address">
                <f-card>
                    <h3 slot="title" class="title">
                        <span class="row no-collapse">
                            <span class="col-7 col-12-md">
                                <router-link
                                    :to="{
                                        name: routeName,
                                        params: { address: account.address },
                                    }"
                                    class="value"
                                    aria-label="Address"
                                >
                                    <f-ellipsis :text="account.address" overflow="middle" />
                                </router-link>
                                <span class="label">
                                    Address <span v-if="account.isLedgerAccount">( LEDGER )</span>
                                </span>
                            </span>
                            <span class="col col-6-md align-right align-left-md">
                                <span class="value">{{ toFTM(account.balance) }} FTM</span>
                                <span class="label">Available</span>
                            </span>
                            <span class="col col-6-md align-right align-left-md">
                                <span class="value">{{ toFTM(account.totalBalance) }} FTM</span>
                                <span class="label">Total Balance</span>
                            </span>
                        </span>
                    </h3>
                </f-card>
            </li>
        </ul>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import { mapGetters } from 'vuex';
import { toFTM } from '../../utils/transactions.js';
import {
    DEACTIVATE_ACTIVE_ACCOUNT,
    SET_ACTIVE_ACCOUNT_ADDRESS,
    SET_ACTIVE_ACCOUNT_BY_ADDRESS,
} from '../../store/mutations.type.js';
import { eventBusMixin } from '../../mixins/event-bus.js';
import { UPDATE_ACCOUNTS_BALANCES } from '../../store/actions.type.js';
import FEllipsis from '../core/FEllipsis/FEllipsis.vue';

export default {
    name: 'AccountList',

    components: { FEllipsis, FCard },

    mixins: [eventBusMixin],

    data() {
        return {
            routeName: 'account-history',
        };
    },

    computed: {
        ...mapGetters(['accounts']),
    },

    watch: {
        $route(_route) {
            if (_route.params && _route.params.address) {
                this.$emit('account-picked', _route.params.address);
                this._eventBus.emit('account-picked', _route.params.address);
            }
        },
    },

    created() {
        const routeName = this.$route.name;

        if (routeName.indexOf('account-') > -1) {
            this.routeName = routeName;
        }
    },

    mounted() {
        this.$store.dispatch(UPDATE_ACCOUNTS_BALANCES);
    },

    beforeDestroy() {
        const route = this.$route;

        if (route.params && route.params.address) {
            this.pickAccount(route.params.address);
        }
    },

    methods: {
        pickAccount(_address) {
            this.$store.commit(DEACTIVATE_ACTIVE_ACCOUNT);
            this.$store.commit(SET_ACTIVE_ACCOUNT_BY_ADDRESS, _address);
            this.$store.commit(SET_ACTIVE_ACCOUNT_ADDRESS, _address);
        },

        toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
