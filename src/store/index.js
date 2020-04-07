import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import { APPEND_ACCOUNT, SET_BREAKPOINT, SET_TOKEN_PRICE } from './mutations.type.js';
import { ADD_ACCOUNT } from './actions.type.js';
import { fWallet } from '../plugins/fantom-web3-wallet.js';
import { WEIToFTM } from '../utils/transactions.js';

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

export const store = new Vuex.Store({
    plugins: vuexPlugins,

    state: {
        breakpoints: {},
        tokenPrice: 0,
        accounts: [],
        currAccountIndex: -1,
    },

    getters: {
        accounts(_state) {
            return _state.accounts;
        },

        currentAccount(_state) {
            return _state.currAccountIndex > -1 ? _state.accounts[_state.currAccountIndex] : null;
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
         * @param {Object} _account
         */
        [APPEND_ACCOUNT](_state, _account) {
            // if account is not created already
            if (!_state.accounts.find((_item) => _item.address === _account.address)) {
                _state.accounts.push(_account);
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
                balance: WEIToFTM(balance),
                keystore: _keystore,
            };

            _context.commit(APPEND_ACCOUNT, account);
        },
    },
});
