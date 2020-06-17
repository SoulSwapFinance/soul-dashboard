<template>
    <div class="welcome-view">
        <div class="intro">
            <h1>Welcome to Fantom PWA Wallet</h1>
            <h2>Send, receive and stake your Opera FTM</h2>
        </div>

        <div class="view-account-main">
            <div class="main-buttons v2 collapse-md">
                <router-link :to="{ name: 'create-account' }" class="btn create-account-btn large w100p">
                    Create Wallet
                </router-link>
                <router-link :to="{ name: 'restore-account' }" class="btn restore-account-btn large w100p">
                    Restore Wallet
                </router-link>
                <router-link :to="{ name: 'ledger-accounts' }" class="btn ledger-accounts-btn large w100p">
                    Ledger (Coming)
                </router-link>
            </div>

            <installation-info />
            <account-list />
        </div>
    </div>
</template>

<script>
import AccountList from '../../components/AccountList/AccountList.vue';
import InstallationInfo from '../../components/InstallationInfo/InstallationInfo.vue';

// import {WEIToFTM} from "../utils/transactions.js";
export default {
    name: 'Welcome',

    components: {
        InstallationInfo,
        AccountList,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
