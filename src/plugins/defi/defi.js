import './defi.types.js';
import gql from 'graphql-tag';
import { lowercaseFirstChar } from '../../utils';
import web3utils from 'web3-utils';

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
     * Load settings if it's necessary.
     *
     * @return {Promise}
     */
    async init() {
        if (!this.settingsLoaded) {
            this.settingsLoaded = true;
            this.initProperties(await this.fetchSettings());
        }
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
     * Convert given value from token decimals space.
     *
     * @param {string} _value Hex value.
     * @param {DefiToken} _token
     * @param {boolean} [_isPrice]
     */
    fromTokenValue(_value, _token, _isPrice = false) {
        let value = 0;

        if (_value !== undefined) {
            value = parseFloat(this.fromWei(_value, _isPrice ? _token.priceDecimals : _token.decimals));
        }

        return value;
    }

    fromWei(_value, _dec = 0) {
        const value = web3utils.toBN(_value).toString(10);
        const idx = value.length - _dec;

        return value.slice(0, idx) + '.' + value.slice(idx);
    }

    // toTokenValue() {}

    /**
     * Get defi account debt by token.
     *
     * @param {DefiAccount} _account
     * @param {DefiToken} _token
     * @return {DefiTokenBalance|{}}
     */
    getDefiAccountDebt(_account, _token) {
        let debt = 0;
        let acountDebt;

        if (_token && _account && _account.debt && _account.debt.length > 0) {
            acountDebt = _account.debt.find((_item) => _item.tokenAddress === _token.address);
            if (acountDebt) {
                debt = acountDebt;
            }
        }

        return debt;
    }

    /**
     * Get defi account collateral by token.
     *
     * @param {DefiAccount} _account
     * @param {DefiToken} _token
     * @return {DefiTokenBalance|{}}
     */
    getDefiAccountCollateral(_account, _token) {
        let collateral = 0;
        let acountCollateral;

        if (_token && _account && _account.collateral && _account.collateral.length > 0) {
            acountCollateral = _account.collateral.find((_item) => _item.tokenAddress === _token.address);
            if (acountCollateral) {
                collateral = acountCollateral;
            }
        }

        return collateral;
    }

    /**
     * @param {DefiToken} _token
     * @return {boolean}
     */
    canTokenBeBorrowed(_token) {
        return _token && _token.isActive && _token.canBorrow && _token.symbol !== 'FUSD';
    }

    /**
     * @param {DefiToken} _token
     * @return {boolean}
     */
    canTokenBeTraded(_token) {
        return _token && _token.isActive && _token.canTrade;
    }

    /**
     * @return {Promise<DefiSettings>}
     */
    async fetchSettings() {
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
     * @param {string} _ownerAddress
     * @param {string} [_symbol]
     * @return {Promise<DefiToken[]>}
     */
    async fetchTokens(_ownerAddress, _symbol) {
        const data = await this.apolloClient.query({
            query: gql`
                query DefiTokens($owner: Address!) {
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
                        availableBalance(owner: $owner)
                    }
                }
            `,
            variables: {
                owner: _ownerAddress,
            },
            fetchPolicy: 'no-cache',
        });
        const tokens = data.data.defiTokens || [];

        return _symbol ? tokens.find((_item) => _item.symbol === _symbol) : tokens;
    }

    /**
     * @param {string} _ownerAddress
     * @return {Promise<DefiAccount>}
     */
    async fetchDefiAccount(_ownerAddress = '') {
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
                                address
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
                                address
                                symbol
                            }
                        }
                        debtValue
                        debtList
                    }
                }
            `,
            variables: {
                owner: _ownerAddress,
            },
            fetchPolicy: 'no-cache',
        });
        /** @type {DefiAccount} */
        const { defiAccount } = data.data;

        return defiAccount;
    }

    /**
     * @param {string} [_to]
     * @return {Promise<Number>}
     */
    async fetchFTMTokenPrice(_to = 'USD') {
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
