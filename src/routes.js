import NotFound from "./views/NotFound.vue";
import Home from './views/Home.vue';
import AccountList from "./views/AccountList.vue";
import CreateAccount from "./views/CreateAccount.vue";
import RestoreAccount from "./views/RestoreAccount.vue";
import Account from "./views/Account.vue";
import AccountDashboard from "./views/AccountDashboard.vue";
import AccountSend from "./views/AccountSend.vue";
import AccountRecieve from "./views/AccountRecieve.vue";
import AccountStake from "./views/AccountStake.vue";

export const routes = [
    {
        name: 'home',
        path: '/',
        component: Home,
        children: [
            {
                name: '',
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
                name: '',
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
        name: 'not-found',
        path: '*',
        component: NotFound
    }
];
