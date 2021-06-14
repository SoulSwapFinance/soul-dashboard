import { Tree } from './utils/tree.js';

/**
 * App structure (incomplete) used for navigation and view transitions.
 *
 * @type {WalletAppStructureNode[]}
 */
const appStructure = [
    {
        id: 'wallet',
        _c: [
            {
                id: 'defi-fmint',
                _c: [
                    { id: 'defi-lock' },
                    { id: 'defi-unlock' },
                    {
                        id: 'defi-lock-unlock',
                        _c: [
                            {
                                id: 'defi-lock-unlock-confirmation',
                                component: 'defi-deposit-confirmation',
                                _c: [
                                    {
                                        id: 'defi-lock-unlock-transaction-success-message',
                                        component: 'transaction-success-message',
                                        _c: [
                                            {
                                                id: 'defi-lock-unlock-confirmation2',
                                                component: 'defi-deposit-confirmation',
                                                _c: [
                                                    {
                                                        id: 'defi-lock-unlock-transaction-success-message2',
                                                        component: 'transaction-success-message',
                                                    },
                                                    {
                                                        id: 'defi-lock-unlock-transaction-reject-message2',
                                                        component: 'transaction-reject-message',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        id: 'defi-lock-unlock-transaction-reject-message',
                                        component: 'transaction-reject-message',
                                    },
                                ],
                            },
                        ],
                    },
                    { id: 'defi-mint' },
                    { id: 'defi-repay' },
                    {
                        id: 'defi-mint-repay',
                        _c: [
                            {
                                id: 'defi-mint-repay-confirmation',
                                component: 'defi-borrow-confirmation',
                                _c: [
                                    {
                                        id: 'defi-mint-repay-transaction-success-message',
                                        component: 'transaction-success-message',
                                        _c: [
                                            {
                                                id: 'defi-mint-repay-confirmation2',
                                                component: 'defi-borrow-confirmation',
                                                _c: [
                                                    {
                                                        id: 'defi-mint-repay-transaction-success-message2',
                                                        component: 'transaction-success-message',
                                                    },
                                                    {
                                                        id: 'defi-mint-repay-transaction-reject-message2',
                                                        component: 'transaction-reject-message',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        id: 'defi-mint-repay-transaction-reject-message',
                                        component: 'transaction-reject-message',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 'defi-fmint-claim-rewards-confirmation',
                        component: 'defi-f-mint-claim-rewards-confirmation',
                        _c: [
                            {
                                id: 'defi-fmint-claim-rewards-transaction-success-message',
                                component: 'transaction-success-message',
                            },
                            {
                                id: 'defi-fmint-claim-rewards-transaction-reject-message',
                                component: 'transaction-reject-message',
                            },
                        ],
                    },
                    {
                        id: 'defi-fmint-push-rewards-confirmation',
                        component: 'defi-f-mint-push-rewards-confirmation',
                        _c: [
                            {
                                id: 'defi-fmint-push-rewards-transaction-success-message',
                                component: 'transaction-success-message',
                            },
                            {
                                id: 'defi-fmint-push-rewards-transaction-reject-message',
                                component: 'transaction-reject-message',
                            },
                        ],
                    },
                    {
                        id: 'defi-manage-collateral',
                        _c: [
                            {
                                id: 'defi-manage-collateral-confirmation',
                                _c: [
                                    { id: 'defi-manage-collateral-transaction-success-message' },
                                    { id: 'defi-manage-collateral-transaction-reject-message' },
                                ],
                            },
                        ],
                    },
                    {
                        id: 'defi-borrow-fusd',
                        _c: [
                            {
                                id: 'defi-borrow-fusd-confirmation',
                                _c: [
                                    {
                                        id: 'defi-borrow-fusd-transaction-success-message',
                                        _c: [
                                            {
                                                id: 'defi-borrow-fusd-confirmation2',
                                                _c: [
                                                    { id: 'defi-borrow-fusd-transaction-success-message2' },
                                                    { id: 'defi-borrow-fusd-transaction-reject-message2' },
                                                ],
                                            },
                                        ],
                                    },
                                    { id: 'defi-borrow-fusd-transaction-reject-message' },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'defi-ftrade',
                _c: [
                    {
                        id: 'defi-ftrade-confirmation',
                        _c: [
                            {
                                id: 'defi-ftrade-transaction-success-message',
                                _c: [
                                    {
                                        id: 'defi-ftrade-confirmation2',
                                        _c: [
                                            { id: 'defi-ftrade-transaction-success-message2' },
                                            { id: 'defi-ftrade-transaction-reject-message2' },
                                        ],
                                    },
                                ],
                            },
                            { id: 'defi-ftrade-transaction-reject-message' },
                        ],
                    },
                ],
            },
            /*{
                id: 'defi-home',
                _c: [
                    {
                        id: 'defi-flend',
                        _c: [
                            {
                                id: 'defi-manage-borrow',
                                _c: [
                                    {
                                        id: 'defi-manage-borrow-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-manage-borrow-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-manage-borrow-confirmation2',
                                                        _c: [
                                                            { id: 'defi-manage-borrow-transaction-success-message2' },
                                                            { id: 'defi-manage-borrow-transaction-reject-message2' },
                                                        ],
                                                    },
                                                ],
                                            },
                                            { id: 'defi-manage-borrow-transaction-reject-message' },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'defi-manage-deposit',
                                _c: [
                                    {
                                        id: 'defi-manage-deposit-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-manage-deposit-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-manage-deposit-confirmation2',
                                                        _c: [
                                                            { id: 'defi-manage-deposit-transaction-success-message2' },
                                                            { id: 'defi-manage-deposit-transaction-reject-message2' },
                                                        ],
                                                    },
                                                ],
                                            },
                                            { id: 'defi-manage-deposit-transaction-reject-message' },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },*/
            {
                id: 'funiswap',
                _c: [
                    {
                        id: 'swap',
                        _c: [
                            {
                                id: 'funiswap-swap',
                                _c: [
                                    {
                                        id: 'funiswap-swap-confirmation',
                                        _c: [
                                            {
                                                id: 'funiswap-swap-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'funiswap-swap-confirmation2',
                                                        _c: [
                                                            { id: 'funiswap-swap-transaction-success-message2' },
                                                            { id: 'funiswap-swap-transaction-reject-message2' },
                                                        ],
                                                    },
                                                ],
                                            },
                                            { id: 'funiswap-swap-transaction-reject-message' },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 'pools',
                        _c: [
                            {
                                id: 'funiswap-pools',
                                _c: [
                                    {
                                        id: 'funiswap-add-liquidity',
                                        _c: [
                                            {
                                                id: 'funiswap-add-liquidity-confirmation',
                                                _c: [
                                                    {
                                                        id: 'funiswap-add-liquidity-transaction-success-message',
                                                        _c: [
                                                            {
                                                                id: 'funiswap-add-liquidity-confirmation2',
                                                                _c: [
                                                                    {
                                                                        id:
                                                                            'funiswap-add-liquidity-transaction-success-message2',
                                                                        _c: [
                                                                            {
                                                                                id:
                                                                                    'funiswap-add-liquidity-confirmation3',
                                                                                _c: [
                                                                                    {
                                                                                        id:
                                                                                            'funiswap-add-liquidity-transaction-success-message3',
                                                                                    },
                                                                                    {
                                                                                        id:
                                                                                            'funiswap-add-liquidity-transaction-reject-message3',
                                                                                    },
                                                                                ],
                                                                            },
                                                                        ],
                                                                    },
                                                                    {
                                                                        id:
                                                                            'funiswap-add-liquidity-transaction-reject-message2',
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    { id: 'funiswap-add-liquidity-transaction-reject-message' },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        id: 'funiswap-remove-liquidity',
                                        _c: [
                                            {
                                                id: 'funiswap-remove-liquidity-confirmation',
                                                _c: [
                                                    {
                                                        id: 'funiswap-remove-liquidity-transaction-success-message',
                                                        _c: [
                                                            {
                                                                id: 'funiswap-remove-liquidity-confirmation2',
                                                                _c: [
                                                                    {
                                                                        id:
                                                                            'funiswap-remove-liquidity-transaction-success-message2',
                                                                    },
                                                                    {
                                                                        id:
                                                                            'funiswap-remove-liquidity-transaction-reject-message2',
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    { id: 'funiswap-remove-liquidity-transaction-reject-message' },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        id: 'funiswap-pair-detail',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'gov',
                _c: [
                    {
                        id: 'gov-home',
                        _c: [
                            {
                                id: 'gov-proposal-detail',
                                _c: [
                                    {
                                        id: 'gov-proposal-confirmation',
                                        _c: [
                                            {
                                                id: 'gov-proposal-transaction-success-message',
                                            },
                                            {
                                                id: 'gov-proposal-transaction-reject-message',
                                            },
                                        ],
                                    },
                                    {
                                        id: 'gov-cancel-vote-confirmation',
                                        _c: [
                                            {
                                                id: 'gov-cancel-vote-transaction-success-message',
                                            },
                                            {
                                                id: 'gov-cancel-vote-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

/** @type {Tree} */
export const appStructureTree = new Tree(appStructure);

export function getAppParentNode(_id) {
    const node = appStructureTree.get(_id);

    return node ? node._p : null;
}

export function getAppNodeParents(_id) {
    return appStructureTree.getParents(_id);
}
