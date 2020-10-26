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
import Playground from './views/Playground.vue';
import LedgerAccounts from './views/LedgerAccounts/LedgerAccounts.vue';
import AccountHistory from './views/AccountHistory/AccountHistory.vue';
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
import DefiLockUnlock from '@/views/DefiLockUnlock/DefiLockUnlock.vue';
import DefiLockUnlockConfirmation from '@/views/DefiLockUnlockConfirmation/DefiLockUnlockConfirmation.vue';
import DefiMintRepay from '@/views/DefiMintRepay/DefiMintRepay.vue';
import DefiMintRepayConfirmation from '@/views/DefiMintRepayConfirmation/DefiMintRepayConfirmation.vue';
import DefiLock from '@/views/DefiLock/DefiLock.vue';
import DefiLockConfirmation from '@/views/DefiLockConfirmation/DefiLockConfirmation.vue';
import DefiUnlock from '@/views/DefiUnlock/DefiUnlock.vue';
import DefiUnlockConfirmation from '@/views/DefiUnlockConfirmation/DefiUnlockConfirmation.vue';
import DefiMint from '@/views/DefiMint/DefiMint.vue';
import DefiRepay from '@/views/DefiRepay/DefiRepay.vue';
import DefiMintConfirmation from '@/views/DefiMintConfirmation/DefiMintConfirmation.vue';
import DefiRepayConfirmation from '@/views/DefiRepayConfirmation/DefiRepayConfirmation.vue';
import Staking from '@/views/Staking/Staking.vue';
import DefiFMintClaimRewardsConfirmation from '@/views/DefiFMintClaimRewardsConfirmation/DefiFMintClaimRewardsConfirmation.vue';
import DefiFMintPushRewardsConfirmation from '@/views/DefiFMintPushRewardsConfirmation/DefiFMintPushRewardsConfirmation.vue';
import AccountSendErc20 from '@/views/AccountSendErc20/AccountSendErc20.vue';
import FUniswap from '@/views/FUniswap/FUniswap.vue';
import FUniswapSwapConfirmation from '@/views/FUniswapSwapConfirmation/FUniswapSwapConfirmation.vue';
import FUniswapHome from '@/views/FUniswapHome/FUniswapHome.vue';
import FUniswapAddLiquidityConfirmation from '@/views/FUniswapAddLiquidityConfirmation/FUniswapAddLiquidityConfirmation.vue';
import FUniswapRemoveLiquidityConfirmation from '@/views/FUniswapRemoveLiquidityConfirmation/FUniswapRemoveLiquidityConfirmation.vue';
import EipSendTransaction from '@/views/EipSendTransaction/EipSendTransaction';
import Gov from '@/views/Gov/Gov.vue';
import GovHome from '@/views/GovHome/GovHome.vue';
import GovProposalDetail from '@/components/GovProposalDetail/GovProposalDetail.vue';

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
            {
                name: 'eip-send-transaction',
                path: '/eip-send-transaction',
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
                name: 'staking',
                path: '/staking/:address',
                component: Staking,
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
                        path: 'fswap',
                        component: DefiFTrade,
                    },

                    {
                        name: 'defi-lock',
                        path: 'fmint/lock',
                        component: DefiLock,
                    },
                    {
                        name: 'defi-lock-confirmation',
                        path: 'fmint/lock/confirmation',
                        component: DefiLockConfirmation,
                    },
                    {
                        name: 'defi-lock-confirmation2',
                        path: 'fmint/lock/confirmation2',
                        component: DefiLockConfirmation,
                    },
                    {
                        name: 'defi-lock-transaction-success-message',
                        path: 'fmint/lock/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-lock-transaction-success-message2',
                        path: 'fmint/lock/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-lock-transaction-reject-message',
                        path: 'fmint/lock/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-lock-transaction-reject-message2',
                        path: 'fmint/lock/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-unlock',
                        path: 'fmint/unlock',
                        component: DefiUnlock,
                    },
                    {
                        name: 'defi-unlock-confirmation',
                        path: 'fmint/unlock/confirmation',
                        component: DefiUnlockConfirmation,
                    },
                    {
                        name: 'defi-unlock-confirmation2',
                        path: 'fmint/unlock/confirmation2',
                        component: DefiUnlockConfirmation,
                    },
                    {
                        name: 'defi-unlock-transaction-success-message',
                        path: 'fmint/unlock/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-unlock-transaction-success-message2',
                        path: 'fmint/unlock/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-unlock-transaction-reject-message',
                        path: 'fmint/unlock/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-unlock-transaction-reject-message2',
                        path: 'fmint/unlock/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-lock-unlock',
                        path: 'fmint/lock-unlock',
                        component: DefiLockUnlock,
                    },
                    {
                        name: 'defi-lock-unlock-confirmation',
                        path: 'fmint/lock-unlock/confirmation',
                        component: DefiLockUnlockConfirmation,
                    },
                    {
                        name: 'defi-lock-unlock-confirmation2',
                        path: 'fmint/lock-unlock/confirmation2',
                        component: DefiLockUnlockConfirmation,
                    },
                    {
                        name: 'defi-lock-unlock-transaction-success-message',
                        path: 'fmint/lock-unlock/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-lock-unlock-transaction-success-message2',
                        path: 'fmint/lock-unlock/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-lock-unlock-transaction-reject-message',
                        path: 'fmint/lock-unlock/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-lock-unlock-transaction-reject-message2',
                        path: 'fmint/lock-unlock/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-mint',
                        path: 'fmint/mint',
                        component: DefiMint,
                    },
                    {
                        name: 'defi-mint-confirmation',
                        path: 'fmint/mint/confirmation',
                        component: DefiMintConfirmation,
                    },
                    {
                        name: 'defi-mint-confirmation2',
                        path: 'fmint/mint/confirmation2',
                        component: DefiMintConfirmation,
                    },
                    {
                        name: 'defi-mint-transaction-success-message',
                        path: 'fmint/mint/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-mint-transaction-success-message2',
                        path: 'fmint/mint/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-mint-transaction-reject-message',
                        path: 'fmint/mint/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-mint-transaction-reject-message2',
                        path: 'fmint/mint/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-repay',
                        path: 'fmint/repay',
                        component: DefiRepay,
                    },
                    {
                        name: 'defi-repay-confirmation',
                        path: 'fmint/repay/confirmation',
                        component: DefiRepayConfirmation,
                    },
                    {
                        name: 'defi-repay-confirmation2',
                        path: 'fmint/repay/confirmation2',
                        component: DefiRepayConfirmation,
                    },
                    {
                        name: 'defi-repay-transaction-success-message',
                        path: 'fmint/repay/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-repay-transaction-success-message2',
                        path: 'fmint/repay/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-repay-transaction-reject-message',
                        path: 'fmint/repay/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-repay-transaction-reject-message2',
                        path: 'fmint/repay/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-mint-repay',
                        path: 'fmint/mint-repay',
                        component: DefiMintRepay,
                    },
                    {
                        name: 'defi-mint-repay-confirmation',
                        path: 'fmint/mint-repay/confirmation',
                        component: DefiMintRepayConfirmation,
                    },
                    {
                        name: 'defi-mint-repay-confirmation2',
                        path: 'fmint/mint-repay/confirmation2',
                        component: DefiMintRepayConfirmation,
                    },
                    {
                        name: 'defi-mint-repay-transaction-success-message',
                        path: 'fmint/mint-repay/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-mint-repay-transaction-success-message2',
                        path: 'fmint/mint-repay/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-mint-repay-transaction-reject-message',
                        path: 'fmint/mint-repay/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-mint-repay-transaction-reject-message2',
                        path: 'fmint/mint-repay/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-fmint-claim-rewards-confirmation',
                        path: 'fmint/claim-rewards/confirmation',
                        component: DefiFMintClaimRewardsConfirmation,
                    },
                    {
                        name: 'defi-fmint-claim-rewards-transaction-success-message',
                        path: 'fmint/claim-rewards/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-fmint-claim-rewards-transaction-reject-message',
                        path: 'fmint/claim-rewards/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'defi-fmint-push-rewards-confirmation',
                        path: 'fmint/push-rewards/confirmation',
                        component: DefiFMintPushRewardsConfirmation,
                    },
                    {
                        name: 'defi-fmint-push-rewards-transaction-success-message',
                        path: 'fmint/push-rewards/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-fmint-push-rewards-transaction-reject-message',
                        path: 'fmint/push-rewards/confirmation/reject',
                        component: TransactionRejectMessageView,
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
                        path: 'fswap/confirmation',
                        component: DefiFTradeConfirmation,
                    },
                    {
                        name: 'defi-ftrade-confirmation2',
                        path: 'fswap/confirmation2',
                        component: DefiFTradeConfirmation,
                    },
                    {
                        name: 'defi-ftrade-transaction-success-message',
                        path: 'fswap/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-ftrade-transaction-success-message2',
                        path: 'fswap/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'defi-ftrade-transaction-reject-message',
                        path: 'fswap/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'defi-ftrade-transaction-reject-message2',
                        path: 'fswap/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },
                ],
            },
            {
                name: 'funiswap',
                path: '/funiswap/:address',
                component: FUniswap,
                children: [
                    {
                        name: 'funiswap-home',
                        path: '',
                        component: FUniswapHome,
                    },

                    {
                        name: 'funiswap-swap-confirmation',
                        path: 'swap/confirmation',
                        component: FUniswapSwapConfirmation,
                    },
                    {
                        name: 'funiswap-swap-confirmation2',
                        path: 'swap/confirmation2',
                        component: FUniswapSwapConfirmation,
                    },
                    {
                        name: 'funiswap-swap-transaction-success-message',
                        path: 'swap/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'funiswap-swap-transaction-success-message2',
                        path: 'swap/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'funiswap-swap-transaction-reject-message',
                        path: 'swap/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'funiswap-swap-transaction-reject-message2',
                        path: 'swap/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'funiswap-add-liquidity-confirmation',
                        path: 'add-liquidity/confirmation',
                        component: FUniswapAddLiquidityConfirmation,
                    },
                    {
                        name: 'funiswap-add-liquidity-confirmation2',
                        path: 'add-liquidity/confirmation2',
                        component: FUniswapAddLiquidityConfirmation,
                    },
                    {
                        name: 'funiswap-add-liquidity-confirmation3',
                        path: 'add-liquidity/confirmation3',
                        component: FUniswapAddLiquidityConfirmation,
                    },
                    {
                        name: 'funiswap-add-liquidity-transaction-success-message',
                        path: 'add-liquidity/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'funiswap-add-liquidity-transaction-success-message2',
                        path: 'add-liquidity/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'funiswap-add-liquidity-transaction-success-message3',
                        path: 'add-liquidity/confirmation3/success3',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'funiswap-add-liquidity-transaction-reject-message',
                        path: 'add-liquidity/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'funiswap-add-liquidity-transaction-reject-message2',
                        path: 'add-liquidity/confirmation2/reject2',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'funiswap-add-liquidity-transaction-reject-message3',
                        path: 'add-liquidity/confirmation3/reject3',
                        component: TransactionRejectMessageView,
                    },

                    {
                        name: 'funiswap-remove-liquidity-confirmation',
                        path: 'remove-liquidity/confirmation',
                        component: FUniswapRemoveLiquidityConfirmation,
                    },
                    {
                        name: 'funiswap-remove-liquidity-confirmation2',
                        path: 'remove-liquidity/confirmation2',
                        component: FUniswapRemoveLiquidityConfirmation,
                    },
                    {
                        name: 'funiswap-remove-liquidity-transaction-success-message',
                        path: 'remove-liquidity/confirmation/success',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'funiswap-remove-liquidity-transaction-success-message2',
                        path: 'remove-liquidity/confirmation2/success2',
                        component: TransactionSuccessMessageView,
                    },
                    {
                        name: 'funiswap-remove-liquidity-transaction-reject-message',
                        path: 'remove-liquidity/confirmation/reject',
                        component: TransactionRejectMessageView,
                    },
                    {
                        name: 'funiswap-remove-liquidity-transaction-reject-message2',
                        path: 'remove-liquidity/confirmation2/reject2',
                        component: TransactionRejectMessageView,
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
                        path: 'proposal-detail',
                        component: GovProposalDetail,
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
