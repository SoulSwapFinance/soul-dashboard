<template>
    <div class="account-list-view">
        <div class="intro">
            <h1>Welcome to FantomWallet</h1>
            <h2>Send, receive and stake your Opera FTM</h2>
        </div>

        <div class="view-account-main">
            <ul class="no-markers">
                <li v-for="account in accounts" :key="account.address">
                    <f-card>
                        <h3 slot="title" class="title">
                            <span class="label">Address</span>
                            <router-link
                                :to="{
                                    name: 'account',
                                    params: { address: account.address },
                                }"
                                class="break-word fs-big"
                            >
                                {{ account.address }}
                            </router-link>
                            <br /><br />
                            <span class="label">Balance</span>
                            <span class="fs-big">{{ account.balance }} FTM</span>
                        </h3>
                    </f-card>
                </li>
                <li>
                    <f-card>
                        <div class="row">
                            <div class="col-12">
                                <router-link :to="{ name: 'create-account' }" class="btn w100p">
                                    Create wallet
                                </router-link>
                            </div>
                            <div class="col">
                                <router-link :to="{ name: 'restore-account' }" class="btn w100p">
                                    Restore wallet
                                </router-link>
                            </div>
                        </div>
                    </f-card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import FCard from '../../components/core/FCard/FCard.vue';
import { mapGetters } from 'vuex';

// import {WEIToFTM} from "../utils/transactions.js";
export default {
    components: {
        FCard,
    },

    data() {
        return {
            dAccounts: [
                {
                    address: '0x1994e627454649c95ea55885c285343092c1473d',
                },
                {
                    address: '0xc1d2dd56b59b5900d0b16a2a2794ca63ac904500',
                },
            ],
        };
    },

    computed: {
        ...mapGetters(['accounts']),
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
