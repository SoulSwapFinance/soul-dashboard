<template>
    <div class="account-list">
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
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import { mapGetters } from 'vuex';
import { toFTM } from '../../utils/transactions.js';

export default {
    name: 'AccountList',

    components: { FCard },

    computed: {
        ...mapGetters(['accounts']),
    },

    methods: {
        toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
