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
        /** What percentage represents minimal collateral ratio in minting limit. */
        // this.minCollateralRatioLimit = 0.75;
        this.noLimitRatio = this.minCollateralRatio * 4;
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
        return _debt > 0 ? this.getRatioMintingLimit(this.getCollateralRatio(_debt, _collateral, _tokenPrice)) : 0;
    }

    getRatioMintingLimit(_ratio) {
        return _ratio > 0
            ? 100 - ((_ratio - this.liqCollateralRatio) / (this.noLimitRatio - this.liqCollateralRatio)) * 100
            : 0;
    }

    getCollateralRatio(_debt, _collateral, _tokenPrice) {
        if (_debt > 0) {
            return (_collateral * _tokenPrice) / _debt;
        }

        return 0;
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
     * @return {Promise<Object>}
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
        return {
            minCollateralRatio4: 25000,
            liqCollateralRatio4: 15000,
        };
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
