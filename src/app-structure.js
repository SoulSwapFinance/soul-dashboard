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
                        id: 'defi-mint',
                        route: 'defi-mint',
                    },
                ],
            },
        ],
    },
];

export const appStructureTree = new Tree(appStructure);
