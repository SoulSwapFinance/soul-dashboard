import './flend.types.js';
import gql from 'graphql-tag';
import { cloneObject } from '@/utils';
// import { defi } from '../defi/defi.js';
// import { fFetch } from '@/plugins/ffetch.js';

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
            this.fetchERC20Tokens(_ownerAddress, _fetchPolicy),
        ]);
        /** @type {FLendReserve} */
        const reserve = data[0];
        /** @type {ERC20Token[]} */
        const erc20Tokens = data[1];

        if (reserve.assetAddress && erc20Tokens.length > 0) {
            /** @type {ERC20Token} */
            const erc20Token = erc20Tokens.find((_token) => _token.address === reserve.assetAddress);

            if (erc20Token) {
                reserve.erc20Info = cloneObject(erc20Token);
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
            this.fetchERC20Tokens(_ownerAddress, _fetchPolicy),
        ]);
        const reserves = data[0];
        const erc20Tokens = data[1];

        if (reserves.length > 0) {
            erc20Tokens.forEach((_token) => {
                const reserve = reserves.find((_reserve) => _reserve.assetAddress === _token.address);

                if (reserve) {
                    reserve.erc20Info = cloneObject(_token);
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
}
