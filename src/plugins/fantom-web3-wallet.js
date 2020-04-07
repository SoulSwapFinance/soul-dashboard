/**
 * Fantom web3 wallet plugin for VUE, based on https://github.com/Fantom-foundation/fantom-web3-wallet
 */

export let fWallet = null;

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

    async getBalance(_address) {
        return await this.web3.eth.getBalance(_address);
    }

    restoreAccountByPrivateKey(_privateKey) {
        return this.web3.eth.accounts.privateKeyToAccount(_privateKey);
    }

    encryptToKeystore(_privateKey, _password) {
        return this.web3.eth.accounts.encrypt(_privateKey, _password);
    }

    decryptFromKeystore(_keystoreJsonV3, _password) {
        return this.web3.eth.accounts.decrypt(_keystoreJsonV3, _password);
    }

    createAccount() {
        return this.web3.eth.accounts.create();
    }

    toChecksumAddress(_address) {
        return this.web3.utils.toChecksumAddress(_address);
    }

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
