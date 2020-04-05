import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// mutations types
export const SET_BREAKPOINT = 'setBreakpoint';
export const SET_TOKEN_PRICE = 'setTokenPrice';

export const store = new Vuex.Store({
    state: {
        breakpoints: {},
        tokenPrice: 0
    },

    mutations: {
        /**
         * @param {object} _state
         * @param {object} _breakpoint
         */
        [SET_BREAKPOINT](_state, _breakpoint) {
            _state.breakpoints = {..._state.breakpoints, ...{[_breakpoint.code]: _breakpoint}};
        },

        /**
         * @param {object} _state
         * @param {number} _tokenPrice
         */
        [SET_TOKEN_PRICE](_state, _tokenPrice) {
            _state.tokenPrice = _tokenPrice;
        }
    }
});
