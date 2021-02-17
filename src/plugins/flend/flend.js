import './flend.types.js';
import gql from 'graphql-tag';
import { cloneObject } from '@/utils';
import { BigNumber } from 'bignumber.js';
import web3utils from 'web3-utils';
import { bFromWei, toBigNumber } from '@/utils/bignumber.js';
import { defi } from '../defi/defi.js';
import { formatNumberByLocale } from '@/filters.js';
// import { fFetch } from '@/plugins/ffetch.js';

export const RAYP = 27;
export const RAY = toBigNumber(10).pow(RAYP);

/** @type {FLend} */
export let flend = null;

/**
 * Plugin for various FLend requests and calculations.
 */
export class FLend {
    /**
     * @param {Vue} _Vue
     * @param {{apolloClient: ApolloClient}} _options
     */
    static install(_Vue, _options) {
        if (!flend) {
            flend = new FLend(_options);
            _Vue.prototype.$flend = flend;
        }
    }

    /**
     * @param {{apolloClient: ApolloClient}} _options
     */
    constructor(_options) {
        this.apolloClient = _options.apolloClient;
        /** Addresses of various contracts. */
        this.contracts = {
            lendingPool: '0x42bA5A1C2bdc4b3C0aCFDf69DFFaF326C446022E',
        };
        /** Referral code for referral program (https://docs.aave.com/developers/referral-program). */
        this.referralCode = '0';
    }

    /**
     * @param {string} _assetAddress
     * @param {string} [_ownerAddress]
     * @param {string} [_fetchPolicy]
     * @return {Promise<[FLendReserve]|[]>}
     */
    async fetchReserveWithERC20Info(_assetAddress, _ownerAddress = '', _fetchPolicy = 'network-only') {
        const data = await Promise.all([
            this.fetchReserve(_assetAddress, _fetchPolicy),
            this.fetchDefiTokens(_ownerAddress, _fetchPolicy),
        ]);
        /** @type {FLendReserve} */
        const reserve = data[0];
        /** @type {ERC20Token[]} */
        const erc20Tokens = data[1];

        if (reserve.assetAddress && erc20Tokens.length > 0) {
            /** @type {ERC20Token} */
            const erc20Token = erc20Tokens.find((_token) => _token.address === reserve.assetAddress);

            if (erc20Token) {
                reserve.asset = cloneObject(erc20Token);
            }
        }

        return reserve;
    }

    /**
     * @param {string} [_ownerAddress]
     * @param {string} [_fetchPolicy]
     * @return {Promise<[FLendReserve]|[]>}
     */
    async fetchReservesWithERC20Info(_ownerAddress = '', _fetchPolicy = 'network-only') {
        const data = await Promise.all([
            this.fetchReserves(_fetchPolicy),
            this.fetchDefiTokens(_ownerAddress, _fetchPolicy),
        ]);
        const reserves = data[0];
        const erc20Tokens = data[1];

        if (reserves.length > 0) {
            erc20Tokens.forEach((_token) => {
                const reserve = reserves.find((_reserve) => _reserve.assetAddress === _token.address);

                if (reserve) {
                    reserve.asset = cloneObject(_token);
                }
            });
        }

        return reserves;
    }

    /**
     * @param {string} _assetAddress
     * @param {string} [_fetchPolicy]
     * @return {Promise<FLendReserve>}
     */
    async fetchReserve(_assetAddress, _fetchPolicy = 'network-only') {
        console.log(_assetAddress);
        const data = await this.apolloClient.query({
            query: gql`
                query GetReserveData($address: Address!) {
                    fLendLendingPool {
                        reserveData(address: $address) {
                            assetAddress
                            ID
                            configuration
                            liquidityIndex
                            variableBorrowIndex
                            currentLiquidityRate
                            currentVariableBorrowRate
                            currentStableBorrowRate
                            lastUpdateTimestamp
                            aTokenAddress
                            stableDebtTokenAddress
                            variableDebtTokenAddress
                            interestRateStrategyAddress
                        }
                    }
                }
            `,
            variables: {
                address: _assetAddress,
            },
            fetchPolicy: _fetchPolicy,
        });

        return data.data.fLendLendingPool.reserveData || {};
    }

    /**
     * @return {Promise<[FLendReserve]|[]>}
     */
    async fetchReserves(_fetchPolicy = 'network-only') {
        const data = await this.apolloClient.query({
            query: gql`
                query GetFLendLendingPool {
                    fLendLendingPool {
                        reserveDataList {
                            assetAddress
                            ID
                            configuration
                            liquidityIndex
                            variableBorrowIndex
                            currentLiquidityRate
                            currentVariableBorrowRate
                            currentStableBorrowRate
                            lastUpdateTimestamp
                            aTokenAddress
                            stableDebtTokenAddress
                            variableDebtTokenAddress
                            interestRateStrategyAddress
                        }
                    }
                }
            `,
            fetchPolicy: _fetchPolicy,
        });

        return data.data.fLendLendingPool.reserveDataList || [];
    }

    /**
     * @param {string} _ownerAddress
     * @param {string} [_fetchPolicy]
     * @return {Promise<ERC20Token[]>}
     */
    async fetchUserData(_ownerAddress, _fetchPolicy = 'network-only') {
        const query = {
            query: gql`
                query UserAccountData($address: Address!) {
                    fLendLendingPool {
                        userAccountData(address: $address) {
                            totalCollateralFUSD
                            totalDebtFUSD
                            availableBorrowsFUSD
                            currentLiquidationThreshold
                            ltv
                            healthFactor
                            configurationData
                        }
                    }
                }
            `,
            variables: {
                address: _ownerAddress,
            },
            fetchPolicy: _fetchPolicy,
        };
        const data = await this.apolloClient.query(query);

        return data.data.fLendLendingPool.userAccountData || {};
    }

    /**
     * @param {string} _ownerAddress
     * @param {string} _assetAddress
     * @param {string} [_fetchPolicy]
     * @return {Promise<ERC20Token[]>}
     */
    async fetchUserDeposits(_ownerAddress, _assetAddress, _fetchPolicy = 'network-only') {
        const query = {
            query: gql`
                query UserAccountData($address: Address, $asset: Address) {
                    fLendLendingPool {
                        userDepositHistory(address: $address, asset: $asset) {
                            assetAddress
                            userAddress
                            onBehalfOfAddress
                            amount
                            referalCode
                            timestamp
                        }
                    }
                }
            `,
            variables: {
                address: _ownerAddress,
                asset: _assetAddress,
            },
            fetchPolicy: _fetchPolicy,
        };
        const data = await this.apolloClient.query(query);

        return data.data.fLendLendingPool.userDepositHistory || [];
    }

    /**
     * @param {string} [_ownerAddress]
     * @param {string} [_fetchPolicy]
     * @return {Promise<ERC20Token[]>}
     */
    async fetchERC20Tokens(_ownerAddress, _fetchPolicy = 'network-only') {
        const query = {
            query: _ownerAddress
                ? gql`
                      query ERC20TokenList($owner: Address!) {
                          erc20TokenList {
                              address
                              name
                              symbol
                              decimals
                              totalSupply
                              logoURL
                              balanceOf(owner: $owner)
                          }
                      }
                  `
                : gql`
                      query ERC20TokenList {
                          erc20TokenList {
                              address
                              name
                              symbol
                              decimals
                              totalSupply
                              logoURL
                          }
                      }
                  `,
            variables: {
                owner: _ownerAddress,
            },
            fetchPolicy: _fetchPolicy,
        };
        const data = await this.apolloClient.query(query);

        return data.data.erc20TokenList || [];
    }

    /**
     * @param {string} [_ownerAddress]
     * @param {string} [_fetchPolicy]
     * @return {Promise<ERC20Token[]>}
     */
    async fetchDefiTokens(_ownerAddress, _fetchPolicy = 'network-only') {
        const query = {
            query: _ownerAddress
                ? gql`
                      query DefiTokens($owner: Address!) {
                          defiTokens {
                              address
                              name
                              symbol
                              logoUrl
                              decimals
                              price
                              priceDecimals
                              totalSupply
                              isActive
                              canWrapFTM
                              canDeposit
                              canMint
                              canBorrow
                              canTrade
                              availableBalance(owner: $owner)
                              allowance(owner: $owner)
                          }
                      }
                  `
                : gql`
                      query DefiTokens {
                          defiTokens {
                              address
                              name
                              symbol
                              logoUrl
                              decimals
                              price
                              priceDecimals
                              totalSupply
                              isActive
                              canWrapFTM
                              canDeposit
                              canMint
                              canBorrow
                              canTrade
                          }
                      }
                  `,
            variables: {
                owner: _ownerAddress,
            },
            fetchPolicy: _fetchPolicy,
        };
        const data = await this.apolloClient.query(query);

        return data.data.defiTokens || [];
    }

    /**
     * @param {string} _ownerAddress
     * @param {string} _assetAddress
     * @param {string} [_fetchPolicy]
     * @return {Promise<ERC20Token[]>}
     */
    async fetchERC20TokenBalance(_ownerAddress, _assetAddress, _fetchPolicy = 'network-only') {
        const query = {
            query: gql`
                query UserAccountData($owner: Address!, $token: Address!) {
                    ercTokenBalance(owner: $owner, token: $token)
                }
            `,
            variables: {
                owner: _ownerAddress,
                token: _assetAddress,
            },
            fetchPolicy: _fetchPolicy,
        };
        const data = await this.apolloClient.query(query);

        return data.data.ercTokenBalance || [];
    }

    /**
     * @param {string} [_tokenAddress]
     * @param {string} [_fetchPolicy]
     * @return {Promise<ERC20Token[]>}
     */
    async fetchERC20TotalSupply(_tokenAddress, _fetchPolicy = 'network-only') {
        const query = {
            query: gql`
                query ERC20TokenTotalSupply($token: Address!) {
                    ercTotalSupply(token: $token)
                }
            `,
            variables: {
                token: _tokenAddress,
            },
            fetchPolicy: _fetchPolicy,
        };
        const data = await this.apolloClient.query(query);

        return data.data.ercTotalSupply || '';
    }

    async fetchERC20TotalSupplies(_tokenAdresses) {
        return await Promise.all(_tokenAdresses.map((_tokenAddress) => this.fetchERC20TotalSupply(_tokenAddress)));
    }

    /**
     * @param {FLendReserve} _reserve
     * @return {Promise<BigNumber>}
     */
    async fetchTotalBorrowed(_reserve) {
        if (_reserve) {
            const totalSupplies = await this.fetchERC20TotalSupplies([
                _reserve.stableDebtTokenAddress,
                _reserve.variableDebtTokenAddress,
            ]);

            return toBigNumber(totalSupplies[0]).plus(totalSupplies[1]);
        }

        return toBigNumber(0);
    }

    /**
     * @param {FLendReserve} _reserve
     * @return {Promise<FLendReserveOverview>}
     */
    async getReserveOverview(_reserve) {
        if (!_reserve.ID) {
            return {};
        }

        const configuration = this.getReserveConfigurationData(_reserve.configuration);
        const { asset } = _reserve;
        const overview = {};
        const totalBorrowed = await this.fetchTotalBorrowed(_reserve);

        overview.stableBorrowing = configuration.stableBorrowRateEnabled;
        overview.liquidationTreshold = configuration.liquidationThreshold / 100;
        overview.liquidationPenalty = configuration.liquidationBonus / 100 - 100;
        overview.stableBorrowAPR = this.fromRay(_reserve.currentStableBorrowRate).multipliedBy(100).toNumber();
        overview.variableBorrowAPR = this.fromRay(_reserve.currentVariableBorrowRate).multipliedBy(100).toNumber();
        overview.maximumLTV = configuration.ltv / 100;
        overview.usedAsColllateral = true; // ??

        overview.assetPrice = defi.getTokenPrice(asset);
        overview.assetPriceFormatted = defi.formatValueInUSD(1, asset, 2);
        overview.totalBorrowed = bFromWei(totalBorrowed).toNumber();
        overview.totalBorrowedFUSD = overview.totalBorrowed * overview.assetPrice;
        overview.totalBorrowedFUSDFormatted = defi.formatValueInUSD(overview.totalBorrowed, asset, 2);
        overview.totalSupply = bFromWei(asset.totalSupply).toNumber();
        overview.available = overview.totalSupply - overview.totalBorrowed;
        overview.availableFUSD = overview.available * overview.assetPrice;
        overview.availableFUSDFormatted = defi.formatValueInUSD(overview.available, asset, 2);
        overview.reserveSizeFUSD = overview.totalSupply * overview.assetPrice;
        overview.reserveSizeFUSDFormatted = defi.formatValueInUSD(overview.totalSupply, asset);

        return overview;
    }

    /**
     * Returns the configuration data for asset.
     *
     * @param {string} _reserveConfiguration Hex uint256 number. (https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool#getreservedata)
     * @return {FLendReserveConfigurationData}
     */
    getReserveConfigurationData(_reserveConfiguration) {
        const bConfiguration = new BigNumber(_reserveConfiguration);
        const bConfiguration256 = web3utils.padLeft(bConfiguration.toString(2), 256, '0');

        return {
            ltv: this.getBits(bConfiguration256, 0, 15, true),
            liquidationThreshold: this.getBits(bConfiguration256, 16, 31, true),
            liquidationBonus: this.getBits(bConfiguration256, 32, 47, true),
            decimals: this.getBits(bConfiguration256, 48, 55, true),
            isActive: this.getBits(bConfiguration256, 56, 56) === '1',
            isFrozen: this.getBits(bConfiguration256, 57, 57) === '1',
            borrowingEnabled: this.getBits(bConfiguration256, 58, 58) === '1',
            stableBorrowRateEnabled: this.getBits(bConfiguration256, 59, 59) === '1',
            reserved: this.getBits(bConfiguration256, 60, 63, true),
            reserveFactor: this.getBits(bConfiguration256, 64, 79, true),
        };
    }

    /**
     * Returns the configuration data for user.
     * (https://docs.aave.com/developers/the-core-protocol/lendingpool#getuserconfiguration)
     *
     * @param {string} _configuration Hex uint256 number.
     * @param {number} _numReserves
     * @return {{usedAsCollateral: boolean, borrowed: boolean}[]}
     */
    getUserConfiguration(_configuration, _numReserves) {
        const bConfiguration = new BigNumber(_configuration);
        const bConfiguration256 = web3utils.padLeft(bConfiguration.toString(2), 256, '0');
        const configuration = [];
        let bits = '';

        for (let i = 0; i < _numReserves * 2; i += 2) {
            bits = this.getBits(bConfiguration256, i, i + 1);
            configuration.push({
                usedAsCollateral: bits.charAt(0) === '1',
                borrowed: bits.charAt(1) === '1',
            });
        }

        return configuration;
    }

    /**
     * Get indices of borrowed or 'used as collateral' reserves (reserve.ID attribute).
     *
     * @param {{usedAsCollateral: boolean, borrowed: boolean}[]} _userConfiguration
     * @param {'usedAsCollateral'|'borrowed'} _key
     * @return {number[]}
     */
    getUserReservesIndices(_userConfiguration, _key = 'usedAsCollateral') {
        const reserves = [];

        if (_userConfiguration && _userConfiguration.length > 0) {
            _userConfiguration.forEach((_item, _index) => {
                if (_item[_key]) {
                    reserves.push(_index);
                }
            });
        }

        return reserves;
    }

    /**
     * @param {string} _binNumber
     * @param {number} _from
     * @param {number} _to
     * @param {number} [_toInt] Convert to integer
     * @return {string|number}
     */
    getBits(_binNumber, _from = 0, _to = 15, _toInt = false) {
        let n = '';

        if (_from <= _to) {
            n = _binNumber.substr(_binNumber.length - (_to + 1), _to - _from + 1);

            if (_toInt) {
                n = parseInt(n, 2);
            }
        }

        return n;
    }

    /**
     * @param {number} _amount
     * @return {string}
     */
    formatAmount(_amount) {
        return formatNumberByLocale(_amount, 2);
    }

    /**
     * @param {string|number|BigNumber} _value
     * @return {BigNumber}
     */
    fromRay(_value) {
        return toBigNumber(_value).shiftedBy(-RAYP);
    }
}
