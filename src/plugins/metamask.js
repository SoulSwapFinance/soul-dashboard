import detectEthereumProvider from '@metamask/detect-provider';
import appConfig from '../../app.config.js';
import Web3 from 'web3';

const OPERA_CHAIN_ID = appConfig.chainId;

/** @type {Metamask} */
export let metamask = null;

/**
 * Plugin for communication with Metamask.
 */
export class Metamask {
    /**
     * @param {Vue} _Vue
     */
    static install(_Vue) {
        if (!metamask) {
            metamask = new Metamask();
            _Vue.prototype.$metamask = metamask;
        }
    }

    constructor() {
        /**
         * Metamask provider.
         *
         * @type {null}
         * @private
         */
        this._provider = null;
        /** Signals, if Metamask is installed. */
        this._installed = false;
        this._initialized = false;
        this._web3 = null;

        this.init();
    }

    async init() {
        if (!this._initialized) {
            this._initialized = true;

            await this._detectProvider();

            if (this._provider) {
                this._web3 = new Web3(this._provider);

                this._provider.autoRefreshOnNetworkChange = false;
                this._provider.on('chainChanged', this._onChainChange);
                this._provider.on('accountsChanged', this._onAccountsChange);

                console.log('is correct chain id', this.isCorrectChainId());

                // this._web3.eht.a
            }
        }
    }

    _onChainChange(_chainId) {
        console.log('JO!', _chainId);
    }

    _onAccountsChange(_account) {
        console.log('accounts change', _account);
    }

    /**
     * Signals, if Metamask is installed.
     *
     * @return {boolean}
     */
    isInstalled() {
        return this._installed;
    }

    isCorrectChainId() {
        return this._provider && this._provider.chainId === OPERA_CHAIN_ID;
    }

    async getAccounts() {
        let accounts = [];

        if (this._provider) {
            try {
                accounts = await this._provider.request({ method: 'eth_accounts' });
            } catch (_error) {
                console.error(_error);
            }
        }

        return accounts;
    }

    async requestAccounts() {
        if (this._provider) {
            try {
                const accounts = await this._provider.request({ method: 'eth_requestAccounts' });

                return accounts;
            } catch (_error) {
                // userRejectedRequest error
                if (_error.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    // If this happens, the user rejected the connection request.
                    console.log('Please connect to MetaMask.');
                } else {
                    console.error(_error);
                }
            }
        }
    }

    /**
     * Detect the MetaMask Ethereum provider.
     *
     * @private
     */
    async _detectProvider() {
        const provider = await detectEthereumProvider();

        if (provider) {
            if (provider === window.ethereum) {
                this._provider = provider;
                this._installed = true;
            } else {
                console.error('Do you have multiple wallets installed?');
            }
        }
    }
}
