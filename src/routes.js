import NotFound from "./views/NotFound/NotFound.vue";
import Home from './views/Home/Home.vue';
import AccountList from "./views/AccountList/AccountList.vue";
import CreateAccount from "./views/CreateAccount.vue";
import RestoreAccount from "./views/RestoreAccount/RestoreAccount.vue";
import Account from "./views/Account.vue";
import AccountDashboard from "./views/AccountDashboard.vue";
import AccountSend from "./views/AccountSend.vue";
import AccountRecieve from "./views/AccountRecieve.vue";
import AccountStake from "./views/AccountStake.vue";
import Playground from "./views/Playground.vue";

export const routes = [
    {
        name: 'home',
        path: '/',
        component: Home,
        children: [
            {
                name: 'acount-list',
                path: '',
                component: AccountList
            },
            {
                name: 'create-account',
                path: '/account/create',
                component: CreateAccount
            },
            {
                name: 'restore-account',
                path: '/account/restore',
                component: RestoreAccount
            }
        ]
    },
    {
        name: 'account',
        path: '/account/:address',
        component: Account,
        children: [
            {
                name: 'acount-dashboard',
                path: '',
                component: AccountDashboard
            },
            {
                name: 'account-send',
                path: 'send',
                component: AccountSend
            },
            {
                name: 'account-recieve',
                path: 'recieve',
                component: AccountRecieve
            },
            {
                name: 'account-stake',
                path: 'stake',
                component: AccountStake
            },
        ]
    },
    {
        name: 'playground',
        path: '/playground',
        component: Playground
    },
    {
        name: 'not-found',
        path: '*',
        component: NotFound
    }
];
