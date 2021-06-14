import NotFound from './views/NotFound/NotFound.vue';
import Home from './views/Home/Home.vue';
import Welcome from './views/Welcome/Welcome.vue';
import CreateAccount from './views/CreateAccount/CreateAccount.vue';
import RestoreAccount from './views/RestoreAccount/RestoreAccount.vue';
import Account from './views/Account/Account.vue';
import Dashboard from './views/Dashboard/Dashboard.vue';
import AccountSend from './views/AccountSend.vue';
import AccountReceive from './views/AccountReceive.vue';
// import AccountStake from './views/AccountStake.vue';
import LedgerAccounts from './views/LedgerAccounts/LedgerAccounts.vue';
import AccountHistory from './views/AccountHistory/AccountHistory.vue';
import Settings from './views/Settings/Settings.vue';
import Wallet from './views/Wallet/Wallet.vue';
import DefiFMint from './views/DefiFMint/DefiFMint.vue';
import DefiDepositFTM from './views/DefiDepositFTM/DefiDepositFTM.vue';
import DefiBorrowFUSD from './views/DefiBorrowFUSD/DefiBorrowFUSD.vue';
import DefiDepositFTMConfirmation from './views/DefiDepositFTMConfirmation/DefiDepositFTMConfirmation.vue';
import TransactionSuccessMessageView from './views/TransactionSuccessMessageView/TransactionSuccessMessageView.vue';
import TransactionRejectMessageView from './views/TransactionRejectMessageView/TransactionRejectMessageView.vue';
import DefiBorrowFUSDConfirmation from './views/DefiBorrowFUSDConfirmation/DefiBorrowFUSDConfirmation.vue';
import DefiFTrade from './views/DefiFTrade/DefiFTrade.vue';
import DefiFTradeConfirmation from './views/DefiFTradeConfirmation/DefiFTradeConfirmation.vue';
import DefiLockUnlock from '@/views/DefiLockUnlock/DefiLockUnlock.vue';
import DefiLockUnlockConfirmation from '@/views/DefiLockUnlockConfirmation/DefiLockUnlockConfirmation.vue';
import DefiMintRepay from '@/views/DefiMintRepay/DefiMintRepay.vue';
import DefiMintRepayConfirmation from '@/views/DefiMintRepayConfirmation/DefiMintRepayConfirmation.vue';
import DefiLock from '@/views/DefiLock/DefiLock.vue';
import DefiUnlock from '@/views/DefiUnlock/DefiUnlock.vue';
import DefiMint from '@/views/DefiMint/DefiMint.vue';
import DefiRepay from '@/views/DefiRepay/DefiRepay.vue';
import Staking from '@/views/Staking/Staking.vue';
import DefiFMintClaimRewardsConfirmation from '@/views/DefiFMintClaimRewardsConfirmation/DefiFMintClaimRewardsConfirmation.vue';
import DefiFMintPushRewardsConfirmation from '@/views/DefiFMintPushRewardsConfirmation/DefiFMintPushRewardsConfirmation.vue';
import AccountSendErc20 from '@/views/AccountSendErc20/AccountSendErc20.vue';
import FUniswap from '@/views/funi/FUniswap/FUniswap.vue';
import FUniswapSwapConfirmation from '@/views/funi/FUniswapSwapConfirmation/FUniswapSwapConfirmation.vue';
import FUniswapAddLiquidityConfirmation from '@/views/funi/FUniswapAddLiquidityConfirmation/FUniswapAddLiquidityConfirmation.vue';
import FUniswapRemoveLiquidityConfirmation from '@/views/funi/FUniswapRemoveLiquidityConfirmation/FUniswapRemoveLiquidityConfirmation.vue';
import Eip from '@/views/Eip/Eip';
import EipWelcome from '@/views/EipWelcome/EipWelcome';
import EipSendTransaction from '@/views/EipSendTransaction/EipSendTransaction';
import EipSelectAccounts from '@/views/EipSelectAccounts/EipSelectAccounts';
import Swap from '@/views/Swap/Swap.vue';
import FUniswapSwap from '@/components/funi/FUniswapSwap/FUniswapSwap.vue';
import Pools from '@/views/Pools/Pools.vue';
import FUniswapPools from '@/components/funi/FUniswapPools/FUniswapPools.vue';
import FUniswapAddLiquidity from '@/components/funi/FUniswapAddLiquidity/FUniswapAddLiquidity.vue';
import AddLiquidity from '@/views/AddLiquidity/AddLiquidity.vue';
import FUniswapRemoveLiquidity from '@/components/funi/FUniswapRemoveLiquidity/FUniswapRemoveLiquidity.vue';
import RemoveLiquidity from '@/views/RemoveLiquidity/RemoveLiquidity.vue';
import Gov from '@/views/Gov/Gov.vue';
import GovHome from '@/views/GovHome/GovHome.vue';
import GovProposalDetail from '@/components/GovProposalDetail/GovProposalDetail.vue';
import GovProposalConfirmation from '@/components/GovProposalConfirmation/GovProposalConfirmation.vue';
import GovCancelVoteConfirmation from '@/components/GovCancelVoteConfirmation/GovCancelVoteConfirmation.vue';
import FUniswapPairDetail from '@/components/funi/FUniswapPairDetail/FUniswapPairDetail.vue';
import FMint from '@/views/FMint/FMint.vue';
import FSwap from '@/views/FSwap/FSwap.vue';

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
        name: 'eip',
        path: '/',
        component: Eip,
        children: [
            {
                name: 'eip-welcome',
                path: '/eip-welcome',
                component: EipWelcome,
            },
            {
                name: 'eip-select-accounts',
                path: '/eip-select-accounts/:site',
                component: EipSelectAccounts,
            },
            {
                name: 'eip-send-transaction',
                path: '/eip-send-transaction/:id',
                component: EipSendTransaction,
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
                        name: 'account-send-erc20',
                        path: 'send',
                        component: AccountSendErc20,
                        meta: { dontScrollToTop: true },
                    },
                    {
                        name: 'account-receive',
                        path: 'receive',
                        component: AccountReceive,
                        meta: { dontScrollToTop: true },
                    },
                    /*
                    {
                        name: 'account-stake',
                        path: 'stake',
                        component: AccountStake,
                        meta: { dontScrollToTop: true },
                    },
                    */
                ],
            },
            {
                name: 'dashboard',
                path: '/dashboard',
                component: Dashboard,
            },
            {
                name: 'staking',
                path: '/staking/:address',
                component: Staking,
            },
            {
                name: 'fmint',
                path: '/fmint/:address',
                component: FMint,
                children: [
                    {
                        name: 'defi-fmint',
                        path: '',
                        component: DefiFMint,
                    },
                    {
                        name: 'defi-lock',
                        path: 'lock',
                        component: DefiLock,
                    },

                    {
                        name: 'defi-unlock',
                        path: 'unlock',
                        component: DefiUnlock,
                    },

                    {
                        name: 'defi-lock-unlock',
                        path: 'lock-unlock',
                        component: DefiLockUnlock,
                    },
                    {
                        name: 'defi-lock-unlock-confirmation',
                        path: 'lock-unlock/confirmation',
                        component: DefiLockUnlockConfirmation,
                    },
                    {
                        name: 'defi-lock-unlock-confirmation2',
                        path: 'lock-unlock/confirmation2',
                        component: DefiLockUnlockConfirmation,
                    },
                    {
                        name: 'defi-lock-unlock-transaction-success-message',
                        path: 'lock-unlock/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-lock-unlock-transaction-success-message2',
                        path: 'lock-unlock/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-lock-unlock-transaction-reject-message',
                        path: 'lock-unlock/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-lock-unlock-transaction-reject-message2',
                        path: 'lock-unlock/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-mint',
                        path: 'mint',
                        component: DefiMint,
                    },

                    {
                        name: 'defi-repay',
                        path: 'repay',
                        component: DefiRepay,
                    },

                    {
                        name: 'defi-mint-repay',
                        path: 'mint-repay',
                        component: DefiMintRepay,
                    },
                    {
                        name: 'defi-mint-repay-confirmation',
                        path: 'mint-repay/confirmation',
                        component: DefiMintRepayConfirmation,
                    },
                    {
                        name: 'defi-mint-repay-confirmation2',
                        path: 'mint-repay/confirmation2',
                        component: DefiMintRepayConfirmation,
                    },
                    {
                        name: 'defi-mint-repay-transaction-success-message',
                        path: 'mint-repay/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-mint-repay-transaction-success-message2',
                        path: 'mint-repay/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-mint-repay-transaction-reject-message',
                        path: 'mint-repay/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-mint-repay-transaction-reject-message2',
                        path: 'mint-repay/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-fmint-claim-rewards-confirmation',
                        path: 'claim-rewards/confirmation',
                        component: DefiFMintClaimRewardsConfirmation,
                    },

                    {
                        name: 'defi-fmint-push-rewards-confirmation',
                        path: 'push-rewards/confirmation',
                        component: DefiFMintPushRewardsConfirmation,
                    },

                    {
                        name: 'defi-manage-collateral',
                        path: 'manage-collateral',
                        component: DefiDepositFTM,
                    },
                    {
                        name: 'defi-manage-collateral-confirmation',
                        path: 'manage-collateral/confirmation',
                        component: DefiDepositFTMConfirmation,
                    },
                    {
                        name: 'defi-manage-collateral-transaction-success-message',
                        path: 'manage-collateral/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-manage-collateral-transaction-reject-message',
                        path: 'manage-collateral/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-borrow-fusd',
                        path: 'manage-fusd',
                        component: DefiBorrowFUSD,
                    },
                    {
                        name: 'defi-borrow-fusd-confirmation',
                        path: 'manage-fusd/confirmation',
                        component: DefiBorrowFUSDConfirmation,
                    },
                    {
                        name: 'defi-borrow-fusd-confirmation2',
                        path: 'manage-fusd/confirmation2',
                        component: DefiBorrowFUSDConfirmation,
                    },
                    {
                        name: 'defi-borrow-fusd-transaction-success-message',
                        path: 'manage-fusd/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-borrow-fusd-transaction-success-message2',
                        path: 'manage-fusd/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-borrow-fusd-transaction-reject-message',
                        path: 'manage-fusd/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-borrow-fusd-transaction-reject-message2',
                        path: 'manage-fusd/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },
                ],
            },
            {
                name: 'fswap',
                path: '/fswap/:address',
                component: FSwap,
                children: [
                    {
                        name: 'defi-ftrade',
                        path: '',
                        component: DefiFTrade,
                    },

                    {
                        name: 'defi-ftrade-confirmation',
                        path: 'confirmation',
                        component: DefiFTradeConfirmation,
                    },
                    {
                        name: 'defi-ftrade-confirmation2',
                        path: 'confirmation2',
                        component: DefiFTradeConfirmation,
                    },
                    {
                        name: 'defi-ftrade-transaction-success-message',
                        path: 'confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-ftrade-transaction-success-message2',
                        path: 'confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-ftrade-transaction-reject-message',
                        path: 'confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-ftrade-transaction-reject-message2',
                        path: 'confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },
                ],
            },
            /*{
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
                        name: 'defi-flend',
                        path: 'flend',
                        component: DefiFLend,
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
                        path: 'flend/manage-borrow/confirmation/success',
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
                        path: 'flend/manage-deposit/confirmation/success',
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
                ],
            },*/
            {
                name: 'funiswap',
                path: '/funi/:address',
                component: FUniswap,
                children: [
                    {
                        name: 'swap',
                        path: 'swap/:tokena?/:tokenb?',
                        component: Swap,
                        children: [
                            {
                                name: 'funiswap-swap',
                                path: '',
                                component: FUniswapSwap,
                            },
                            {
                                name: 'funiswap-swap-confirmation',
                                path: 'confirmation',
                                component: FUniswapSwapConfirmation,
                            },
                            {
                                name: 'funiswap-swap-confirmation2',
                                path: 'confirmation2',
                                component: FUniswapSwapConfirmation,
                            },
                            {
                                name: 'funiswap-swap-transaction-success-message',
                                path: 'confirmation/success',
                                component: TransactionSuccessMessageView,
                            },
                            {
                                name: 'funiswap-swap-transaction-success-message2',
                                path: 'confirmation2/success2',
                                component: TransactionSuccessMessageView,
                            },
                            {
                                name: 'funiswap-swap-transaction-reject-message',
                                path: 'confirmation/reject',
                                component: TransactionRejectMessageView,
                            },
                            {
                                name: 'funiswap-swap-transaction-reject-message2',
                                path: 'confirmation2/reject2',
                                component: TransactionRejectMessageView,
                            },
                        ],
                    },
                    {
                        name: 'pools',
                        path: 'pools',
                        component: Pools,
                        children: [
                            {
                                name: 'funiswap-pools',
                                path: '',
                                component: FUniswapPools,
                            },
                            {
                                name: 'add-liquidity',
                                path: 'add/:tokena?/:tokenb?',
                                component: AddLiquidity,
                                children: [
                                    {
                                        name: 'funiswap-add-liquidity',
                                        path: '',
                                        component: FUniswapAddLiquidity,
                                    },
                                    {
                                        name: 'funiswap-add-liquidity-confirmation',
                                        path: 'confirmation',
                                        component: FUniswapAddLiquidityConfirmation,
                                    },
                                    {
                                        name: 'funiswap-add-liquidity-confirmation2',
                                        path: 'confirmation2',
                                        component: FUniswapAddLiquidityConfirmation,
                                    },
                                    {
                                        name: 'funiswap-add-liquidity-confirmation3',
                                        path: 'confirmation3',
                                        component: FUniswapAddLiquidityConfirmation,
                                    },
                                    {
                                        name: 'funiswap-add-liquidity-transaction-success-message',
                                        path: 'confirmation/success',
                                        component: TransactionSuccessMessageView,
                                    },
                                    {
                                        name: 'funiswap-add-liquidity-transaction-success-message2',
                                        path: 'confirmation2/success2',
                                        component: TransactionSuccessMessageView,
                                    },
                                    {
                                        name: 'funiswap-add-liquidity-transaction-success-message3',
                                        path: 'confirmation3/success3',
                                        component: TransactionSuccessMessageView,
                                    },
                                    {
                                        name: 'funiswap-add-liquidity-transaction-reject-message',
                                        path: 'confirmation/reject',
                                        component: TransactionRejectMessageView,
                                    },
                                    {
                                        name: 'funiswap-add-liquidity-transaction-reject-message2',
                                        path: 'confirmation2/reject2',
                                        component: TransactionRejectMessageView,
                                    },
                                    {
                                        name: 'funiswap-add-liquidity-transaction-reject-message3',
                                        path: 'confirmation3/reject3',
                                        component: TransactionRejectMessageView,
                                    },
                                ],
                            },
                            {
                                name: 'remove-liquidity',
                                path: 'remove/:tokena?/:tokenb?',
                                component: RemoveLiquidity,
                                children: [
                                    {
                                        name: 'funiswap-remove-liquidity',
                                        path: '',
                                        component: FUniswapRemoveLiquidity,
                                    },
                                    {
                                        name: 'funiswap-remove-liquidity-confirmation',
                                        path: 'confirmation',
                                        component: FUniswapRemoveLiquidityConfirmation,
                                    },
                                    {
                                        name: 'funiswap-remove-liquidity-confirmation2',
                                        path: 'confirmation2',
                                        component: FUniswapRemoveLiquidityConfirmation,
                                    },
                                    {
                                        name: 'funiswap-remove-liquidity-transaction-success-message',
                                        path: 'confirmation/success',
                                        component: TransactionSuccessMessageView,
                                    },
                                    {
                                        name: 'funiswap-remove-liquidity-transaction-success-message2',
                                        path: 'confirmation2/success2',
                                        component: TransactionSuccessMessageView,
                                    },
                                    {
                                        name: 'funiswap-remove-liquidity-transaction-reject-message',
                                        path: 'confirmation/reject',
                                        component: TransactionRejectMessageView,
                                    },
                                    {
                                        name: 'funiswap-remove-liquidity-transaction-reject-message2',
                                        path: 'confirmation2/reject2',
                                        component: TransactionRejectMessageView,
                                    },
                                ],
                            },
                            {
                                name: 'funiswap-pair-detail',
                                path: 'pair/:pairAddress',
                                component: FUniswapPairDetail,
                            },
                        ],
                    },
                ],
            },
            {
                name: 'gov',
                path: '/gov/:address',
                component: Gov,
                children: [
                    {
                        name: 'gov-home',
                        path: '',
                        component: GovHome,
                    },
                    {
                        name: 'gov-proposal-detail',
                        path: 'proposal-detail/:proposalId?/:governanceId?',
                        component: GovProposalDetail,
                    },
                    {
                        name: 'gov-proposal-confirmation',
                        path: 'proposal-detail/:proposalId?/:governanceId?/confirmation',
                        component: GovProposalConfirmation,
                    },
                    {
                        name: 'gov-proposal-transaction-success-message',
                        path: 'proposal-detail/:proposalId?/:governanceId?/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'gov-proposal-transaction-reject-message',
                        path: 'proposal-detail/:proposalId?/:governanceId?/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'gov-cancel-vote-confirmation',
                        path: 'proposal-detail/:proposalId?/:governanceId?/confirmation',
                        component: GovCancelVoteConfirmation,
                    },
                    {
                        name: 'gov-cancel-vote-transaction-success-message',
                        path: 'proposal-detail/:proposalId?/:governanceId?/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'gov-cancel-vote-transaction-reject-message',
                        path: 'proposal-detail/:proposalId?/:governanceId?/confirmation/reject',
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
        name: 'not-found',
        path: '*',
        component: NotFound,
    },
];
