<template>
    <div class="defi-token-list">
        <ul class="no-markers" @click="onTokenListClick">
            <li v-for="token in dTokens" :key="token.address" :data-token-address="token.address" tabindex="0">
                <icon
                    v-if="cryptoLogos[token.symbol]"
                    :data="cryptoLogos[token.symbol]"
                    width="24"
                    height="24"
                    original
                    aria-hidden="true"
                />
                {{ $defi.getTokenSymbol(token) }}
            </li>
        </ul>
    </div>
</template>

<script>
import { cloneObject } from '../../utils';
import ethIcon from '../../assets/svg/crypto-logos/eth.svg';
import btcIcon from '../../assets/svg/crypto-logos/btc.svg';

export default {
    name: 'DefiTokenList',

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
            /** Keys are token symbols. */
            cryptoLogos: {
                FETH: ethIcon,
                FBTC: btcIcon,
            },
        };
    },

    watch: {
        tokens(_value) {
            this.setDTokens(_value);
            console.log(_value);
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
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
