<template>
    <div class="defi-token-list">
        <f-listbox ref="listbox" :data="dTokens" @item-selected="onListboxItemSelected">
            <template v-slot="{ item }">
                <div class="row align-items-center no-collapse">
                    <div class="col"><f-crypto-symbol :token="item" img-width="40px" img-height="40px" /></div>
                    <div class="col available-balance">{{ getAvailableBalance(item) }}</div>
                </div>
            </template>
        </f-listbox>
    </div>
</template>

<script>
import { cloneObject, defer } from '../../utils';
import FCryptoSymbol from '../core/FCryptoSymbol/FCryptoSymbol.vue';
import FListbox from '@/components/core/FListbox/FListbox.vue';

export default {
    name: 'DefiTokenList',

    components: { FListbox, FCryptoSymbol },

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

    mounted() {
        defer(() => {
            this.$refs.listbox.$el.focus();
        });
    },

    methods: {
        /**
         * @param {DefiToken[]} _tokens
         */
        setDTokens(_tokens) {
            if (_tokens && _tokens.length > 0) {
                // accept only active tokens
                this.dTokens = _tokens.filter((_item) => _item.isActive);
            }
        },

        /**
         * @param {DefiToken} _token
         * @return {number}
         */
        getAvailableBalance(_token) {
            const balance = this.$defi.fromTokenValue(_token.availableBalance, _token) || 0;

            return balance > 0 ? balance.toFixed(this.$defi.getTokenDecimals(_token)) : 0;
        },

        /**
         * @param {ERC20Token} _token
         */
        onListboxItemSelected(_token) {
            if (_token) {
                this.$emit('defi-token-picked', cloneObject(_token));
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
