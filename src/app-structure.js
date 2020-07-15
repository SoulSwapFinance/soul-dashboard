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
                                    },
                                ],
                            },
                            {
                                id: 'defi-mint-repay',
                                route: 'defi-mint-repay',
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
