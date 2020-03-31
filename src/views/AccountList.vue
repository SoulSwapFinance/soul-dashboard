<template>
    <div class="view-account-list">
        <div class="intro">
            <h1>Welcome to FantomWallet</h1>
            <h2>Send, receive and stake your Opera FTM</h2>
        </div>

        <div class="view-account-main">
            <ul class="no-markers">
                <li v-for="account in dAccounts" :key="account.address">
                    <f-card>
                        <h3 slot="title" class="title">
                            <span class="label">Address</span>
                            <router-link :to="{name: 'account', params: {address: account.address}}" class="break-word fs-big">{{ account.address }}</router-link>
                        </h3>
                    </f-card>
                </li>
                <li>
                    <f-card>
                        <div class="row">
                            <div class="col">
                                <router-link :to="{name: 'create-account'}" class="btn w100p">Create account</router-link>
                            </div>
                            <div class="col">
                                <router-link :to="{name: 'restore-account'}" class="btn w100p">Restore account</router-link>
                            </div>
                        </div>
                    </f-card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";
    // import {WEIToFTM} from "../utils/transactions.js";
    export default {
        components: {
            FCard
        },

/*
        async mounted() {
            const balance = await this.$fWallet.getBalance('0xd1c1bab1edeb382d76e5d8e454a60775d582546d');
            console.log('mmmm', WEIToFTM(balance));

        },
*/

        data() {
            return {
                dAccounts: [
                    {
                        address: '0x1994e627454649c95ea55885c285343092c1473d'
                    },
                    {
                        address: '0x1994e627454649c95ea55885c285343092c1473d'
                    },
                    {
                        address: '0xc1d2dd56b59b5900d0b16a2a2794ca63ac904500'
                    }
                ]
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .view-account-list {
        .intro {
            color: rgba(255, 255, 255, 0.75);
            /*color: $secondary-color-lighter;*/
            padding: 64px 0 112px;

            h1 {
                font-size: 48px;
                color: #fff;
                /*font-weight: 600;*/
            }
        }

        .view-account-main {
            margin: 0 auto;
            max-width: 770px;

            > ul {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                grid-column-gap: 32px;
                grid-row-gap: 32px;
            }
        }
    }
</style>
