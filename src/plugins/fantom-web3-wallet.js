/**
 * Fantom web3 wallet plugin for VUE, based on https://github.com/Fantom-foundation/fantom-web3-wallet
 */
export default {
    install(_Vue, _options) {
        const Web3 = _options.Web3;
        const httpProvider = _options.httpProvider;

        if (!Web3) {
            throw new Error('Set Web3 library');
        }

        if (!httpProvider) {
            throw new Error('Set http provider for Web3');
        }

        const web3 = new Web3(httpProvider);

        _Vue.prototype.$fWallet = {
            web3,

            async getBalance(_address) {
                return await web3.eth.getBalance(_address);
            },

            restoreAccountByPrivateKey(_privateKey) {
                return web3.eth.accounts.privateKeyToAccount(_privateKey);
            },

            encryptToKeystore(_privateKey, _password) {
                return web3.eth.accounts.encrypt(_privateKey, _password);
            },

            decryptFromKeystore(_keystoreJsonV3, _password) {
                return web3.eth.accounts.decrypt(_keystoreJsonV3, _password);
            },

            createAccount() {
                return web3.eth.accounts.create();
            },

            toChecksumAddress(_address) {
                return web3.utils.toChecksumAddress(_address);
            },

            isPrivateKey(_key) {
                let pk = _key;

                if (pk.substring(0, 2) !== '0x') {
                    pk = `0x${pk}`;
                }

                if (pk.length !== 66 || !web3.utils.isHexStrict(pk)) {
                    pk = '';
                }

                return pk;
            },
        };
    },
};
