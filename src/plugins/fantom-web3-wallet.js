// import Bip39 from 'bip39';
import fileDownload from 'js-file-download';
import gql from 'graphql-tag';

const bip39 = require('bip39');
const Hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
// const strongPasswordRE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const strongPasswordRE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?=.{8,})/;
const mnemonicRE = /^[ a-z]+$/;

const FANTOM_CHAIN_ID = 0xfa;

/** @type {FantomWeb3Wallet} */
export let fWallet = null;

// Fantom web3 wallet plugin for VUE, based on https://git`hub.com/Fantom-foundation/fantom-web3-wallet
export class FantomWeb3Wallet {
    static install(_Vue, _options) {
        fWallet = new FantomWeb3Wallet(_options);
        _Vue.prototype.$fWallet = fWallet;
    }

    constructor(_options) {
        const Web3 = _options.Web3;
        const httpProvider = _options.httpProvider;

        if (!Web3) {
            throw new Error('No Web3 library');
        }

        if (!httpProvider) {
            throw new Error('No http provider set for Web3');
        }

        this.web3 = new Web3(httpProvider);
        this.apolloClient = _options.apolloClient;
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
        });

        if (!data.data.price) {
            return;
        }

        let tokenPrice = parseFloat(data.data.price.price);

        tokenPrice = parseInt(tokenPrice * 100000) / 100000;

        return tokenPrice;
    }

    /**
     * Get balance of account by address.
     *
     * @param {String} _address
     * @return {Promise<string>}
     */
    async getBalance(_address) {
        const data = await this.apolloClient.query({
            query: gql`
                query AccountByAddress($address: Address!) {
                    account(address: $address) {
                        address
                        balance
                        totalValue
                    }
                }
            `,
            variables: {
                address: _address,
            },
        });

        return data.data.account.balance;
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

        return _inHexFormat ? data.data.gasPrice : parseInt(data.data.gasPrice);
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
        });

        return _inHexFormat ? data.data.account.txCount : parseInt(data.data.account.txCount);
    }

    /**
     * Convert WEI to FTM.
     *
     * @param {String|Number|BN} _value
     * @return {String|BN}
     */
    WEIToFTM(_value) {
        return this.web3.utils.fromWei(_value, 'ether');
    }

    /**
     * @param {String} _privateKey
     * @return {Account}
     */
    restoreAccountByPrivateKey(_privateKey) {
        return this.web3.eth.accounts.privateKeyToAccount(_privateKey);
    }

    /**
     * @param {String} _privateKey
     * @param {String} _password
     * @return {EncryptedKeystoreV3Json}
     */
    encryptToKeystore(_privateKey, _password) {
        return this.web3.eth.accounts.encrypt(_privateKey, _password);
    }

    /**
     * @param {Object} _keystoreJsonV3
     * @param {String} _password
     * @return {Account}
     */
    decryptFromKeystore(_keystoreJsonV3, _password) {
        return this.web3.eth.accounts.decrypt(_keystoreJsonV3, _password);
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
        return this.web3.eth.accounts.create();
    }

    /**
     * @param {String} _address
     * @return {String}
     */
    toChecksumAddress(_address) {
        return this.web3.utils.toChecksumAddress(_address);
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
        const addr = ethUtil.publicToAddress(pubKey).toString('hex');
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
            data: memo ? this.web3.utils.asciiToHex(memo) : '',
        };

        const account = this.decryptFromKeystore(keystore, password);
        if (account) {
            const transaction = await account.signTransaction(tx);

            return transaction.rawTransaction;
        }

        return null;
    }

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
        return this.web3.utils.toBN(_number);
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
     * @param _gasLimit
     * @return {BN}
     */
    getTransactionFee(_gasPrice, _gasLimit = 44000) {
        // const gasPrice = _gasPrice || await this.getGasPrice(true);
        return this.toBN(_gasPrice).mul(this.toBN(_gasLimit));
    }

    /**
     * Get the remaining balance (in FTM) after deducting transaction fee.
     *
     * @param {*} _balance
     * @param {*} _gasPrice
     * @param _gasLimit
     * @return {number}
     */
    getRemainingBalance(_balance, _gasPrice, _gasLimit) {
        const fee = this.getTransactionFee(_gasPrice, _gasLimit);
        const balance = this.toBN(_balance);

        return this.WEIToFTM(balance.sub(fee.mul(this.toBN(2))));
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

        if (pk.length !== 66 || !this.web3.utils.isHexStrict(pk)) {
            pk = '';
        }

        return pk;
    }

    /**
     * @param _address
     * @return {boolean}
     */
    isValidAddress(_address) {
        return this.web3.utils.isHexStrict(_address) && this.web3.utils.isAddress(_address);
    }
}
