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
                        ],
                    },
                    {
                        id: 'defi-flend',
                        route: 'defi-flend',
                        _c: [
                            {
                                id: 'defi-manage-borrow-view',
                                route: 'defi-manage-borrow-view',
                            },
                        ],
                    },
                    {
                        id: 'defi-ftrade',
                        route: 'defi-ftrade',
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
