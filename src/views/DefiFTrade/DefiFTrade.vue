<template>
    <div class="view-defi-ftrade">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> Trade (WIP)</h1>

        <div class="grid">
            <div class="from-col">
                <f-select-button @click.native="onFromTokenSelectorClick">
                    <f-crypto-symbol :token="fromToken" />
                </f-select-button>
                <div class="defi-price-input">
                    <input
                        :id="`text-input-${id}`"
                        ref="input"
                        :value="fromInputValue"
                        type="number"
                        step="any"
                        class="text-input no-style"
                        @change="onFromInputChange"
                    />
                </div>
            </div>
            <div class="swap-col">
                <button class="btn large round same-size light" title="Swap Tokens" @click="swapTokens">
                    <icon data="@/assets/svg/exchange-alt.svg" width="24" height="24" dir="right" aria-hidden="true" />
                </button>
            </div>
            <div class="to-col">
                <f-select-button @click.native="onToTokenSelectorClick">
                    <f-crypto-symbol :token="toToken" />
                </f-select-button>
                <div class="defi-price-input">
                    <input
                        :id="`text-input-${id}`"
                        ref="input"
                        :value="toInputValue"
                        type="number"
                        step="any"
                        class="text-input no-style"
                        @change="onToInputChange"
                    />
                </div>
            </div>
        </div>

        <defi-token-picker-window
            ref="pickFromTokenWindow"
            :tokens="fromTokens"
            @defi-token-picked="onFromTokenPicked"
        />
        <defi-token-picker-window ref="pickToTokenWindow" :tokens="toTokens" @defi-token-picked="onToTokenPicked" />
    </div>
</template>

<script>
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import { mapGetters } from 'vuex';
import FCryptoSymbol from '../../components/core/FCryptoSymbol/FCryptoSymbol.vue';
import FSelectButton from '../../components/core/FSelectButton/FSelectButton.vue';
import DefiTokenPickerWindow from '../../components/windows/DefiTokenPickerWindow/DefiTokenPickerWindow.vue';
import { getUniqueId } from '../../utils';

export default {
    name: 'DefiFTrade',

    components: { DefiTokenPickerWindow, FSelectButton, FCryptoSymbol, FBackButton },

    data() {
        return {
            /** @type {DefiAccount} */
            defiAccount: {
                collateral: [],
                debt: [],
            },
            fromValue: 0,
            /** @type {DefiToken} */
            fromToken: {},
            toValue: 0,
            /** @type {DefiToken} */
            toToken: {},
            /** @type {DefiToken[]} */
            tokens: [],
            id: getUniqueId(),
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-ftrade');

            return parentNode ? parentNode.route : '';
        },

        fromInputValue() {
            return this.formatInputValue(this.fromValue);
        },

        toInputValue() {
            return this.formatInputValue(this.toValue);
        },

        fromTokens() {
            return this.getPickerTokens('from');
        },

        toTokens() {
            return this.getPickerTokens('to');
        },
    },

    created() {
        this.init();
    },

    methods: {
        async init() {
            const { $defi } = this;
            const result = await Promise.all([
                $defi.fetchDefiAccount(this.currentAccount.address),
                $defi.fetchTokens(),
                $defi.init(),
            ]);

            this.defiAccount = result[0];
            this.tokens = result[1].filter($defi.canTokenBeTraded);

            if (this.tokens.length >= 2) {
                this.fromToken = this.tokens[0];
                this.toToken = this.tokens[1];
            }
        },

        swapTokens() {
            const hToken = this.fromToken;

            this.fromToken = this.toToken;
            this.toToken = hToken;
        },

        formatInputValue(_value) {
            // return parseFloat(_value).toFixed(2);
            return _value;
        },

        /**
         * Get token list for `defi-token-picker-window`.
         *
         * @type {('from'|'to')} [_type]
         * @return {DefiToken[]}
         */
        getPickerTokens(_type = 'from') {
            let token = _type === 'from' ? this.fromToken : this.toToken;

            return this.tokens.map((_item) => {
                return { ..._item, _disabled: _item.address === token.address };
            });
        },

        onFromTokenSelectorClick() {
            this.$refs.pickFromTokenWindow.show();
        },

        onToTokenSelectorClick() {
            this.$refs.pickToTokenWindow.show();
        },

        /**
         * @param {DefiToken} _token Picked token.
         */
        onFromTokenPicked(_token) {
            console.log('from picked token', _token);

            if (_token.address === this.toToken.address) {
                this.swapTokens();
            } else {
                this.fromToken = _token;
            }
        },

        /**
         * @param {DefiToken} _token Picked token.
         */
        onToTokenPicked(_token) {
            console.log('to picked token', _token);

            if (_token.address === this.fromToken.address) {
                this.swapTokens();
            } else {
                this.toToken = _token;
            }
        },

        onFromInputChange() {
            // _event.target.value = this.formatInputValue(this.currDebt);
        },

        onToInputChange() {
            // _event.target.value = this.formatInputValue(this.currDebt);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
