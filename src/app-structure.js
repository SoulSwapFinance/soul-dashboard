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
        ],
    },
];

/** @type {Tree} */
export const appStructureTree = new Tree(appStructure);

export function getAppParentNode(_id) {
    const node = appStructureTree.get(_id);

    return node ? node._p : null;
}
