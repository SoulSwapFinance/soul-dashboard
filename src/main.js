import Vue from 'vue';
import App from './App.vue';
import { router } from '@/plugins/router.js';
import { apolloProvider, apolloClient } from '@/plugins/apollo-provider.js';
import i18n from '@/plugins/i18n';
import '@/plugins/vue-timeago.js';
import '@/plugins/vue-svgicon.js';
import '@/plugins/vue-observe-visibility.js';
import './plugins/vue-async-computed.js';
import { store } from './store';
import './filters.js';
import './registerServiceWorker';
import Web3 from 'web3';
import { FantomWeb3Wallet } from './plugins/fantom-web3-wallet.js';
import appConfig from '../app.config.js';

Vue.use(FantomWeb3Wallet, {
    Web3,
    httpProvider: appConfig.web3.httpProvider,
    apolloClient,
});

Vue.config.productionTip = false;

// measure performance
// Vue.config.performance = true;

new Vue({
    render: (h) => h(App),
    router,
    store,
    i18n,
    apolloProvider,
}).$mount('#app');
