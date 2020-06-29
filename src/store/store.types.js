/**
 * Account object.
 * @typedef {Object} WalletAccount
 * @property {string} address
 * @property {string} name Custom name of the wallet.
 * @property {string} balance Hex number.
 * @property {string} totalBalance Hex number.
 * @property {string} pendingRewards Hex number.
 * @property {Object} keystore Keystore file.
 * @property {boolean} isLedgerAccount
 * @property {number} accountId Ledger account id.
 * @property {number} addressId Ledger address id.
 */

/**
 * Contact object.
 * @typedef {Object} WalletContact
 * @property {string} address
 * @property {string} name
 * @property {('fantom' | 'ethereum' | 'binance')} blockchain
 * @property {number} order Order in contact list. Index into contacts array.
 */
