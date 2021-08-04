// import Bip39 from 'bip39';
import fileDownload from 'js-file-download';
import gql from 'graphql-tag';
import web3utils from 'web3-utils';
import Accounts from 'web3-eth-accounts';
import { fFetch } from '@/plugins/ffetch.js';
import { isArray } from '@/utils';
import { toBigNumber, toHex } from '@/utils/big-number.js';

const bip39 = require('bip39');
const Hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
// const strongPasswordRE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const strongPasswordRE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?=.{8,})/;
const mnemonicRE = /^[ a-z]+$/;
const BNB_ADDRESS_LENGTH = 42;

export const FANTOM_CHAIN_ID = 0xfa;

export const GAS_LIMITS = {
    default: '0xabe0',
    max: '0x90F560', // 9500000
};

const MIN_GAS_PRICE = 1500000000;

// SFC_CLAIM_MAX_EPOCHS represents the max number of epochs
// available for withdraw per single request.
export const SFC_CLAIM_MAX_EPOCHS = 300;

/** Maximum number of token decimal places to be displayed in tables. */
export const MAX_TOKEN_DECIMALS_IN_TABLES = 2;

/** @type {FantomWeb3Wallet} */
export let fWallet = null;

export const Web3 = {
    utils: web3utils,
    accounts: new Accounts(),
};

/**
 * Temporary password storage.
 * @type {{pwd: string, timeout: number, count: number}}
 */
const pwdO = {
    pwd: '',
    timeout: 0,
    count: 0,
    code: '',
};

/**
 * Class for handling temporary password storage.
 */
class PWDStorage {
    constructor() {
        this.timeoutId = -1;
    }

    /**
     * @param {string} _pwd
     * @param {number} [_count] Count of usage of the password
     * @param {string} [_code]
     */
    set(_pwd = '', _count = 1, _code = '') {
        pwdO.pwd = _pwd;
        pwdO.count = _count;
        pwdO.code = _code;
    }

    /**
     * @param {string} _code
     * @return {boolean}
     */
    isSet(_code = '') {
        if (pwdO.code && pwdO.code !== _code) {
            this.clear();
        }

        return !!pwdO.pwd;
    }

    clear() {
        pwdO.pwd = '';
        pwdO.count = 0;
        pwdO.code = '';
    }

    /**
     * @param {number} _timeout
     */
    setTimeout(_timeout = 0) {
        pwdO.timeout = _timeout;

        this.timeoutId = setTimeout(() => {
            this.clear();
            pwdO.timeout = 0;
        }, pwdO.timeout);
    }

    /**
     * @return {boolean}
     */
    isTimeoutSet() {
        return pwdO.timeout > 0;
    }

    clearTimeout() {
        if (this.timeoutId > -1) {
            clearTimeout(this.timeoutId);
            this.timeoutId = -1;
        }
    }
}

// Fantom web3 wallet plugin for VUE, based on https://git`hub.com/Fantom-foundation/fantom-web3-wallet
export class FantomWeb3Wallet {
    static install(_Vue, _options) {
        fWallet = new FantomWeb3Wallet(_options);
        _Vue.prototype.$fWallet = fWallet;
    }

    constructor(_options) {
        this.apolloClient = _options.apolloClient;
        /** list blockchains | todo: add testnet */
        this.blockchains = [
            {
                value: 'fantom',
                label: 'Fantom Opera',
            },
            {
                value: 'ethereum',
                label: 'Ethereum',
            },
            {
                value: 'binance',
                label: 'Binance Chain',
            },
        ];

        this.pwdStorage = new PWDStorage();
        this.sfcConfig = null;
        this.bMinGasPrice = toBigNumber(MIN_GAS_PRICE);
        this.bMaxGasPrice = this.bMinGasPrice.multipliedBy(20);
    }

    async getSFCConfig() {
        if (this.sfcConfig) {
            return this.sfcConfig;
        }

        const data = await this.apolloClient.query({
            query: gql`
                query SFCConfig {
                    sfcConfig {
                        minValidatorStake
                        maxDelegatedRatio
                        minLockupDuration
                        maxLockupDuration
                        withdrawalPeriodEpochs
                        withdrawalPeriodTime
                    }
                }
            `,
            fetchPolicy: 'network-only',
        });
        const sfcConfig = data.data.sfcConfig || {};

        this.sfcConfig = {};

        Object.keys(sfcConfig).forEach((_key) => {
            const value = sfcConfig[_key];

            this.sfcConfig[_key] = {
                hex: value,
                num: _key === 'maxDelegatedRatio' ? this.fromWei(value) : parseInt(sfcConfig[_key], 16),
            };
        });

        return this.sfcConfig;
    }

    /**
     * @param {String} [_to]
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
            fetchPolicy: 'network-only',
        });

        if (!data.data.price) {
            return;
        }

        let tokenPrice = parseFloat(data.data.price.price);

        tokenPrice = parseInt(tokenPrice * 100000) / 100000;

        return tokenPrice;
    }

    /**
     * Get balance and total balance of account by address.
     *
     * @param {String} _address
     * @param {Boolean} [_withDelegations] Include delegations and staker info.
     * @param {Boolean} [_justBalance]
     * @return {Promise<{totalValue: string, address: string, balance: string}>}
     */
    async getBalance(_address, _withDelegations, _justBalance) {
        let query = gql`
            query AccountByAddress($address: Address!, $cursor: Cursor) {
                account(address: $address) {
                    address
                    balance
                    totalValue
                    delegations(cursor: $cursor) {
                        pageInfo {
                            first
                            last
                            hasNext
                            hasPrevious
                        }
                        totalCount
                        edges {
                            delegation {
                                pendingRewards {
                                    amount
                                }
                            }
                            cursor
                        }
                    }
                }
            }
        `;

        if (_justBalance) {
            query = gql`
                query AccountByAddress($address: Address!, $cursor: Cursor) {
                    account(address: $address) {
                        address
                        balance
                        delegations(cursor: $cursor) {
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            totalCount
                            edges {
                                delegation {
                                    pendingRewards {
                                        amount
                                    }
                                }
                                cursor
                            }
                        }
                    }
                }
            `;
        } else if (_withDelegations) {
            query = gql`
                query AccountByAddress($address: Address!, $cursor: Cursor) {
                    account(address: $address) {
                        address
                        balance
                        totalValue
                        staker {
                            id
                            createdTime
                            isActive
                        }
                        delegations(cursor: $cursor) {
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            totalCount
                            edges {
                                delegation {
                                    toStakerId
                                    createdTime
                                    amount
                                    amountDelegated
                                    amountInWithdraw
                                    claimedReward
                                    pendingRewards {
                                        amount
                                    }
                                    withdrawRequests {
                                        address
                                        account {
                                            address
                                        }
                                        stakerID
                                        withdrawRequestID
                                        createdTime
                                        withdrawTime
                                        amount
                                    }
                                }
                                cursor
                            }
                        }
                    }
                }
            `;
        }

        /*
        const data = await this.apolloClient.query({
            query,
            variables: {
                address: _address,
                cursor: null,
            },
            fetchPolicy: 'network-only',
        });
        */

        const data = await fFetch.fetchAllGQLQuery(
            {
                query,
                variables: {
                    address: _address,
                    cursor: null,
                },
            },
            'account.delegations'
        );

        return data.data ? data.data.account : {};
    }

    async getEstimateGas(_from = '', _to = '', _data = null, _value = 0) {
        // console.log(_from, _to, _data);
        try {
            const data = await fFetch.fetchGQLQuery(
                {
                    /*
                    query: gql`
                        query EstimateGas($from: Address, $to: Address, $data: String) {
                            estimateGas(from: $from, to: $to, data: $data)
                        }
                    `,
                    */
                    query: gql`
                        query EstimateGas($from: Address, $to: Address, $value: BigInt, $data: String) {
                            estimateGas(from: $from, to: $to, value: $value, data: $data)
                        }
                    `,
                    variables: {
                        from: _from || undefined,
                        to: _to || undefined,
                        value: _value || undefined,
                        data: _data || undefined,
                    },
                },
                'estimateGas'
            );

            let estimateGas = data.data ? data.data.estimateGas : '';

            if (estimateGas) {
                estimateGas = parseInt(estimateGas, 16);
                estimateGas = `0x${(estimateGas + 2000).toString(16)}`;
            } else if (data.errors && data.errors.length) {
                estimateGas = [];

                data.errors.forEach((error) => {
                    estimateGas.push(error.message);
                });

                estimateGas = estimateGas.join(',');
            }

            return estimateGas;
        } catch (_error) {
            return _error;
        }
    }

    /**
     * @param {Boolean} [_inHexFormat]
     * @return {Promise<*>}
     */
    async getGasPrice(_inHexFormat) {
        const data = await this.apolloClient.query({
            query: gql`
                query GasPrice {
                    gasPrice
                }
            `,
        });
        let { gasPrice } = data.data;
        const bDoubleGasPrice = toBigNumber(gasPrice).multipliedBy(2);

        // double gas price
        if (bDoubleGasPrice.comparedTo(this.bMaxGasPrice) === -1) {
            gasPrice = toHex(bDoubleGasPrice);
        }

        return _inHexFormat ? gasPrice : parseInt(gasPrice);
    }

    /**
     * Get account transaction count by address.
     *
     * @param {String} _address
     * @param {Boolean} [_inHexFormat]
     * @return {Promise<string>}
     */
    async getTransactionCount(_address, _inHexFormat) {
        const data = await this.apolloClient.query({
            query: gql`
                query AccountByAddress($address: Address!) {
                    account(address: $address) {
                        txCount
                    }
                }
            `,
            variables: {
                address: _address,
            },
            fetchPolicy: 'network-only',
        });

        return _inHexFormat ? data.data.account.txCount : parseInt(data.data.account.txCount);
    }

    /**
     * @param {number} _id
     * @return {Promise<*>}
     */
    async getStakerById(_id) {
        const data = await this.apolloClient.query({
            query: gql`
                query StakerById($id: BigInt!) {
                    staker(id: $id) {
                        id
                        stakerAddress
                        totalStake
                        stake
                        delegatedMe
                        totalDelegatedLimit
                        delegatedLimit
                        createdTime
                        downtime
                        isActive
                        isOffline
                        isStakeLocked
                        lockedFromEpoch
                        lockedUntil
                        stakerInfo {
                            name
                            website
                            contact
                            logoUrl
                        }
                    }
                }
            `,
            variables: {
                id: _id,
            },
            fetchPolicy: 'network-only',
        });

        return data.data.staker;
    }

    async fetchUnlockedAmount(_address, _validatorId) {
        try {
            const data = await this.apolloClient.query({
                query: gql`
                    query GetUnlockedAmount($address: Address!, $staker: BigInt!) {
                        delegation(address: $address, staker: $staker) {
                            unlockedAmount
                        }
                    }
                `,
                variables: {
                    address: _address,
                    staker: _validatorId,
                },
                fetchPolicy: 'network-only',
            });

            return data && data.data.delegation ? data.data.delegation.unlockedAmount : '';
        } catch (_error) {
            console.error(_error);
            return '';
        }
    }

    /**
     * Fetch all records.
     *
     * @param {ApolloQuery} _query
     * @param {string} _queryName
     * @return {Promise<[]>}
     */
    async fetchAll(_query, _queryName) {
        let edges = [];
        let pageInfo = { hasNext: true, last: null };
        let data;
        let item;

        while (pageInfo && pageInfo.hasNext) {
            _query.variables.cursor = pageInfo.last;

            data = await this.apolloClient.query(_query);

            item = data.data[_queryName];
            pageInfo = item.pageInfo;
            if (item.edges) {
                edges = edges.concat(item.edges);
            }
        }

        return edges;
    }

    /**
     * @param {WalletBlockchain} _blockchain
     * @return {string}
     */
    getBlockchainLabel(_blockchain) {
        const blockchain = this.blockchains.find((_item) => _item.value === _blockchain);

        if (blockchain) {
            return blockchain.label;
        }

        return '';
    }

    /**
     * Convert WEI to FTM.
     *
     * @param {String|Number|BN} _value
     * @return {String|BN}
     */
    WEIToFTM(_value) {
        return Web3.utils.fromWei(_value, 'ether');
    }

    /**
     * @param {number|string|array} _value
     * @return {string}
     */
    toWei(_value) {
        if (isArray(_value)) {
            return _value.map((_item) => this.toWei(_item));
        }

        if (typeof _value === 'string' && _value.indexOf('0x') === 0) {
            _value = parseInt(_value, 16);
        }

        return Web3.utils.toHex(Web3.utils.toWei(_value.toString(), 'ether'));
    }

    /**
     * @param {String|Number|BN|array} _value
     * @return {number}
     */
    fromWei(_value) {
        if (isArray(_value)) {
            return _value.map((_item) => this.fromWei(_item));
        }

        return parseFloat(Web3.utils.fromWei(_value, 'ether'));
    }

    /**
     * Are addresses the same?
     *
     * @param {String} _address1
     * @param {String} _address2
     * @return {boolean}
     */
    sameAddresses(_address1, _address2) {
        return _address1.toLowerCase() === _address2.toLowerCase();
    }

    /**
     * @param {String} _privateKey
     * @return {Account}
     */
    restoreAccountByPrivateKey(_privateKey) {
        return Web3.accounts.privateKeyToAccount(_privateKey);
    }

    /**
     * @param {String} _privateKey
     * @param {String} _password
     * @return {EncryptedKeystoreV3Json}
     */
    encryptToKeystore(_privateKey, _password) {
        return Web3.accounts.encrypt(_privateKey, _password);
    }

    /**
     * @param {Object} _keystoreJsonV3
     * @param {String} _password
     * @return {Account}
     */
    decryptFromKeystore(_keystoreJsonV3, _password) {
        return Web3.accounts.decrypt(_keystoreJsonV3, _password);
    }

    /**
     * @param {String} _publicAddress
     * @return {String}
     */
    getKeystoreFileName(_publicAddress) {
        return `UTC--${new Date().toISOString()} -- ${_publicAddress}`;
    }

    /**
     * @param {Object} _keystoreJsonV3
     */
    downloadKeystore(_keystoreJsonV3) {
        fileDownload(
            JSON.stringify(_keystoreJsonV3),
            `${this.getKeystoreFileName(this.toChecksumAddress(_keystoreJsonV3.address))}.json`
        );
    }

    /**
     * @return {Account}
     */
    createAccount() {
        return Web3.accounts.create();
    }

    /**
     * @param {String} _address
     * @return {String}
     */
    toChecksumAddress(_address) {
        return Web3.utils.toChecksumAddress(_address);
    }

    /**
     * @param {String} _pwd
     * @return {Boolean}
     */
    checkPrimaryPassword(_pwd) {
        return strongPasswordRE.test(_pwd) && _pwd.length < 200;
    }

    /**
     * Test and correct mnemonic phrase - must have 12 or 24 words ([a-z]) separated by space
     *
     * @param {String} _mnemonic
     * @return {String} Corrected mnemonic or empty string.
     */
    correctMnemonic(_mnemonic) {
        const mnemT = _mnemonic.trim();
        let mnemonic = '';
        let mnemArr;

        if (mnemonicRE.test(mnemT)) {
            mnemArr = mnemT.split(/\s+/g);
            if (mnemArr.length === 12 || mnemArr.length === 24) {
                mnemonic = mnemArr.join(' ');
            }
        }

        return mnemonic;
    }

    /**
     * Convert mnemonic phrase to public and private key
     *
     * @param {String} _mnemonic
     * @return {Promise<{privateKey: string, publicAddress: string}>}
     */
    async mnemonicToKeys(_mnemonic) {
        const seed = await bip39.mnemonicToSeed(_mnemonic);
        const root = Hdkey.fromMasterSeed(seed);
        const addrNode = root.derive("m/44'/60'/0'/0/0");
        const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
        const addr = '0x' + ethUtil.publicToAddress(pubKey).toString('hex');
        const publicAddress = ethUtil.toChecksumAddress(addr);
        const privateKey = ethUtil.bufferToHex(addrNode._privateKey);

        return { publicAddress, privateKey };
    }

    /**
     * Create mnemonic phrase and get private key and keystore file.
     *
     * @param {String} _pwd
     * @return {Promise<{privateKey: string, mnemonic: string, keystore: EncryptedKeystoreV3Json}>}
     */
    async createMnemonic(_pwd) {
        const mnemonic = bip39.generateMnemonic(256);
        const { privateKey } = await this.mnemonicToKeys(mnemonic);
        const keystore = this.encryptToKeystore(privateKey, _pwd);

        return { privateKey, mnemonic, keystore };
    }

    async getTransactionToSign({ from, to, value, memo = '' }) {
        const nonce = await this.getTransactionCount(from);
        const gasPrice = await this.getGasPrice(true);
        // let gasLimit = to ? await this.getEstimateGas(from, to, null, value) : '';
        let gasLimit = to ? await this.getEstimateGas(from, to, memo ? Web3.utils.asciiToHex(memo) : null, value) : '';
        let error = '';

        if (gasLimit && gasLimit.indexOf('0x') === -1) {
            error = gasLimit;
            gasLimit = '';
        }

        /*if (!gasLimit) {
            gasLimit = GAS_LIMITS.max;
        }*/

        return {
            value: value,
            // from,
            to: to,
            gas: gasLimit,
            gasLimit: gasLimit,
            chainId: FANTOM_CHAIN_ID,
            gasPrice,
            nonce,
            data: memo ? Web3.utils.asciiToHex(memo) : '0x',
            _error: error || undefined,
            _fee: !error ? this.WEIToFTM(this.getTransactionFee(gasPrice, gasLimit)) : 0,
        };
    }

    /**
     * @param {Object} _tx SFC transaction object.
     * @param {String} _from Address.
     * @param {String} [_gasLimit] Hex.
     * @return {Promise<{nonce: string, gasPrice: *}>}
     */
    async getSFCTransactionToSign(_tx, _from, _gasLimit = '') {
        const nonce = await this.getTransactionCount(_from);
        const gasPrice = await this.getGasPrice(true);
        let gasLimit =
            _gasLimit || (_tx && _tx.to ? await this.getEstimateGas(_from, _tx.to, _tx.data, _tx.value) : '');
        let error = '';

        if (gasLimit && gasLimit.indexOf('0x') === -1) {
            error = gasLimit;
            gasLimit = '';
        }

        /*if (!gasLimit) {
            gasLimit = GAS_LIMITS.max;
        }*/

        return {
            ..._tx,
            gasPrice,
            gas: gasLimit,
            gasLimit: gasLimit,
            nonce,
            _error: error || undefined,
            _fee: !error ? this.WEIToFTM(this.getTransactionFee(gasPrice, gasLimit)) : 0,
        };
    }

    /**
     * @param {Object} _tx Defi transaction object.
     * @param {String} _from Address.
     * @param {String} [_gasLimit] Hex.
     * @return {Promise<{nonce: string, gasPrice: *}>}
     */
    async getDefiTransactionToSign(_tx, _from, _gasLimit) {
        const nonce = await this.getTransactionCount(_from);
        const gasPrice = await this.getGasPrice(true);
        let gasLimit =
            _gasLimit || (_tx && _tx.to ? await this.getEstimateGas(_from, _tx.to, _tx.data, _tx.value) : '');
        let error = '';

        if (gasLimit && gasLimit.indexOf('0x') === -1) {
            error = gasLimit;
            gasLimit = '';
        }

        /*if (!gasLimit) {
            gasLimit = GAS_LIMITS.max;
        }*/

        return {
            ..._tx,
            gasPrice,
            gas: gasLimit,
            gasLimit: gasLimit,
            nonce,
            _error: error || undefined,
            _fee: !error ? this.WEIToFTM(this.getTransactionFee(gasPrice, gasLimit)) : 0,
        };
    }

    async signTransaction(_tx, _keystore, _password, _tmpPwdCode) {
        const { pwdStorage } = this;
        let password = _password;

        if (pwdStorage.isSet(_tmpPwdCode)) {
            if (!pwdStorage.isTimeoutSet()) {
                if (pwdO.count-- > 0) {
                    password = pwdO.pwd;
                }
            } else {
                password = pwdO.pwd;
            }
        }

        const account = this.decryptFromKeystore(_keystore, password);

        password = '';

        if (pwdStorage.isSet(_tmpPwdCode) && !pwdStorage.isTimeoutSet() && pwdO.count === 0) {
            pwdStorage.clear();
        }

        if (account) {
            const transaction = await account.signTransaction(_tx);

            return transaction.rawTransaction;
        }

        return null;
    }

    /*
    async signTransaction({ from, to, value, memo = '', gasLimit = '44000', keystore, password }) {
        const nonce = await this.getTransactionCount(from);
        const gasPrice = await this.getGasPrice(true);
        const tx = {
            value: value,
            // from,
            to: to,
            gas: gasLimit,
            chainId: FANTOM_CHAIN_ID,
            gasPrice,
            nonce,
            data: memo ? Web3.utils.asciiToHex(memo) : '',
        };

        const account = this.decryptFromKeystore(keystore, password);
        if (account) {
            const transaction = await account.signTransaction(tx);

            return transaction.rawTransaction;
        }

        return null;
    }
    */

    /*
    async estimateFee({ from, to, value, memo }) {
        const { web3 } = this;
        const gasPrice = await this.getGasPrice(true);
        const gasUsed = await web3.eth.estimateGas({
            from,
            to,
            value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
            data: web3.utils.asciiToHex(memo),
        });

        return this.getTransactionFee(gasPrice, gasUsed);

    }

    */

    /**
     * Get instance of BN.
     *
     * @param {*} _number
     * @return {BN}
     */
    toBN(_number) {
        return Web3.utils.toBN(_number);
    }

    /**
     * Split mnemonic phrase.
     *
     * @param {String} _mnemonic
     * @return {Array}
     */
    getMnemonicArray(_mnemonic) {
        return _mnemonic ? _mnemonic.split(/\s+/g) : [];
    }

    /**
     * Get transaction fee in WEI.
     *
     * @param {*} _gasPrice
     * @param {string} _gasLimit
     * @return {BN}
     */
    getTransactionFee(_gasPrice, _gasLimit = GAS_LIMITS.default) {
        if (!_gasLimit) {
            _gasLimit = GAS_LIMITS.default;
        }

        // const gasPrice = _gasPrice || await this.getGasPrice(true);
        return this.toBN(_gasPrice).mul(this.toBN(_gasLimit));
    }

    /**
     * Get the remaining balance (in FTM) after deducting transaction fee.
     *
     * @param {*} _balance
     * @param {*} _gasPrice
     * @param {string} [_gasLimit]
     * @return {number}
     */
    getRemainingBalance(_balance, _gasPrice, _gasLimit) {
        const fee = this.getTransactionFee(_gasPrice, _gasLimit || '');
        const balance = this.toBN(_balance);

        return parseFloat(this.WEIToFTM(balance.sub(fee.mul(this.toBN(2)))));
    }

    /**
     * Get the remaining balance (in FTM) after deducting transaction fee.
     *
     * @param {*} _balance
     * @param {*} _gasPrice
     * @return {number}
     */
    getMaxRemainingBalance(_balance, _gasPrice) {
        const fee = this.getTransactionFee(_gasPrice, GAS_LIMITS.max);
        const balance = this.toBN(_balance);

        return parseFloat(this.WEIToFTM(balance.sub(fee.mul(this.toBN(1)))));
    }

    /**
     * @param {String} _key
     * @return {String}
     */
    isPrivateKey(_key) {
        let pk = _key;

        if (pk.substring(0, 2) !== '0x') {
            pk = `0x${pk}`;
        }

        if (pk.length !== 66 || !Web3.utils.isHexStrict(pk)) {
            pk = '';
        }

        return pk;
    }

    /**
     * @param _address
     * @param {('fantom' | 'ethereum' | 'binance')} _blockchain
     * @return {boolean}
     */
    isValidAddress(_address, _blockchain = 'fantom') {
        if (_blockchain === 'fantom' || _blockchain === 'ethereum') {
            return Web3.utils.isHexStrict(_address) && Web3.utils.isAddress(_address);
        } else if (_blockchain === 'binance') {
            return _address.length === BNB_ADDRESS_LENGTH && _address.indexOf('bnb') === 0;
        }

        return false;
    }
}
