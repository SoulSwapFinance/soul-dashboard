import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import { SET_BREAKPOINT, SET_PRIVATE_KEY, SET_TOKEN_PRICE } from './mutations.type.js';

Vue.use(Vuex);

const vuexPlugins = [];

const vuexLocalStorage = new VuexPersist({
    // The key to store the state on in the storage provider.
    key: 'vuex',
    storage: window.localStorage,
    // Function that passes the state and returns the state with only the objects you want to store.
    reducer: (_state) => ({
        tokenPrice: _state.tokenPrice,
    }),
});

vuexPlugins.push(vuexLocalStorage.plugin);

export const store = new Vuex.Store({
    plugins: vuexPlugins,

    state: {
        breakpoints: {},
        tokenPrice: 0,
        pk: '',
        accounts: [],
        currAccountIndex: -1,
    },

    getters: {
        currentAccount(_state) {
            return _state.currAccountIndex > -1 ? _state.account[_state.currAccountIndex] : null;
        },

        pk(_state) {
            return _state.pk;
        },
    },

    mutations: {
        /**
         * @param {object} _state
         * @param {object} _breakpoint
         */
        [SET_BREAKPOINT](_state, _breakpoint) {
            _state.breakpoints = {
                ..._state.breakpoints,
                ...{ [_breakpoint.code]: _breakpoint },
            };
        },

        /**
         * @param {object} _state
         * @param {number} _tokenPrice
         */
        [SET_TOKEN_PRICE](_state, _tokenPrice) {
            _state.tokenPrice = _tokenPrice;
        },

        /**
         * Clear private key if you don't need it anymore!
         *
         * @param {object} _state
         * @param {number} _privateKey
         */
        [SET_PRIVATE_KEY](_state, _privateKey) {
            _state.pk = _privateKey;
        },
    },
});
