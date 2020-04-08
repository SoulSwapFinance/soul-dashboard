// const strongPasswordRE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const strongPasswordRE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?=.{8,})/;

/** @type {FantomWeb3Wallet} */
export let fWallet = null;

// Fantom web3 wallet plugin for VUE, based on https://github.com/Fantom-foundation/fantom-web3-wallet
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
    }

    /**
     * @param {String} _address
     * @return {Promise<string>}
     */
    async getBalance(_address) {
        return await this.web3.eth.getBalance(_address);
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
}
