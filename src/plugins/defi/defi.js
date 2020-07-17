import './defi.types.js';
import gql from 'graphql-tag';
import { lowercaseFirstChar } from '../../utils';

/** @type {BNBridgeExchange} */
export let defi = null;

/**
 * Plugin for various DeFi requests and calculations.
 */
export class DeFi {
    /**
     * @param {Vue} _Vue
     * @param {{apolloClient: ApolloClient}} _options
     */
    static install(_Vue, _options) {
        if (!defi) {
            defi = new DeFi(_options);
            _Vue.prototype.$defi = defi;
        }
    }

    /**
     * @param {{apolloClient: ApolloClient}} _options
     */
    constructor(_options) {
        this.apolloClient = _options.apolloClient;
        /** Liquidation collateral ratio. */
        this.liqCollateralRatio = 1.5;
        /** Minimal collateral ratio. */
        this.minCollateralRatio = 3;
        /** Warning collateral ratio. */
        this.warningCollateralRatio = 2.25; // (this.liqCollateralRatio + this.minCollateralRatio) / 2;
        /** DeFi settings was loaded. */
        this.settingsLoaded = false;
    }

    /**
     * Get token price and load settings if it's necessary.
     *
     * @param {string} _priceTo
     * @return {Promise<number>} Token price.
     */
    async init(_priceTo = 'USD') {
        const promises = [this.getFTMTokenPrice(_priceTo)];

        if (!this.settingsLoaded) {
            promises.push(this.getSettings());
        }

        const res = await Promise.all(promises);

        if (!this.settingsLoaded) {
            this.settingsLoaded = true;
            this.initProperties(res[1]);
        }

        return res[0];
    }

    /**
     * Set properties.
     *
     * @param {DefiSettings} _settings
     */
    initProperties(_settings) {
        const dec = Math.pow(10, _settings.decimals);

        this.liqCollateralRatio = parseInt(_settings.liqCollateralRatio4, 16) / dec;
        this.minCollateralRatio = parseInt(_settings.minCollateralRatio4, 16) / dec;
        this.warningCollateralRatio = parseInt(_settings.warningCollateralRatio4, 16) / dec;
    }

    /**
     * @param {number} _collateral
     * @param {number} _tokenPrice
     * @return {number}
     */
    getMaxDebt(_collateral, _tokenPrice) {
        let max = 0;

        if (_collateral > 0) {
            max = (_collateral * _tokenPrice) / this.minCollateralRatio;
        }

        return max;
    }

    /**
     * @param {number} _debt
     * @param {number} _collateral
     * @return {number}
     */
    getLiquidationPrice(_debt, _collateral) {
        let liqPrice = 0;

        if (_debt > 0 && _collateral > 0) {
            liqPrice = (_debt * this.liqCollateralRatio) / _collateral;
        }

        return liqPrice;
    }

    getMintingLimit(_debt, _collateral, _tokenPrice) {
        // ratio between actual debt and liquidation debt
        return _collateral > 0
            ? (_debt / ((parseFloat(_collateral) * _tokenPrice) / this.liqCollateralRatio)) * 100
            : 0;
    }

    /**
     * Get color values for f-circle-progress and f-colored-number-range components
     *
     * @return {{color: string, value: number}[]}
     */
    getColors() {
        return [
            {
                value: (this.liqCollateralRatio / this.minCollateralRatio) * 100,
                color: '#ffaf19',
            },
            {
                value: (this.warningCollateralRatio / this.minCollateralRatio) * 100,
                color: '#ff1716',
            },
        ];
    }

    /**
     * @param {number} _debt
     * @param {number} _tokenPrice
     * @return {number}
     */
    getMinCollateral(_debt, _tokenPrice) {
        return (_debt * this.minCollateralRatio) / _tokenPrice;
    }

    /**
     * @param {DefiToken} _token
     * @return {string}
     */
    getTokenSymbol(_token) {
        return _token && _token.symbol ? lowercaseFirstChar(_token.symbol) : '';
    }

    /**
     * @param {DefiToken} _token
     * @return {number}
     */
    getTokenPrice(_token) {
        return _token && 'price' in _token ? parseInt(_token.price, 16) / Math.pow(10, _token.priceDecimals) : 0;
    }

    /**
     * @return {Promise<DefiSettings>}
     */
    async getSettings() {
        const data = await this.apolloClient.query({
            query: gql`
                query DefiSettings {
                    defiConfiguration {
                        tradeFee4
                        loanFee4
                        minCollateralRatio4
                        warningCollateralRatio4
                        liqCollateralRatio4
                        decimals
                    }
                }
            `,
            fetchPolicy: 'no-cache',
        });

        return data.data.defiConfiguration || {};
    }

    /**
     * @return {Promise<DefiToken[]>}
     */
    async getTokens() {
        const data = await this.apolloClient.query({
            query: gql`
                query DefiTokens {
                    defiTokens {
                        address
                        name
                        symbol
                        logoUrl
                        decimals
                        price
                        priceDecimals
                        isActive
                        canDeposit
                        canBorrow
                        canTrade
                    }
                }
            `,
            fetchPolicy: 'no-cache',
        });

        return data.data.defiTokens || [];
    }

    /**
     * @param {string} _owner
     * @return {Promise<Object>}
     */
    async getDefiAccount(_owner = '') {
        const data = await this.apolloClient.query({
            query: gql`
                query DefiAccount($owner: Address!) {
                    defiAccount(owner: $owner) {
                        address
                        collateral {
                            type
                            tokenAddress
                            balance
                            value
                            token {
                                symbol
                            }
                        }
                        collateralValue
                        collateralList
                        debt {
                            type
                            tokenAddress
                            balance
                            value
                            token {
                                symbol
                            }
                        }
                        debtValue
                        debtList
                    }
                }
            `,
            variables: {
                owner: _owner,
            },
            fetchPolicy: 'no-cache',
        });

        return data.data.defiAccount;
    }

    /**
     * @param {string} [_to]
     * @return {Promise<Number>}
     */
    async getFTMTokenPrice(_to = 'USD') {
        const data = await this.apolloClient.query({
            query: gql`
                query Price($to: String!) {
                    price(to: $to) {
                        price
                    }
                }
            `,
            variables: {
                to: _to,
            },
            fetchPolicy: 'no-cache',
        });

        if (!data.data.price) {
            return;
        }

        let tokenPrice = parseFloat(data.data.price.price);

        tokenPrice = parseInt(tokenPrice * 100000) / 100000;

        return tokenPrice;
    }
}
