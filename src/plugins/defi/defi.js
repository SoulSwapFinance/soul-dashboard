import './defi.types.js';
import gql from 'graphql-tag';

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
        this.minCollateralRatio = 2.5;
        this.dangerRatio = (this.liqCollateralRatio + this.minCollateralRatio) / 2;
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
        const promises = [this.getTokenPrice(_priceTo)];

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
        this.liqCollateralRatio = _settings.liqCollateralRatio4 / 10000;
        this.minCollateralRatio = _settings.minCollateralRatio4 / 10000;
        this.dangerRatio = (this.liqCollateralRatio + this.minCollateralRatio) / 2;
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
                value: (this.dangerRatio / this.minCollateralRatio) * 100,
                color: '#ff1716',
            },
        ];
    }

    /**
     * @param {number} _debt
     * @param {number} _tokenPrice
     * @return {number}
     */
    getLiquidationCollateral(_debt, _tokenPrice) {
        return (_debt * this.liqCollateralRatioCollateralRatio) / _tokenPrice;
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
     * @return {Promise<DefiSettings>}
     */
    async getSettings() {
        /*
        const data = await this.apolloClient.query({
            query: gql`
                query DefiSettings {
                    defiSettings {
                        tradeFee4
                        loanFee4
                        minCollateralRatio4
                        liqCollateralRatio4
                    }
                }
            `,
            fetchPolicy: 'no-cache',
        });

        return data.data.defiSettings || {};
        */

        // temporary data
        return new Promise(function (_resolve) {
            setTimeout(() => {
                _resolve({
                    minCollateralRatio4: 30000,
                    liqCollateralRatio4: 15000,
                    tradeFee4: 0,
                    loanFee4: 0,
                });
            }, 200);
        });
    }

    /**
     * @return {Promise<DefiTokens[]>}
     */
    async getTokens() {
        /*
        const data = await this.apolloClient.query({
            query: gql`
                query DefiTokens {
                    defiTokens {
                        address
                        name
                        symbol
                        decimals
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
        */

        // temporary data
        return new Promise(function (_resolve) {
            setTimeout(() => {
                _resolve([
                    {
                        address: '0xffffffffffffffffffffffffffffffffffffffff',
                        name: 'Native Fantom',
                        symbol: 'FTM',
                        decimals: 8,
                        isActive: true,
                        canDeposit: true,
                        canBorrow: false,
                        canTrade: false,
                    },
                    {
                        address: '0x8019db8a3ff1887d047f2dc1c7265ea8dab1ca80',
                        name: 'Fantom USD',
                        symbol: 'FUSD',
                        decimals: 8,
                        isActive: true,
                        canDeposit: true,
                        canBorrow: true,
                        canTrade: false,
                    },
                    {
                        address: '0x7c64609b1b1d787a207b76632bcb97082dbd990d',
                        name: 'Fantom ETH Synth',
                        symbol: 'FETH',
                        decimals: 8,
                        isActive: true,
                        canDeposit: true,
                        canBorrow: true,
                        canTrade: true,
                    },
                    {
                        address: '0x05d3cf8bed38aa08f6e2a62d6ebb01317176e422',
                        name: 'Fantom BTC Synth',
                        symbol: 'FBTC',
                        decimals: 8,
                        isActive: true,
                        canDeposit: true,
                        canBorrow: true,
                        canTrade: true,
                    },
                ]);
            }, 200);
        });
    }

    /**
     * @param {string} [_to]
     * @return {Promise<Number>}
     */
    async getTokenPrice(_to = 'USD') {
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
