import { Tree } from './utils/tree.js';

/**
 * App structure (incomplete) used for navigation and view transitions.
 *
 * @type {WalletAppStructureNode[]}
 */
const appStructure = [
    {
        id: 'wallet',
        route: 'wallet',
        _c: [
            {
                id: 'defi-home',
                route: 'defi-home',
                _c: [
                    {
                        id: 'defi-fmint',
                        route: 'defi-fmint',
                        _c: [
                            {
                                id: 'defi-lock',
                                route: 'defi-lock',
                                _c: [
                                    {
                                        id: 'defi-lock-confirmation',
                                        route: 'defi-lock-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-lock-transaction-success-message',
                                                route: 'defi-lock-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-lock-confirmation2',
                                                        route: 'defi-lock-confirmation2',
                                                        _c: [
                                                            {
                                                                id: 'defi-lock-transaction-success-message2',
                                                                route: 'defi-lock-transaction-success-message2',
                                                            },
                                                            {
                                                                id: 'defi-lock-transaction-reject-message2',
                                                                route: 'defi-lock-transaction-reject-message2',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'defi-lock-transaction-reject-message',
                                                route: 'defi-lock-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'defi-unlock',
                                route: 'defi-unlock',
                                _c: [
                                    {
                                        id: 'defi-unlock-confirmation',
                                        route: 'defi-unlock-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-unlock-transaction-success-message',
                                                route: 'defi-unlock-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-unlock-confirmation2',
                                                        route: 'defi-unlock-confirmation2',
                                                        _c: [
                                                            {
                                                                id: 'defi-unlock-transaction-success-message2',
                                                                route: 'defi-unlock-transaction-success-message2',
                                                            },
                                                            {
                                                                id: 'defi-unlock-transaction-reject-message2',
                                                                route: 'defi-unlock-transaction-reject-message2',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'defi-unlock-transaction-reject-message',
                                                route: 'defi-unlock-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'defi-lock-unlock',
                                route: 'defi-lock-unlock',
                                _c: [
                                    {
                                        id: 'defi-lock-unlock-confirmation',
                                        route: 'defi-lock-unlock-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-lock-unlock-transaction-success-message',
                                                route: 'defi-lock-unlock-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-lock-unlock-confirmation2',
                                                        route: 'defi-lock-unlock-confirmation2',
                                                        _c: [
                                                            {
                                                                id: 'defi-lock-unlock-transaction-success-message2',
                                                                route: 'defi-lock-unlock-transaction-success-message2',
                                                            },
                                                            {
                                                                id: 'defi-lock-unlock-transaction-reject-message2',
                                                                route: 'defi-lock-unlock-transaction-reject-message2',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'defi-lock-unlock-transaction-reject-message',
                                                route: 'defi-lock-unlock-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'defi-mint',
                                route: 'defi-mint',
                                _c: [
                                    {
                                        id: 'defi-mint-confirmation',
                                        route: 'defi-mint-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-mint-transaction-success-message',
                                                route: 'defi-mint-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-mint-confirmation2',
                                                        route: 'defi-mint-confirmation2',
                                                        _c: [
                                                            {
                                                                id: 'defi-mint-transaction-success-message2',
                                                                route: 'defi-mint-transaction-success-message2',
                                                            },
                                                            {
                                                                id: 'defi-mint-transaction-reject-message2',
                                                                route: 'defi-mint-transaction-reject-message2',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'defi-mint-transaction-reject-message',
                                                route: 'defi-mint-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'defi-repay',
                                route: 'defi-repay',
                                _c: [
                                    {
                                        id: 'defi-repay-confirmation',
                                        route: 'defi-repay-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-repay-transaction-success-message',
                                                route: 'defi-repay-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-repay-confirmation2',
                                                        route: 'defi-repay-confirmation2',
                                                        _c: [
                                                            {
                                                                id: 'defi-repay-transaction-success-message2',
                                                                route: 'defi-repay-transaction-success-message2',
                                                            },
                                                            {
                                                                id: 'defi-repay-transaction-reject-message2',
                                                                route: 'defi-repay-transaction-reject-message2',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'defi-repay-transaction-reject-message',
                                                route: 'defi-repay-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'defi-mint-repay',
                                route: 'defi-mint-repay',
                                _c: [
                                    {
                                        id: 'defi-mint-repay-confirmation',
                                        route: 'defi-mint-repay-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-mint-repay-transaction-success-message',
                                                route: 'defi-mint-repay-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-mint-repay-confirmation2',
                                                        route: 'defi-mint-repay-confirmation2',
                                                        _c: [
                                                            {
                                                                id: 'defi-mint-repay-transaction-success-message2',
                                                                route: 'defi-mint-repay-transaction-success-message2',
                                                            },
                                                            {
                                                                id: 'defi-mint-repay-transaction-reject-message2',
                                                                route: 'defi-mint-repay-transaction-reject-message2',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'defi-mint-repay-transaction-reject-message',
                                                route: 'defi-mint-repay-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'defi-fmint-claim-rewards-confirmation',
                                route: 'defi-fmint-claim-rewards-confirmation',
                                _c: [
                                    {
                                        id: 'defi-fmint-claim-rewards-transaction-success-message',
                                        route: 'defi-fmint-claim-rewards-transaction-success-message',
                                    },
                                    {
                                        id: 'defi-fmint-claim-rewards-transaction-reject-message',
                                        route: 'defi-fmint-claim-rewards-transaction-reject-message',
                                    },
                                ],
                            },
                            {
                                id: 'defi-fmint-push-rewards-confirmation',
                                route: 'defi-fmint-push-rewards-confirmation',
                                _c: [
                                    {
                                        id: 'defi-fmint-push-rewards-transaction-success-message',
                                        route: 'defi-fmint-push-rewards-transaction-success-message',
                                    },
                                    {
                                        id: 'defi-fmint-push-rewards-transaction-reject-message',
                                        route: 'defi-fmint-push-rewards-transaction-reject-message',
                                    },
                                ],
                            },
                            {
                                id: 'defi-manage-collateral',
                                route: 'defi-manage-collateral',
                                _c: [
                                    {
                                        id: 'defi-manage-collateral-confirmation',
                                        route: 'defi-manage-collateral-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-manage-collateral-transaction-success-message',
                                                route: 'defi-manage-collateral-transaction-success-message',
                                            },
                                            {
                                                id: 'defi-manage-collateral-transaction-reject-message',
                                                route: 'defi-manage-collateral-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'defi-borrow-fusd',
                                route: 'defi-borrow-fusd',
                                _c: [
                                    {
                                        id: 'defi-borrow-fusd-confirmation',
                                        route: 'defi-borrow-fusd-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-borrow-fusd-transaction-success-message',
                                                route: 'defi-borrow-fusd-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-borrow-fusd-confirmation2',
                                                        route: 'defi-borrow-fusd-confirmation2',
                                                        _c: [
                                                            {
                                                                id: 'defi-borrow-fusd-transaction-success-message2',
                                                                route: 'defi-borrow-fusd-transaction-success-message2',
                                                            },
                                                            {
                                                                id: 'defi-borrow-fusd-transaction-reject-message2',
                                                                route: 'defi-borrow-fusd-transaction-reject-message2',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'defi-borrow-fusd-transaction-reject-message',
                                                route: 'defi-borrow-fusd-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 'defi-flend',
                        route: 'defi-flend',
                        _c: [
                            {
                                id: 'defi-manage-borrow',
                                route: 'defi-manage-borrow',
                                _c: [
                                    {
                                        id: 'defi-manage-borrow-confirmation',
                                        route: 'defi-manage-borrow-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-manage-borrow-transaction-success-message',
                                                route: 'defi-manage-borrow-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-manage-borrow-confirmation2',
                                                        route: 'defi-manage-borrow-confirmation2',
                                                        _c: [
                                                            {
                                                                id: 'defi-manage-borrow-transaction-success-message2',
                                                                route:
                                                                    'defi-manage-borrow-transaction-success-message2',
                                                            },
                                                            {
                                                                id: 'defi-manage-borrow-transaction-reject-message2',
                                                                route: 'defi-manage-borrow-transaction-reject-message2',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'defi-manage-borrow-transaction-reject-message',
                                                route: 'defi-manage-borrow-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'defi-manage-deposit',
                                route: 'defi-manage-deposit',
                                _c: [
                                    {
                                        id: 'defi-manage-deposit-confirmation',
                                        route: 'defi-manage-deposit-confirmation',
                                        _c: [
                                            {
                                                id: 'defi-manage-deposit-transaction-success-message',
                                                route: 'defi-manage-deposit-transaction-success-message',
                                                _c: [
                                                    {
                                                        id: 'defi-manage-deposit-confirmation2',
                                                        route: 'defi-manage-deposit-confirmation2',
                                                        _c: [
                                                            {
                                                                id: 'defi-manage-deposit-transaction-success-message2',
                                                                route:
                                                                    'defi-manage-deposit-transaction-success-message2',
                                                            },
                                                            {
                                                                id: 'defi-manage-deposit-transaction-reject-message2',
                                                                route:
                                                                    'defi-manage-deposit-transaction-reject-message2',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'defi-manage-deposit-transaction-reject-message',
                                                route: 'defi-manage-deposit-transaction-reject-message',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 'defi-ftrade',
                        route: 'defi-ftrade',
                        _c: [
                            {
                                id: 'defi-ftrade-confirmation',
                                route: 'defi-ftrade-confirmation',
                                _c: [
                                    {
                                        id: 'defi-ftrade-transaction-success-message',
                                        route: 'defi-ftrade-transaction-success-message',
                                        _c: [
                                            {
                                                id: 'defi-ftrade-confirmation2',
                                                route: 'defi-ftrade-confirmation2',
                                                _c: [
                                                    {
                                                        id: 'defi-ftrade-transaction-success-message2',
                                                        route: 'defi-ftrade-transaction-success-message2',
                                                    },
                                                    {
                                                        id: 'defi-ftrade-transaction-reject-message2',
                                                        route: 'defi-ftrade-transaction-reject-message2',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        id: 'defi-ftrade-transaction-reject-message',
                                        route: 'defi-ftrade-transaction-reject-message',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'funiswap',
                route: 'funiswap',
                _c: [
                    {
                        id: 'funiswap-home',
                        route: 'funiswap-home',
                        _c: [
                            {
                                id: 'funiswap-swap-confirmation',
                                route: 'funiswap-swap-confirmation',
                                _c: [
                                    {
                                        id: 'funiswap-swap-transaction-success-message',
                                        route: 'funiswap-swap-transaction-success-message',
                                        _c: [
                                            {
                                                id: 'funiswap-swap-confirmation2',
                                                route: 'funiswap-swap-confirmation2',
                                                _c: [
                                                    {
                                                        id: 'funiswap-swap-transaction-success-message2',
                                                        route: 'funiswap-swap-transaction-success-message2',
                                                    },
                                                    {
                                                        id: 'funiswap-swap-transaction-reject-message2',
                                                        route: 'funiswap-swap-transaction-reject-message2',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        id: 'funiswap-swap-transaction-reject-message',
                                        route: 'funiswap-swap-transaction-reject-message',
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
