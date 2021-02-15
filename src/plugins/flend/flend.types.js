/**
 * FLend reserve object.
 * @typedef {Object} FLendReserve
 * @property {string} assetAddress Address of the asset
 * @property {number} ID Number in the reserveList() array
 * @property {string} configuration Bitmask encoded asset reserve configuration data
 * @property {string} liquidityIndex Liquidity index in ray
 * @property {string} variableBorrowIndex Variable borrow index in ray
 * @property {string} currentLiquidityRate Current supply / liquidity / deposit rate in ray
 * @property {string} currentVariableBorrowRate Current variable borrow rate in ray
 * @property {string} currentStableBorrowRate Current stable borrow rate in ray
 * @property {number} lastUpdateTimestamp Timestamp of when reserve data was last updated
 * @property {string} aTokenAddress Address of associated aToken (tokenised deposit)
 * @property {string} stableDebtTokenAddress Address of associated stable debt token
 * @property {string} variableDebtTokenAddress Address of associated variable debt token
 * @property {string} interestRateStrategyAddress Address of interest rate strategy
 * @property {ERC20Token} [asset]
 */
