import gql from 'graphql-tag';
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
     * @return {Promise<[{}]|[]>}
     */
    async fetchReserves(_fetchPolicy = 'network-only') {
        const data = await this.apolloClient.query({
            query: gql`
                query GetFLendLendingPool {
                    fLendLendingPool {
                        reserveDataList {
                            ID
                            assetAddress
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

        console.log(await this.fetchERC20Tokens());

        return data.data.fLendLendingPool || {};
    }

    /**
     * @param {string} [_ownerAddress]
     * @param {string|array} [_symbol]
     * @param {string} [_fetchPolicy]
     * @return {Promise<ERC20Token[]>}
     */
    async fetchERC20Tokens(_ownerAddress, _symbol, _fetchPolicy = 'network-only') {
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

        let erc20TokenList = data.data.erc20TokenList || [];

        /*if (filterTokens.length > 0) {
            erc20TokenList = erc20TokenList.filter(this.filterTokensBySymbol);
        }*/
        // console.log('erc20', erc20TokenList);

        let tokens = [];

        if (_symbol) {
            if (typeof _symbol === 'string') {
                tokens = erc20TokenList.find((_item) => _item.symbol === _symbol);
            } else if (_symbol.length) {
                tokens = erc20TokenList.filter((_item) => _symbol.indexOf(_item.symbol) > -1);
            }
        } else {
            tokens = erc20TokenList;
        }

        return tokens;
    }
}
