/**
 * MetamaskCurrency info object
 * @typedef {Object} MetamaskCurrency
 * @property {string} name
 * @property {string} symbol 2-6 characters long
 * @property {number} decimals 18
 */

/**
 * MetamaskChain info object
 * @typedef {Object} MetamaskChain
 * @property {string} chainId A 0x-prefixed hexadecimal string
 * @property {string} chainName
 * @property {MetamaskCurrency} nativeCurrency
 * @property {string[]} rpcUrls
 * @property {string[]} [blockExplorerUrls]
 * @property {string[]} [iconUrls] Currently ignored.
 */
