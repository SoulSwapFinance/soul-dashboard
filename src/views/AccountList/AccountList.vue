<template>
    <div class="account-list-view">
        <div class="intro">
            <h1>Welcome to Fantom Wallet</h1>
            <h2>Send, receive and stake your Opera FTM</h2>
        </div>

        <div class="view-account-main">
            <div class="main-buttons v2 collapse-md">
                <router-link :to="{ name: 'ledger-accounts' }" class="btn ledger-accounts-btn large w100p">
                    Connect to Ledger
                </router-link>
                <router-link :to="{ name: 'create-account' }" class="btn create-account-btn large w100p">
                    Create a Wallet
                </router-link>
                <router-link :to="{ name: 'restore-account' }" class="btn restore-account-btn large w100p">
                    Restore Wallet
                </router-link>
            </div>

            <ul class="no-markers">
                <li v-for="account in accounts" :key="account.address">
                    <f-card>
                        <h3 slot="title" class="title">
                            <span class="row">
                                <span class="col-7 col-12-md">
                                    <span class="label">
                                        Address <span v-if="account.isLedgerAccount">( LEDGER )</span>
                                    </span>
                                    <router-link
                                        :to="{
                                            name: 'account-history',
                                            params: { address: account.address },
                                        }"
                                        class="break-word value"
                                        aria-label="Address"
                                    >
                                        {{ account.address }}
                                    </router-link>
                                </span>
                                <span class="col col-6-md align-right align-left-md">
                                    <span class="label">Available</span>
                                    <span class="value">{{ toFTM(account.balance) }} FTM</span>
                                </span>
                                <span class="col col-6-md align-right align-left-md">
                                    <span class="label">Total Balance</span>
                                    <span class="value">{{ toFTM(account.totalBalance) }} FTM</span>
                                </span>
                            </span>
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
import { toFTM } from '../../utils/transactions.js';

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
        toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
