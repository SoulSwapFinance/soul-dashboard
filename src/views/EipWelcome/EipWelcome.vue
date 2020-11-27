<template>
    <div>
        <account-list target-window="_blank" />

        <div v-if="!accounts.length" class="narrow-container">
            <router-link to="/" class="btn large w100p" target="_blank">
                Start using Fantom PWA Wallet
            </router-link>
        </div>
    </div>
</template>

<script>
import AccountList from '../../components/AccountList/AccountList.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Popup',

    components: {
        AccountList,
    },

    computed: {
        ...mapGetters(['accounts']),
    },
};
</script>
