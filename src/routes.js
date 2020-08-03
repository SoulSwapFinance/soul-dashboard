import NotFound from './views/NotFound/NotFound.vue';
import Home from './views/Home/Home.vue';
import Welcome from './views/Welcome/Welcome.vue';
import CreateAccount from './views/CreateAccount/CreateAccount.vue';
import RestoreAccount from './views/RestoreAccount/RestoreAccount.vue';
import Account from './views/Account/Account.vue';
import Dashboard from './views/Dashboard/Dashboard.vue';
import AccountSend from './views/AccountSend.vue';
import AccountReceive from './views/AccountReceive.vue';
import AccountStake from './views/AccountStake.vue';
import Playground from './views/Playground.vue';
import LedgerAccounts from './views/LedgerAccounts/LedgerAccounts.vue';
import AccountHistory from './views/AccountHistory.vue';
import Settings from './views/Settings/Settings.vue';
import Wallet from './views/Wallet/Wallet.vue';
import AccountVote from './views/AccountVote.vue';
import Defi from './views/Defi/Defi.vue';
import DefiHome from './views/DefiHome/DefiHome.vue';
import DefiFMint from './views/DefiFMint/DefiFMint.vue';
import DefiDepositFTM from './views/DefiDepositFTM/DefiDepositFTM.vue';
import DefiBorrowFUSD from './views/DefiBorrowFUSD/DefiBorrowFUSD.vue';
import DefiDepositFTMConfirmation from './views/DefiDepositFTMConfirmation/DefiDepositFTMConfirmation.vue';
import TransactionSuccessMessageView from './views/TransactionSuccessMessageView/TransactionSuccessMessageView.vue';
import TransactionRejectMessageView from './views/TransactionRejectMessageView/TransactionRejectMessageView.vue';
import DefiBorrowFUSDConfirmation from './views/DefiBorrowFUSDConfirmation/DefiBorrowFUSDConfirmation.vue';
import DefiFLend from './views/DefiFLend/DefiFLend.vue';
import DefiManageBorrow from './views/DefiManageBorrow/DefiManageBorrow.vue';
import DefiFTrade from './views/DefiFTrade/DefiFTrade.vue';
import DefiManageBorrowConfirmation from './views/DefiManageBorrowConfirmation/DefiManageBorrowConfirmation.vue';
import DefiFTradeConfirmation from './views/DefiFTradeConfirmation/DefiFTradeConfirmation.vue';
import DefiManageDeposit from './views/DefiManageDeposit/DefiManageDeposit.vue';
import DefiManageDepositConfirmation from './views/DefiManageDepositConfirmation/DefiManageDepositConfirmation.vue';

export const routes = [
    {
        name: 'home',
        path: '/',
        component: Home,
        children: [
            {
                name: 'welcome',
                path: '',
                component: Welcome,
            },
            {
                name: 'create-account',
                path: '/account/create',
                component: CreateAccount,
            },
            {
                name: 'restore-account',
                path: '/account/restore',
                component: RestoreAccount,
            },
            {
                name: 'ledger-accounts',
                path: '/ledger-accounts',
                component: LedgerAccounts,
            },
        ],
    },
    {
        name: 'wallet',
        path: '/',
        component: Wallet,
        children: [
            {
                name: 'account',
                path: '/account/:address',
                component: Account,
                children: [
                    {
                        name: 'account-history',
                        path: '',
                        component: AccountHistory,
                        meta: { dontScrollToTop: true },
                    },
                    {
                        name: 'account-send',
                        path: 'send',
                        component: AccountSend,
                        meta: { dontScrollToTop: true },
                    },
                    {
                        name: 'account-receive',
                        path: 'receive',
                        component: AccountReceive,
                        meta: { dontScrollToTop: true },
                    },
                    {
                        name: 'account-stake',
                        path: 'stake',
                        component: AccountStake,
                        meta: { dontScrollToTop: true },
                    },
                    {
                        name: 'account-vote',
                        path: 'vote',
                        component: AccountVote,
                        meta: { dontScrollToTop: true },
                    },
                ],
            },
            {
                name: 'dashboard',
                path: '/dashboard',
                component: Dashboard,
            },
            {
                name: 'defi',
                path: '/defi/:address',
                component: Defi,
                children: [
                    {
                        name: 'defi-home',
                        path: '',
                        component: DefiHome,
                    },
                    {
                        name: 'defi-fmint',
                        path: 'fmint',
                        component: DefiFMint,
                    },
                    {
                        name: 'defi-flend',
                        path: 'flend',
                        component: DefiFLend,
                    },
                    {
                        name: 'defi-ftrade',
                        path: 'ftrade',
                        component: DefiFTrade,
                    },

                    {
                        name: 'defi-manage-collateral',
                        path: 'fmint/manage-collateral',
                        component: DefiDepositFTM,
                    },
                    {
                        name: 'defi-manage-collateral-confirmation',
                        path: 'fmint/manage-collateral/confirmation',
                        component: DefiDepositFTMConfirmation,
                    },
                    {
                        name: 'defi-manage-collateral-transaction-success-message',
                        path: 'fmint/manage-collateral/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-manage-collateral-transaction-reject-message',
                        path: 'fmint/manage-collateral/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-borrow-fusd',
                        path: 'fmint/manage-fusd',
                        component: DefiBorrowFUSD,
                    },
                    {
                        name: 'defi-borrow-fusd-confirmation',
                        path: 'fmint/manage-fusd/confirmation',
                        component: DefiBorrowFUSDConfirmation,
                    },
                    {
                        name: 'defi-borrow-fusd-confirmation2',
                        path: 'fmint/manage-fusd/confirmation2',
                        component: DefiBorrowFUSDConfirmation,
                    },
                    {
                        name: 'defi-borrow-fusd-transaction-success-message',
                        path: 'fmint/manage-fusd/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-borrow-fusd-transaction-success-message2',
                        path: 'fmint/manage-fusd/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-borrow-fusd-transaction-reject-message',
                        path: 'fmint/manage-fusd/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-borrow-fusd-transaction-reject-message2',
                        path: 'fmint/manage-fusd/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-manage-borrow',
                        path: 'flend/manage-borrow',
                        component: DefiManageBorrow,
                    },
                    {
                        name: 'defi-manage-borrow-confirmation',
                        path: 'flend/manage-borrow/confirmation',
                        component: DefiManageBorrowConfirmation,
                    },
                    {
                        name: 'defi-manage-borrow-confirmation2',
                        path: 'flend/manage-borrow/confirmation2',
                        component: DefiManageBorrowConfirmation,
                    },
                    {
                        name: 'defi-manage-borrow-transaction-success-message',
                        path: 'fmint/manage-borrow/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-manage-borrow-transaction-success-message2',
                        path: 'flend/manage-borrow/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-manage-borrow-transaction-reject-message',
                        path: 'flend/manage-borrow/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-manage-borrow-transaction-reject-message2',
                        path: 'flend/manage-borrow/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-manage-deposit',
                        path: 'flend/manage-deposit',
                        component: DefiManageDeposit,
                    },
                    {
                        name: 'defi-manage-deposit-confirmation',
                        path: 'flend/manage-deposit/confirmation',
                        component: DefiManageDepositConfirmation,
                    },
                    {
                        name: 'defi-manage-deposit-confirmation2',
                        path: 'flend/manage-deposit/confirmation2',
                        component: DefiManageDepositConfirmation,
                    },
                    {
                        name: 'defi-manage-deposit-transaction-success-message',
                        path: 'fmint/manage-deposit/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-manage-deposit-transaction-success-message2',
                        path: 'flend/manage-deposit/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-manage-deposit-transaction-reject-message',
                        path: 'flend/manage-deposit/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-manage-deposit-transaction-reject-message2',
                        path: 'flend/manage-deposit/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-ftrade-confirmation',
                        path: 'ftrade/confirmation',
                        component: DefiFTradeConfirmation,
                    },
                    {
                        name: 'defi-ftrade-confirmation2',
                        path: 'ftrade/confirmation2',
                        component: DefiFTradeConfirmation,
                    },
                    {
                        name: 'defi-ftrade-transaction-success-message',
                        path: 'ftrade/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-ftrade-transaction-success-message2',
                        path: 'ftrade/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-ftrade-transaction-reject-message',
                        path: 'ftrade/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-ftrade-transaction-reject-message2',
                        path: 'ftrade/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },
                ],
            },
            {
                name: 'settings',
                path: '/settings',
                component: Settings,
            },
        ],
    },
    {
        name: 'playground',
        path: '/playground',
        component: Playground,
    },
    {
        name: 'not-found',
        path: '*',
        component: NotFound,
    },
];
