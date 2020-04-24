import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import {
    APPEND_ACCOUNT,
    DEACTIVATE_ACTIVE_ACCOUNT,
    REMOVE_ACTIVE_ACCOUNT,
    SET_ACTIVE_ACCOUNT_ADDRESS,
    SET_ACTIVE_ACCOUNT_BY_ADDRESS,
    SET_BREAKPOINT,
    SET_TOKEN_PRICE,
} from './mutations.type.js';
import { ADD_ACCOUNT, ADD_LEDGER_ACCOUNT, UPDATE_ACCOUNT_BALANCE, UPDATE_ACCOUNTS_BALANCES } from './actions.type.js';
import { fWallet } from '../plugins/fantom-web3-wallet.js';

Vue.use(Vuex);

const vuexPlugins = [];

const vuexLocalStorage = new VuexPersist({
    // The key to store the state on in the storage provider.
    key: 'vuex',
    // TODO: write custom storage for chrome.storage
    storage: window.localStorage,
    // Function that passes the state and returns the state with only the Objects you want to store.
    reducer: (_state) => ({
        tokenPrice: _state.tokenPrice,
        accounts: _state.accounts,
    }),
});

vuexPlugins.push(vuexLocalStorage.plugin);

/**
 * @param {array} _accounts
 * @param {string} _address
 * @return {number}
 */
function getAccountIdxByAddress(_accounts, _address) {
    let idx = -1;

    for (let i = 0, len1 = _accounts.length; i < len1; i++) {
        if (_accounts[i].address === _address) {
            idx = i;
            break;
        }
    }

    return idx;
}

export const store = new Vuex.Store({
    plugins: vuexPlugins,

    state: {
        breakpoints: {},
        tokenPrice: 0,
        /** @type {[{address: String, balance: string, keystore: object, balanceFTM: (String|BN)}]} */
        accounts: [],
        // index of active stored account
        activeAccountIndex: -1,
        activeAccountAddress: '',
    },

    getters: {
        accounts(_state) {
            return _state.accounts;
        },

        currentAccount(_state) {
            return _state.activeAccountIndex > -1 ? _state.accounts[_state.activeAccountIndex] : null;
        },

        currentAccountAddress(_state) {
            return _state.activeAccountAddress;
        },

        getAccountByAddress(_state) {
            return (_address) => {
                const address = fWallet.toChecksumAddress(_address);

                return _state.accounts.find((_item) => _item.address === address);
            };
        },
    },

    mutations: {
        /**
         * @param {Object} _state
         * @param {Object} _breakpoint
         */
        [SET_BREAKPOINT](_state, _breakpoint) {
            _state.breakpoints = {
                ..._state.breakpoints,
                ...{ [_breakpoint.code]: _breakpoint },
            };
        },

        /**
         * @param {Object} _state
         * @param {number} _tokenPrice
         */
        [SET_TOKEN_PRICE](_state, _tokenPrice) {
            _state.tokenPrice = _tokenPrice;
        },

        /**
         * @param {Object} _state
         * @param {String} _address
         */
        [SET_ACTIVE_ACCOUNT_BY_ADDRESS](_state, _address) {
            const { accounts } = _state;
            const address = fWallet.toChecksumAddress(_address);

            _state.activeAccountIndex = -1;

            for (let i = 0, len1 = accounts.length; i < len1; i++) {
                if (accounts[i].address === address) {
                    _state.activeAccountIndex = i;
                    break;
                }
            }
        },

        /**
         * @param {Object} _state
         * @param {String} _address
         */
        [SET_ACTIVE_ACCOUNT_ADDRESS](_state, _address) {
            _state.activeAccountAddress = fWallet.toChecksumAddress(_address);
        },

        /**
         * @param {Object} _state
         */
        [DEACTIVATE_ACTIVE_ACCOUNT](_state) {
            _state.activeAccountIndex = -1;
            _state.activeAccountAddress = '';
        },

        /**
         * @param {Object} _state
         * @param {Object} _account
         */
        [APPEND_ACCOUNT](_state, _account) {
            // if account is not created already
            if (!_state.accounts.find((_item) => _item.address === _account.address)) {
                _state.accounts.push(_account);
            }
        },

        /**
         * @param {Object} _state
         */
        [REMOVE_ACTIVE_ACCOUNT](_state) {
            if (_state.activeAccountIndex > -1) {
                _state.accounts.splice(_state.activeAccountIndex, 1);
                _state.activeAccountIndex = -1;
            }
        },
    },

    actions: {
        /**
         * @param {Object} _context
         * @param {Object} _keystore
         */
        async [ADD_ACCOUNT](_context, _keystore) {
            const address = fWallet.toChecksumAddress(_keystore.address);
            const balance = await fWallet.getBalance(address);
            const account = {
                address,
                balance: balance,
                balanceFTM: fWallet.WEIToFTM(balance),
                keystore: _keystore,
            };

            _context.commit(APPEND_ACCOUNT, account);
        },

        /**
         * @param {Object} _context
         * @param {String} _address
         */
        async [ADD_LEDGER_ACCOUNT](_context, _address) {
            const address = fWallet.toChecksumAddress(_address);

            if (!_context.getters.getAccountByAddress(address)) {
                const balance = await fWallet.getBalance(address);
                const account = {
                    address,
                    balance: balance,
                    balanceFTM: fWallet.WEIToFTM(balance),
                    isLedgerAccount: true,
                };

                _context.commit(APPEND_ACCOUNT, account);
            }
        },

        /**
         * @param {Object} _context
         */
        async [UPDATE_ACCOUNTS_BALANCES](_context) {
            const accounts = _context.getters.accounts;
            let balance = 0;
            // const balances = await Promise.all(accounts.map((_address) => fWallet.getBalance(_address.address)));

            for (let i = 0, len1 = accounts.length; i < len1; i++) {
                balance = await fWallet.getBalance(accounts[i].address);
                accounts.splice(i, 1, {
                    ...accounts[i],
                    balance,
                    balanceFTM: fWallet.WEIToFTM(balance),
                });
            }
        },

        /**
         * @param {Object} _context
         * @param {Object} [_account]
         */
        async [UPDATE_ACCOUNT_BALANCE](_context, _account) {
            const account = _account || _context.getters.currentAccount;

            if (account) {
                const accounts = _context.getters.accounts;
                const idx = getAccountIdxByAddress(accounts, account.address);
                const balance = await fWallet.getBalance(account.address);

                if (idx > -1) {
                    accounts.splice(idx, 1, {
                        ...account,
                        balance,
                        balanceFTM: fWallet.WEIToFTM(balance),
                    });
                }
            }
        },
    },
});
