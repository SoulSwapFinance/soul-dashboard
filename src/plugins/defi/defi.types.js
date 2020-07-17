/**
 * DeFi settings object.
 * @typedef {Object} DefiSettings
 * @property {number} tradeFee4 Current fee applied to all direct trading operations.
 * @property {number} loanFee4 Current entry fee applied to all lending operations.
 * @property {number} minCollateralRatio4 Minimal collateral ratio.
 * @property {number} liqCollateralRatio4 Liquidation collateral ratio.
 */

/**
 * DeFi tokens object.
 * @typedef {Object} DefiToken
 * @property {string} address Address of the token is used as the token's unique identifier.
 * @property {string} name Name of the token.
 * @property {string} symbol Symbol used as an abbreviation for the token.
 * @property {string} logoUrl URL of the token logo image.
 * @property {number} decimals Decimals is the number of decimals the token supports.
 * @property {number} price Value of the token in ref. denomination (fUSD).
 * @property {number} priceDecimals Number of decimals used on the price field.
 * @property {boolean} isActive Signals if the token can be used in the DeFi functions at all.
 * @property {boolean} canDeposit Signals if the token can be used in deposit as a collateral asset.
 * @property {boolean} canBorrow Signals if the token is available for FLend borrow operations.
 * @property {boolean} canTrade Signals if the token is available for FTrade direct trading operations.
 */
