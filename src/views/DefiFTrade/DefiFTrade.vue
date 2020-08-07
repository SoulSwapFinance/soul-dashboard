<template>
    <div class="view-defi-ftrade">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> Trade</h1>

        <div class="grid">
            <div class="from-col">
                <div class="defi-label">From</div>
                <f-select-button @click.native="onFromTokenSelectorClick">
                    <div class="sb-content">
                        <f-crypto-symbol :token="fromToken" />
                        <span>{{ fromTokenBalance.toFixed(5) }}</span>
                    </div>
                </f-select-button>
                <div class="defi-price-input">
                    <input
                        :id="`text-input-${id}`"
                        ref="input"
                        :value="fromInputValue === 0 ? '' : fromInputValue"
                        type="number"
                        placeholder="0"
                        step="any"
                        min="0"
                        :max="maxFromInputValue"
                        class="text-input no-style"
                        @change="onFromInputChange"
                        @keydown="onInputKeydown"
                    />
                </div>
            </div>
            <div class="f-slider-wrap">
                <f-slider
                    ref="slider"
                    v-model="currFromValue"
                    step="any"
                    min="0"
                    :max="maxFromInputValue.toString()"
                    :labels="sliderLabels"
                    clickable-labels
                    use-lower-fill-bar
                >
                    <template #top="sProps">
                        <label :for="sProps.inputId" class="not-visible">slider label</label>
                    </template>
                </f-slider>
            </div>
            <div class="swap-col">
                <button class="btn large round same-size light" title="Swap Tokens" @click="swapTokens">
                    <icon data="@/assets/svg/defi/ftrade.svg" width="24" height="24" aria-hidden="true" />
                </button>
            </div>
            <div class="to-col">
                <div class="defi-label">To</div>
                <f-select-button @click.native="onToTokenSelectorClick">
                    <div class="sb-content">
                        <f-crypto-symbol :token="toToken" />
                        <span>{{ toTokenBalance.toFixed(5) }}</span>
                    </div>
                </f-select-button>
                <div class="defi-price-input">
                    <input
                        :id="`text-input-${id}`"
                        ref="input"
                        :value="toInputValue === 0 ? '' : toInputValue"
                        type="number"
                        placeholder="0"
                        step="any"
                        min="0"
                        :max="maxToInputValue"
                        class="text-input no-style"
                        @change="onToInputChange"
                        @keydown="onInputKeydown"
                    />
                </div>
            </div>
            <div class="swap-cont">
                <!--
                <div>
                    <div class="defi-label">Current rate</div>
                    <div class="value">{{ toTokenPrice }}</div>
                </div>
-->
                <div class="swap-col">
                    <button class="btn round same-size light" title="Swap Tokens" @click="swapTokens">
                        <icon
                            data="@/assets/svg/defi/ftrade.svg"
                            width="20"
                            height="20"
                            dir="right"
                            aria-hidden="true"
                        />
                    </button>
                </div>
                <!--
                <div class="align-right">
                    <div class="defi-label">Today's change</div>
                    <div class="value">2.38%</div>
                </div>
-->
            </div>
            <div class="exchange-price">
                <div class="defi-label">Price</div>
                <div class="value">{{ perPrice }}</div>
                <div class="swap-price">
                    <button class="btn light same-size round" @click="swapPrice">
                        <icon data="@/assets/svg/exchange-alt.svg" />
                    </button>
                </div>
            </div>
        </div>

        <div class="defi-buttons">
            <button class="btn large" :disabled="submitDisabled" @click="onSubmit">
                Trade now
            </button>
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
import { eventBusMixin } from '../../mixins/event-bus.js';
import FSlider from '../../components/core/FSlider/FSlider.vue';
import { formatNumberByLocale } from '../../filters.js';

export default {
    name: 'DefiFTrade',

    components: { FSlider, DefiTokenPickerWindow, FSelectButton, FCryptoSymbol, FBackButton },

    mixins: [eventBusMixin],

    data() {
        return {
            /** @type {DefiAccount} */
            defiAccount: {
                collateral: [],
                debt: [],
            },
            fromValue: 0,
            currFromValue: '0',
            perPrice: 0,
            /** Per price direction. true - from -> to, false - to -> from */
            perPriceDirF2T: true,
            /** @type {DefiToken} */
            fromToken: {},
            toValue: 0,
            /** @type {DefiToken} */
            toToken: {},
            /** @type {DefiToken[]} */
            tokens: [],
            sliderLabels: ['0%', '25%', '50%', '75%', '100%'],
            id: getUniqueId(),
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * @return {{fromToken: DefiToken, toToken: DefiToken}}
         */
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-ftrade');

            return parentNode ? parentNode.route : '';
        },

        fromInputValue() {
            const fromValue = this.formatInputValue(this.fromValue);

            return fromValue !== 0 ? '-' + fromValue.toFixed(6) : fromValue;
        },

        toInputValue() {
            const toValue = this.formatInputValue(this.toValue);

            return toValue !== 0 ? toValue.toFixed(6) : toValue;
        },

        fromTokens() {
            return this.getPickerTokens('from');
        },

        toTokens() {
            return this.getPickerTokens('to');
        },

        fromTokenBalance() {
            return this.$defi.fromTokenValue(this.fromToken.availableBalance, this.fromToken);
        },

        toTokenBalance() {
            return this.$defi.fromTokenValue(this.toToken.availableBalance, this.toToken);
        },

        toTokenPrice() {
            return formatNumberByLocale(this.$defi.getTokenPrice(this.toToken), 5, 'USD');
        },

        maxFromInputValue() {
            if (this.fromToken.symbol === 'FUSD') {
                // subtract 0.5% fee
                return this.fromTokenBalance - this.fromTokenBalance * 0.005;
            } else {
                return this.fromTokenBalance;
            }
        },

        maxToInputValue() {
            return this.$defi.convertTokenValue(this.maxFromInputValue, this.fromToken, this.toToken);
        },

        submitDisabled() {
            return this.correctFromInputValue(this.fromValue) === 0;
        },
    },

    watch: {
        currFromValue(_value, _oldValue) {
            if (_value !== _oldValue) {
                this.fromValue = parseFloat(_value);
                this.setPerPrice();
            }
        },

        fromValue(_value, _oldValue) {
            if (_value !== _oldValue) {
                this.toValue = this.convertFrom2To(_value);
                this.currFromValue = _value.toString();
                this.setPerPrice();
            }
        },
    },

    created() {
        this.init();

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        async init() {
            const { $defi } = this;
            const { params } = this;
            const result = await Promise.all([
                $defi.fetchDefiAccount(this.currentAccount.address),
                $defi.fetchTokens(this.currentAccount.address),
                $defi.init(),
            ]);

            this.defiAccount = result[0];
            this.tokens = result[1].filter($defi.canTokenBeTraded);

            if (params.fromToken && params.toToken) {
                this.fromToken = this.tokens.find((_item) => _item.symbol === params.fromToken.symbol);
                this.toToken = this.tokens.find((_item) => _item.symbol === params.toToken.symbol);
            } else if (this.tokens.length >= 2) {
                this.fromToken = this.tokens[0];
                this.toToken = this.tokens[1];
            }

            this.setPerPrice();
        },

        swapTokens() {
            const hToken = this.fromToken;
            const hValue = this.fromValue;

            this.fromToken = this.toToken;
            this.toToken = hToken;

            this.fromValue = this.toValue;
            this.toValue = hValue;

            // this.currFromValue = this.fromValue.toString();
            this.setPerPrice();
        },

        formatInputValue(_value) {
            // return parseFloat(_value).toFixed(2);
            return _value;
        },

        /**
         * @param {number} _value
         */
        correctFromInputValue(_value) {
            return Math.min(Math.max(_value, 0), this.maxFromInputValue);
        },

        /**
         * @param {number} _value
         */
        correctToInputValue(_value) {
            return Math.min(Math.max(_value, 0), this.maxToInputValue);
        },

        convertFrom2To(_value) {
            return this.$defi.convertTokenValue(_value, this.fromToken, this.toToken);
        },

        convertTo2From(_value) {
            return this.$defi.convertTokenValue(_value, this.toToken, this.fromToken);
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

        resetInputValues() {
            this.fromValue = 0;
            this.toValue = 0;
            this.currFromValue = '0';
        },

        setPerPrice() {
            const fromToken = this.perPriceDirF2T ? this.fromToken : this.toToken;
            const toToken = this.perPriceDirF2T ? this.toToken : this.fromToken;
            const perPrice = 1 / (this.perPriceDirF2T ? this.convertFrom2To(1) : this.convertTo2From(1));
            const { $defi } = this;

            this.perPrice = `${perPrice.toFixed(6)} ${$defi.getTokenSymbol(fromToken)} per ${$defi.getTokenSymbol(
                toToken
            )}`;
        },

        swapPrice() {
            this.perPriceDirF2T = !this.perPriceDirF2T;
            this.setPerPrice();
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
            if (_token.address === this.toToken.address) {
                this.swapTokens();
            } else {
                this.fromToken = _token;
                this.resetInputValues();
            }
        },

        /**
         * @param {DefiToken} _token Picked token.
         */
        onToTokenPicked(_token) {
            if (_token.address === this.fromToken.address) {
                this.swapTokens();
            } else {
                this.toToken = _token;
                this.resetInputValues();
            }
        },

        onFromInputChange(_event) {
            this.fromValue = this.correctFromInputValue(_event.target.value);
        },

        onToInputChange(_event) {
            this.toValue = this.correctToInputValue(_event.target.value);
            this.fromValue = this.convertTo2From(this.toValue);
        },

        /**
         * Prevent typing '+' or '-'.
         * @param {KeyboardEvent} _event
         */
        onInputKeydown(_event) {
            if (_event.key === '+' || _event.key === '-') {
                _event.preventDefault();
            }
        },

        onSubmit() {
            const params = {
                fromValue: this.fromValue,
                toValue: this.toValue,
                fromToken: { ...this.fromToken },
                toToken: { ...this.toToken },
                steps: 2,
                step: 1,
            };

            if (!this.submitDisabled) {
                this.$router.push({
                    name: 'defi-ftrade-confirmation',
                    params,
                });
            }
        },

        onAccountPicked() {
            this.init();
            this.resetInputValues();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
