<template>
    <div class="defi-token-list">
        <ul class="no-markers" @click="onTokenListClick" @keyup="onTokenListKeyup">
            <li v-for="token in dTokens" :key="token.address" :data-token-address="token.address" tabindex="0">
                <f-crypto-symbol :token="token" img-width="40px" img-height="40px" />
            </li>
        </ul>
    </div>
</template>

<script>
import { cloneObject } from '../../utils';
import { isAriaAction } from '../../utils/aria.js';
import FCryptoSymbol from '../core/FCryptoSymbol/FCryptoSymbol.vue';

export default {
    name: 'DefiTokenList',
    components: { FCryptoSymbol },
    props: {
        /** @type {DefiToken[]} */
        tokens: {
            type: Array,
            default() {
                return [];
            },
        },
    },

    data() {
        return {
            dTokens: [],
        };
    },

    watch: {
        tokens(_value) {
            this.setDTokens(_value);
        },
    },

    created() {
        this.setDTokens(this.tokens);
    },

    methods: {
        setDTokens(_tokens) {
            if (_tokens && _tokens.length > 0) {
                // accept only active tokens
                this.dTokens = _tokens.filter((_item) => _item.isActive);
            }
        },

        /**
         * @param {Event} _event
         */
        onTokenListClick(_event) {
            const elem = _event.target.closest('[data-token-address]');
            const address = elem ? elem.getAttribute('data-token-address') : '';
            const token = address ? this.dTokens.find((_item) => _item.address === address) : null;

            if (token) {
                this.$emit('defi-token-picked', cloneObject(token));
            }
        },

        /**
         * @param {KeyboardEvent} _event
         */
        onTokenListKeyup(_event) {
            if (isAriaAction(_event)) {
                this.onTokenListClick(_event);
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
