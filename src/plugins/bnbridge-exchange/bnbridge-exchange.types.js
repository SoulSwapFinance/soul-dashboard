/**
 * Token object.
 * @typedef {Object} BNBridgeToken
 * @property {boolean} bnb_to_eth_enabled
 * @property {boolean} eth_to_bnb_enabled
 * @property {boolean} btc_enabled
 * @property {boolean} ftm_enabled
 * @property {boolean} listed
 * @property {boolean} listing_proposed
 * @property {boolean} opera_enabled
 * @property {string} uuid
 * @property {string} name
 * @property {string} process_date
 * @property {string} symbol
 * @property {string} unique_symbol
 * @property {string} total_supply
 * @property {string} erc20_address
 * @property {string} eth_address
 * @property {string} fee_per_swap
 * @property {string} listing_proposal_uuid
 * @property {*} minimum_swap_amount
 */

/**
 * Direction of tokens swap.
 * @typedef {('OperaToBinance' | 'EthereumToBinance' | 'OperaToEthereum' | 'BinanceToOpera' | 'BinanceToEthereum' | 'EthereumToOpera')} BNBridgeDirection
 */

/**
 * BNB balances object.
 * @typedef {Object} BNBBalances
 * @property {number} balance
 * @property {number} pendingBalance
 */

/**
 * Object used as parameters of `BNBridgeExchange::finalizeSwapToken` method.
 * @typedef {Object} FSTRequest
 * @property {string} uuid
 * @property {BNBridgeDirection} direction
 * @property {string} memo
 * @property {BNBridgeToken} [token]
 */
