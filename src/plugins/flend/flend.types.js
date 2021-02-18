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
 * @property {DefiToken} [asset]
 */

/**
 * FLend reserve overview object.
 * @typedef {Object} FLendReserveOverview
 * @property {number} assetPrice
 * @property {string} assetPriceFormatted
 * @property {number} available
 * @property {number} availableFUSD
 * @property {string} availableFUSDFormatted
 * @property {number} liquidationPenalty
 * @property {number} liquidationTreshold
 * @property {number} maximumLTV
 * @property {number} reserveSize
 * @property {number} reserveSizeFUSD
 * @property {string} reserveSizeFUSDFormatted
 * @property {number} stableBorrowAPR
 * @property {boolean} stableBorrowing
 * @property {number} totalBorrowed
 * @property {number} totalBorrowedFUSD
 * @property {string} totalBorrowedFUSDFormatted
 * @property {number} totalSupply
 * @property {number} totalDeposited
 * @property {boolean} usedAsColllateral
 * @property {number} variableBorrowAPR
 */

/**
 * FLend reserve configuration data object.
 * @typedef {Object} FLendReserveConfigurationData
 * @property {boolean} borrowingEnabled Whether borrowing is enabled on the reserve
 * @property {number} decimals The decimals used by the reserve
 * @property {boolean} isActive Whether the reserve is active
 * @property {boolean} isFrozen Whether the reserve is frozen / disabled
 * @property {number} liquidationBonus The bonus awarded to liquidators
 * @property {number} liquidationThreshold The liquidation threshold of the reserve
 * @property {number} ltv The Loan To Value
 * @property {number} reserveFactor The reserve factor
 * @property {number} reserved
 * @property {boolean} stableBorrowRateEnabled Whether stable borrowing is enabled
 */

/**
 * FLend user overview object.
 * @typedef {Object} FLendUserOverview
 * @property {number} availableAssetBorrows
 * @property {number} availableBorrowsFUSD
 * @property {BigNumber} bBalance
 * @property {BigNumber} bDeposited
 * @property {BigNumber} bHealthFactor
 * @property {BigNumber} bStableBorrow
 * @property {BigNumber} bVariableBorrow
 * @property {number} balance
 * @property {string} configurationData
 * @property {number} currentLiquidationThreshold
 * @property {number} deposited
 * @property {number} ltv
 * @property {number} stableBorrow
 * @property {number} totalBorrowsFUSD
 * @property {number} totalCollateralFUSD
 * @property {number} variableBorrow
 */
