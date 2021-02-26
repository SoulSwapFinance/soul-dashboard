import './bnbridge-exchange.types.js';

const crypto = require('crypto');
const bip39 = require('bip39');
const sha256 = require('sha256');

const BNB_ADDRESS_LENGTH = 42;
const ERC20_ADDRESS_LENGTH = 42;
const MAX_NUM_TRIES = 50;
const POLLING_INTERVAL = 3000;

/** @type {BNBridgeExchange} */
export let bnb = null;

export const BNBridgeExchangeErrorCodes = {
    BAD_ETH_ADDRESS: 1,
    BAD_BNB_ADDRESS: 2,
    SWAP_TOKEN_API_ERROR: 3,
    FINALIZE_SWAP_TOKEN_API_ERROR: 4,
    BAD_PARAMETERS: 5,
    BRIDGE_IS_DOWN: 6,
};

export const BNBridgeExchangeErrorMessages = {
    [BNBridgeExchangeErrorCodes.BAD_ETH_ADDRESS]: 'Ethereum address is invalid',
    [BNBridgeExchangeErrorCodes.BAD_BNB_ADDRESS]: 'Binance address is invalid',
    [BNBridgeExchangeErrorCodes.BAD_PARAMETERS]: 'Bad parameters',
    [BNBridgeExchangeErrorCodes.BRIDGE_IS_DOWN]: 'Bridge is down',
};

export class BNBridgeExchangeError extends Error {
    constructor(_message, _code) {
        super(_message);

        this.name = 'BNBridgeExchangeError';
        this.message = _message;
        this.code = _code;
    }
}

/**
 * Plugin for bnbbridge exchange.
 */
export class BNBridgeExchange {
    static install(_Vue, _options) {
        bnb = new BNBridgeExchange(_options);
        _Vue.prototype.$bnb = bnb;
    }

    /**
     * @param {{apiUrl: string, apiToken: string}} _options
     */
    constructor(_options) {
        /** BNBridge api uri. */
        this.bnbridgeApiUrl = _options.apiUrl;
        /** Auth token for BNBridge api. */
        this.bnbridgeApiToken = _options.apiToken;
        /** BNBridge api uri path. */
        this.bnbridgeApiPath = '';
        /**
         * List of available tokens.
         *
         * @type {BNBridgeToken[]}
         * @private
         */
        this._tokens = [];
        /**
         * Array of objects used as parameters of `finalizeSwapToken` method.
         *
         * @type {FSTRequest[]}
         * @private
         */
        this._fstPendingRequests = [];
        /**
         * Function called when `finalizeSwapToken` request is done.
         *
         * @type {function}
         * @private
         */
        this._fstRequestDone = null;
        /**
         * Function called when request is canceled.
         *
         * @type {function}
         * @private
         */
        this._fstRequestCancel = null;
        /**
         * Function called when object is appended to `this._fstPendingRequests` array.
         *
         * @type {function}
         * @private
         */
        this._fstRequestPush = null;
        /** FST request is processed. */
        this._fstInProgress = false;

        if (!this.bnbridgeApiUrl) {
            // throw new Error('Need bnbridge api url.');
        } else {
            this.bnbridgeApiPath = this.getApiUrlPath(this.bnbridgeApiUrl);
            if (!this.bnbridgeApiPath) {
                throw new Error("Can't parse api url path.");
            }
        }
    }

    /**
     * Get array of available tokens.
     *
     * @return {Promise<BNBridgeToken[]>}
     */
    async getTokens() {
        if (this._tokens.length === 0) {
            const data = await this.fetch({ slug: 'tokens', method: 'GET' });

            if (data && data.success) {
                this._tokens = data.result;
            }
        }

        return this._tokens;
    }

    /**
     * Get fantom token from tokens list.
     *
     * @return {BNBridgeToken|undefined}
     */
    async getFantomToken() {
        const tokens = await this.getTokens();

        return tokens ? tokens.find((_token) => _token.symbol === 'FTM') : undefined;
    }

    /**
     * @param {string} _ethReceiveAddress
     * @param {BNBridgeToken} [_token]
     * @return {Promise<number>}
     */
    async getETHBalance(_ethReceiveAddress, _token) {
        const token = /** @type {BNBridgeToken} */ _token || (await this.getFantomToken());
        const pData = {
            eth_address: _ethReceiveAddress,
            token_uuid: token ? token.uuid : '',
        };
        let balance = 0;

        if (pData.token_uuid && this.isETHAddress(pData.eth_address)) {
            const data = await this.fetch({ slug: 'getEthBalances', data: pData });

            if (data) {
                if (data.success) {
                    balance = data.result.balance;
                } else {
                    if (data.status === 500) {
                        throw new BNBridgeExchangeError(
                            BNBridgeExchangeErrorMessages[BNBridgeExchangeErrorCodes.BRIDGE_IS_DOWN],
                            BNBridgeExchangeErrorCodes.BRIDGE_IS_DOWN
                        );
                    } else {
                        throw new BNBridgeExchangeError(
                            BNBridgeExchangeErrorMessages[BNBridgeExchangeErrorCodes.BAD_ETH_ADDRESS],
                            BNBridgeExchangeErrorCodes.BAD_ETH_ADDRESS
                        );
                    }
                }
            }
        } else {
            throw new BNBridgeExchangeError(
                BNBridgeExchangeErrorMessages[BNBridgeExchangeErrorCodes.BAD_PARAMETERS],
                BNBridgeExchangeErrorCodes.BAD_PARAMETERS
            );
        }

        return balance;
    }

    /**
     * @param {string} _bnbReceiveAddress
     * @param {BNBridgeToken} [_token]
     * @return {Promise<BNBBalances>}
     */
    async getBNBBalances(_bnbReceiveAddress, _token) {
        const token = /** @type {BNBridgeToken} */ _token || (await this.getFantomToken());
        const pData = {
            bnb_address: _bnbReceiveAddress,
            token_uuid: token ? token.uuid : '',
        };
        let balances = {
            balance: 0,
            pendingBalance: 0,
        };

        if (pData.token_uuid && this.isBNBAddress(pData.bnb_address)) {
            const data = await this.fetch({ slug: 'getBnbBalances', data: pData });

            if (data) {
                if (data.success) {
                    balances = { ...data.result };
                } else {
                    if (data.status === 500) {
                        throw new BNBridgeExchangeError(
                            BNBridgeExchangeErrorMessages[BNBridgeExchangeErrorCodes.BRIDGE_IS_DOWN],
                            BNBridgeExchangeErrorCodes.BRIDGE_IS_DOWN
                        );
                    } else {
                        throw new BNBridgeExchangeError(
                            BNBridgeExchangeErrorMessages[BNBridgeExchangeErrorCodes.BAD_BNB_ADDRESS],
                            BNBridgeExchangeErrorCodes.BAD_BNB_ADDRESS
                        );
                    }
                }
            }
        } else {
            throw new BNBridgeExchangeError(
                BNBridgeExchangeErrorMessages[BNBridgeExchangeErrorCodes.BAD_PARAMETERS],
                BNBridgeExchangeErrorCodes.BAD_PARAMETERS
            );
        }

        return balances;
    }

    /**
     * @param {string} [ethAddress]
     * @param {string} [bnbAddress]
     * @param {string} [operaAddress]
     * @param {BNBridgeDirection} [direction]
     * @param {BNBridgeToken} [_token]
     * @return {Promise<null>}
     */
    async swapToken({ ethAddress = '', bnbAddress = '', operaAddress = '', direction = 'EthereumToBinance' }, _token) {
        const token = /** @type {BNBridgeToken} */ _token || (await this.getFantomToken());
        const pData = {
            direction,
            token_uuid: token ? token.uuid : '',
            eth_address: ethAddress,
            bnb_address: bnbAddress,
            opera_address: operaAddress,
        };
        let dataOk = !!pData.token_uuid;
        let result = null;
        let errorCode = -1;
        let errorMessage = '';

        if (dataOk) {
            if (direction.indexOf('ToBinance') > -1) {
                if (!this.isBNBAddress(pData.bnb_address)) {
                    errorCode = BNBridgeExchangeErrorCodes.BAD_BNB_ADDRESS;
                    dataOk = false;
                }
            } else if (direction.indexOf('ToEthereum') > -1) {
                if (!this.isETHAddress(pData.eth_address)) {
                    errorCode = BNBridgeExchangeErrorCodes.BAD_ETH_ADDRESS;
                    dataOk = false;
                }
            }
        }

        if (dataOk) {
            let data = await this.fetch({ slug: 'swaps', data: pData });

            if (data) {
                if (data.success) {
                    // console.log(data.result);
                    result = { ...data.result, direction };
                } else {
                    errorCode = BNBridgeExchangeErrorCodes.SWAP_TOKEN_API_ERROR;

                    if (data.errMessage) {
                        errorMessage = data.errMessage;
                    } else {
                        errorMessage = data.result;
                    }

                    if (
                        errorMessage === 'Symbol already exists' &&
                        pData.opera_address !== pData.opera_address.toLowerCase()
                    ) {
                        // resend request with Opera address in lowercase
                        pData.opera_address = pData.opera_address.toLowerCase();
                        data = await this.fetch({ slug: 'swaps', data: pData });

                        if (data.success) {
                            result = { ...data.result, direction };
                            errorCode = -1;
                        }
                    }
                }
            }
        }

        if (errorCode > -1) {
            throw new BNBridgeExchangeError(errorMessage || BNBridgeExchangeErrorMessages[errorCode], errorCode);
        }

        return result;
    }

    /**
     * @param {string} uuid
     * @param {BNBridgeDirection} direction
     * @param {string} memo
     * @param {BNBridgeToken} [_token]
     * @return {Promise<null>}
     */
    async finalizeSwapToken({ uuid = '', direction = '', memo = '' }, _token) {
        const token = /** @type {BNBridgeToken} */ _token || (await this.getFantomToken());
        const pData = {
            direction,
            token_uuid: token ? token.uuid : '',
            uuid,
            memo,
        };
        const dataOk = pData.direction && pData.token_uuid && pData.uuid;
        let result = null;
        let errorCode = -1;
        let errorMessage = '';

        if (dataOk) {
            const data = await this.fetch({ slug: 'finalizeSwap', data: pData });

            if (data) {
                if (data.success) {
                    // console.log(data.result);
                    result = { result: data.result, direction };
                } else {
                    errorCode = BNBridgeExchangeErrorCodes.FINALIZE_SWAP_TOKEN_API_ERROR;

                    if (data.errMessage) {
                        errorMessage = data.errMessage;
                    } else {
                        errorMessage = data.result;
                    }
                }
            }
        } else {
            errorCode = BNBridgeExchangeErrorCodes.BAD_PARAMETERS;
        }

        if (errorCode > -1) {
            throw new BNBridgeExchangeError(errorMessage || BNBridgeExchangeErrorMessages[errorCode], errorCode);
        }

        return result;
    }

    /**
     * Makes request to api point.
     *
     * @param {string} slug
     * @param {string} [method]
     * @param {object} [data]
     * @param {object} [_options]
     */
    async fetch({ slug = '', method = 'POST', data = null, ..._options }) {
        const fetchOptions = {
            method,
            headers: {
                'Content-type': 'application/json',
            },
            ..._options,
        };
        let response = null;
        let resp = null;
        const url = `${this.bnbridgeApiUrl}/${slug}`;

        if (!slug) {
            return null;
        }

        if (this.bnbridgeApiToken) {
            fetchOptions.headers.Authorization = 'Basic ' + this.bnbridgeApiToken;
        }

        if (fetchOptions.method === 'POST' && data) {
            data = this.encrypt(data, url);
        }

        if (data && fetchOptions.method !== 'GET' && fetchOptions.method !== 'HEAD') {
            if (fetchOptions.headers['Content-type'] === 'application/json') {
                fetchOptions.body = JSON.stringify(data);
            }
        }

        // console.log(url, fetchOptions);
        response = await fetch(url, fetchOptions);

        // if (response.ok) {
        if (fetchOptions.headers['Content-type'] === 'application/json') {
            resp = await response.json();
        } else {
            resp = response.text();
        }
        // }

        return resp;
    }

    /**
     * @param {string} _url
     * @return {string}
     */
    getApiUrlPath(_url) {
        const re = /[\w:]+\/\/[\w\d.]+\/(.*)/;
        const match = re.exec(_url);
        let path = '';

        if (match && match.length === 2) {
            path = `/${match[1]}`;
        }

        return path;
    }

    /**
     * Simple check if given address is ethereum address.
     *
     * @param {string} _address
     * @return {boolean}
     */
    isETHAddress(_address) {
        return !!_address && _address.length === ERC20_ADDRESS_LENGTH;
    }

    /**
     * Simple check if given address is binance address.
     *
     * @param {string} _address
     * @return {boolean}
     */
    isBNBAddress(_address) {
        return !!_address && _address.length === BNB_ADDRESS_LENGTH;
    }

    /**
     * @param {object} _data
     * @param {string} _url
     * @return {{p: *, t: number, e: string, u: string, m: string}}
     */
    encrypt(_data, _url) {
        const signJson = JSON.stringify(_data);
        const signMnemonic = bip39.generateMnemonic();
        const cipher = crypto.createCipher('aes-256-cbc', signMnemonic);
        const signEncrypted = cipher.update(signJson, 'utf8', 'base64') + cipher.final('base64');
        const signData = {
            e: this.hexEncode(signEncrypted),
            m: this.hexEncode(signMnemonic),
            u: sha256(_url).toUpperCase(),
            p: sha256(sha256(_url).toUpperCase()).toUpperCase(),
            t: new Date().getTime(),
        };
        const signSeed = JSON.stringify(signData);

        signData.s = sha256(signSeed);

        return signData;
    }

    /**
     * @param {string} _str
     * @return {string}
     */
    hexEncode(_str) {
        var hex, i;
        var result = '';

        for (i = 0; i < _str.length; i++) {
            hex = _str.charCodeAt(i).toString(16);
            result += ('000' + hex).slice(-4);
        }

        return result;
    }

    /**
     * Process queue of FST pending requests.
     *
     * @param {FSTRequest} [_request]
     * @return {Promise<void>}
     */
    async processFSTPendingRequests(_request) {
        const requests = this._fstPendingRequests;

        if (this._fstInProgress && !_request) {
            return;
        } else if (requests.length === 0) {
            this._fstInProgress = false;
            return;
        }

        const request = _request || requests[0];

        if (!request._cntr || request._cntr > MAX_NUM_TRIES) {
            request._cntr = 1;
        }

        this._fstInProgress = true;

        try {
            const data = await this.finalizeSwapToken(request);

            if (typeof this._fstRequestDone === 'function') {
                /*
                console.log('data:', data);
                console.log('request:', request);
                console.log('datarequest:', {
                    ...data,
                    ...request,
                });
                */
                this._fstRequestDone({
                    ...data,
                    ...request,
                });
            }

            requests.shift();

            this._fstInProgress = false;
            this.processFSTPendingRequests();
        } catch (_error) {
            if (_error.code === BNBridgeExchangeErrorCodes.FINALIZE_SWAP_TOKEN_API_ERROR) {
                if (request._cntr >= MAX_NUM_TRIES) {
                    const reqIdx = requests.findIndex((_req) => _req.uuid === request.uuid);
                    if (reqIdx > -1) {
                        if (typeof this._fstRequestCancel === 'function') {
                            this._fstRequestCancel(_request);
                        }

                        requests.splice(reqIdx, 1);
                        this._fstInProgress = false;
                    }
                } else {
                    setTimeout(() => {
                        request._cntr++;
                        this.processFSTPendingRequests(request);
                    }, POLLING_INTERVAL);
                }
            }
        }
    }

    /**
     * @param {FSTRequest} _request
     */
    pushFSTRequest(_request) {
        this._fstPendingRequests.push(_request);

        if (typeof this._fstRequestPush === 'function') {
            this._fstRequestPush(_request);
        }

        if (!this._fstInProgress) {
            this.processFSTPendingRequests();
        }
    }

    /**
     * @param {FSTRequest[]} _requests
     */
    setFSTPendingRequests(_requests) {
        this._fstPendingRequests = _requests;
    }

    /**
     * @param {function} _callback
     */
    setFSTRequestDoneCallback(_callback) {
        this._fstRequestDone = _callback;
    }

    /**
     * @param {function} _callback
     */
    setFSTRequestCancelCallback(_callback) {
        this._fstRequestCancel = _callback;
    }

    /**
     * @param {function} _callback
     */
    setFSTRequestPushCallback(_callback) {
        this._fstRequestPush = _callback;
    }

    /**
     * @param {BNBridgeDirection} _direction
     * @return {string}
     */
    getFTMCurrencyByDirection(_direction) {
        let currency = 'FTM';

        if (_direction === 'OperaToOpera') {
            currency += '-Opera';
        } else if (_direction.indexOf('Binance') > -1) {
            currency += '-BEP2';
        } else if (_direction.indexOf('Ethereum') > -1) {
            currency += '-ERC20';
        }

        return currency;
    }

    /**
     * @param {BNBridgeDirection} _direction
     * @return {string}
     */
    getAddressKeyByDirection(_direction) {
        let blockchain = 'opera';

        if (_direction.indexOf('Binance') > -1) {
            blockchain = 'bnb';
        } else if (_direction.indexOf('Ethereum') > -1) {
            blockchain = 'eth';
        }

        return `${blockchain}_address`;
    }
}
