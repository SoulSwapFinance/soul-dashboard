<template>
    <div class="account-list-view">
        <div class="intro">
            <h1>Welcome to FantomWallet</h1>
            <h2>Send, receive and stake your Opera FTM</h2>
        </div>

        <div class="view-account-main">
            <ul class="no-markers">
                <li>
                    <f-card class="center-v">
                        <div class="row">
                            <div class="col-12">
                                <router-link
                                    :to="{ name: 'create-account' }"
                                    class="btn create-account-btn large w100p"
                                >
                                    Create a wallet
                                </router-link>
                            </div>
                            <div class="col">
                                <router-link
                                    :to="{ name: 'restore-account' }"
                                    class="btn restore-account-btn large w100p"
                                >
                                    Restore wallet
                                </router-link>
                            </div>
                        </div>
                    </f-card>
                </li>
                <li v-for="account in accounts" :key="account.address">
                    <f-card>
                        <h3 slot="title" class="title">
                            <span class="label">Address</span>
                            <router-link
                                :to="{
                                    name: 'account-dashboard',
                                    params: { address: account.address },
                                }"
                                class="break-word fs-big"
                                aria-label="Address"
                            >
                                {{ account.address }}
                            </router-link>
                            <br /><br />
                            <span class="label">Balance</span>
                            <span class="fs-big">{{ toFTM(account.balance) }} FTM</span>
                        </h3>
                    </f-card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import FCard from '../../components/core/FCard/FCard.vue';
import { mapGetters } from 'vuex';
import { UPDATE_ACCOUNTS_BALANCES } from '../../store/actions.type.js';
import { formatNumberByLocale, numToFixed } from '../../filters.js';
import { WEIToFTM } from '../../utils/transactions.js';

// import {WEIToFTM} from "../utils/transactions.js";
export default {
    components: {
        FCard,
    },

    computed: {
        ...mapGetters(['accounts']),
    },

    mounted() {
        this.$store.dispatch(UPDATE_ACCOUNTS_BALANCES);
    },

    methods: {
        /**
         * Convert value to FTM.
         *
         * @param {string|number} _value
         * @return {string}
         */
        toFTM(_value) {
            return formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
