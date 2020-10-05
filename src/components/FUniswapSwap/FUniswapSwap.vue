<template>
    <div class="funiswap-swap">
        <f-card>
            <div class="funiswap-swap__token">
                <div class="funiswap-swap__token__balance">
                    <span>From</span>
                    <span class="balance">
                        Balance:
                        <f-token-value
                            :token="fromToken"
                            :value="fromTokenBalance"
                            :use-placeholder="false"
                            no-currency
                        />
                    </span>
                </div>
                <div class="funiswap-swap__token__body">
                    <div class="funiswap-swap__token__sign">-</div>
                    <input
                        :id="`text-input-${id}`"
                        ref="fromInput"
                        :value="fromInputValue === 0 ? '' : fromInputValue"
                        type="number"
                        placeholder="0"
                        step="any"
                        min="0"
                        :max="maxFromInputValue"
                        class="text-input no-style"
                        @change="onFromInputChange"
                        @input="onFromInputInput"
                        @keydown="onInputKeydown"
                    />
                    <button class="btn small secondary max-amount" @click="onMaxAmountClick">Max</button>
                    <f-select-button
                        collapsed
                        aria-label="pick a token"
                        class="bigger-arrow"
                        @click.native="onFromTokenSelectorClick"
                    >
                        <f-crypto-symbol :token="fromToken" img-width="24px" img-height="24px" />
                    </f-select-button>
                </div>
            </div>

            <div class="funiswap-swap__swap-cont">
                <button class="btn round same-size light" title="Swap Tokens" @click="swapTokens">
                    <icon data="@/assets/svg/arrow-left.svg" width="12" height="12" dir="left" aria-hidden="true" />
                </button>
            </div>

            <div class="funiswap-swap__token">
                <div class="funiswap-swap__token__balance">
                    <span>To</span>
                    <span class="balance">
                        Balance:
                        <f-token-value :token="toToken" :value="toTokenBalance" :use-placeholder="false" no-currency />
                    </span>
                </div>
                <div class="funiswap-swap__token__body">
                    <div class="funiswap-swap__token__sign">+</div>
                    <input
                        :id="`text-input-${id}`"
                        ref="toInput"
                        :value="toInputValue === 0 ? '' : toInputValue"
                        type="number"
                        placeholder="0"
                        step="any"
                        min="0"
                        :max="maxFromInputValue"
                        class="text-input no-style"
                        @change="onToInputChange"
                        @input="onToInputInput"
                        @keydown="onInputKeydown"
                    />
                    <f-select-button
                        v-if="toToken.address"
                        collapsed
                        aria-label="pick a token"
                        class="bigger-arrow"
                        @click.native="onToTokenSelectorClick"
                    >
                        <f-crypto-symbol :token="toToken" img-width="24px" img-height="24px" />
                    </f-select-button>
                    <button
                        v-else
                        class="btn small secondary funiswap-swap__select-token-btn"
                        type="button"
                        @click="onToTokenSelectorClick"
                    >
                        Select a token <icon data="@/assets/svg/chevron-down.svg" width="12" height="12" />
                    </button>
                </div>
            </div>

            <div v-show="toToken.address" class="funiswap-swap__exchange-price">
                <div class="defi-label">Price</div>
                <div class="value">
                    <f-placeholder :content-loaded="!!perPrice" replacement-text="000.00 fUSD per fETH">
                        {{ perPrice }}
                    </f-placeholder>
                </div>
                <div class="swap-price">
                    <button class="btn light same-size round" @click="swapPrice">
                        <icon data="@/assets/svg/exchange-alt.svg" />
                    </button>
                </div>
            </div>

            <div class="funiswap-swap__submit-cont">
                <button ref="submitBut" class="btn large" @click="onSubmit">
                    Enter an amount
                </button>
            </div>
        </f-card>

        <defi-token-picker-window
            ref="pickFromTokenWindow"
            :tokens="fromTokens"
            @defi-token-picked="onFromTokenPicked"
        />
        <defi-token-picker-window ref="pickToTokenWindow" :tokens="toTokens" @defi-token-picked="onToTokenPicked" />
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import FCryptoSymbol from '../../components/core/FCryptoSymbol/FCryptoSymbol.vue';
import FSelectButton from '../../components/core/FSelectButton/FSelectButton.vue';
import DefiTokenPickerWindow from '../../components/windows/DefiTokenPickerWindow/DefiTokenPickerWindow.vue';
import { getUniqueId } from '../../utils';
import { eventBusMixin } from '../../mixins/event-bus.js';
import { formatNumberByLocale } from '../../filters.js';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import FCard from '@/components/core/FCard/FCard.vue';

export default {
    name: 'FUniswapSwap',

    components: {
        FCard,
        FPlaceholder,
        FTokenValue,
        DefiTokenPickerWindow,
        FSelectButton,
        FCryptoSymbol,
    },

    mixins: [eventBusMixin],

    data() {
        return {
            /** @type {FMintAccount} */
            fMintAccount: {
                collateral: [],
                debt: [],
            },
            fromValue: 0,
            currFromValue: '0',
            perPrice: 0,
            /** Per price direction. true - from -> to, false - to -> from */
            perPriceDirF2T: true,
            sbmtDisabled: true,
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
        ...mapGetters(['currentAccount', 'defiSlippageReserve']),

        ...mapState(['breakpoints']),

        /**
         * @return {{fromToken: DefiToken, toToken: DefiToken}}
         */
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },

        fromInputValue() {
            return this.formatFromInputValue(this.fromValue);
        },

        toInputValue() {
            return this.formatToInputValue(this.toValue);
        },

        fromTokens() {
            return this.getPickerTokens('from');
        },

        toTokens() {
            return this.getPickerTokens('to');
        },

        fromTokenBalance() {
            const { fromToken } = this;
            let balance =
                this.$defi.fromTokenValue(fromToken.availableBalance, fromToken) - (fromToken.symbol === 'FTM' ? 2 : 0);

            if (balance < 0) {
                balance = 0;
            }

            return balance;
        },

        toTokenBalance() {
            return this.$defi.fromTokenValue(this.toToken.availableBalance, this.toToken);
        },

        toTokenPrice() {
            return formatNumberByLocale(this.$defi.getTokenPrice(this.toToken), 5, 'USD');
        },

        maxFromInputValue() {
            let max = 0;

            if (this.fromToken.symbol === 'FUSD') {
                // subtract 0.5% fee
                max = this.fromTokenBalance - this.fromTokenBalance * 0.005;
            } else {
                max = this.fromTokenBalance;
            }

            return max - max * this.defiSlippageReserve;
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
                this.updateSubmitLabel();
            }
        },

        fromValue(_value, _oldValue) {
            if (_value !== _oldValue) {
                this.toValue = this.convertFrom2To(_value);
                this.currFromValue = _value.toString();
                this.setPerPrice();
            }
        },

        breakpoints() {
            const { $refs } = this;

            $refs.fromARInput.update();
            $refs.toARInput.update();
        },
    },

    created() {
        this.init();

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    mounted() {
        this.$refs.submitBut.disabled = true;
    },

    methods: {
        async init() {
            const { $defi } = this;
            const { params } = this;
            const result = await Promise.all([
                $defi.fetchFMintAccount(this.currentAccount.address),
                $defi.fetchTokens(this.currentAccount.address),
                $defi.init(),
            ]);

            this.fMintAccount = result[0];

            this.tokens = result[1];

            // if (params.fromToken && params.toToken) {
            if (params.fromToken) {
                this.fromToken = this.tokens.find((_item) => _item.symbol === params.fromToken.symbol);
                // this.toToken = this.tokens.find((_item) => _item.symbol === params.toToken.symbol);
            } else if (this.tokens.length >= 2) {
                this.fromToken = this.tokens[0];
                // this.toToken = this.tokens[1];
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

            this.fromValue = this.correctFromInputValue(this.fromValue);
            // this.currFromValue = this.fromValue.toString();
            this.setPerPrice();
        },

        /**
         * @param {number} _value
         */
        formatToInputValue(_value) {
            return _value !== 0 ? _value.toFixed(this.$defi.getTokenDecimals(this.toToken)) : _value;
        },

        /**
         * @param {number} _value
         */
        formatFromInputValue(_value) {
            return _value !== 0 ? _value.toFixed(this.$defi.getTokenDecimals(this.fromToken)) : _value;
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
            // const fromTokenAddress = this.fromToken.address;
            let token = _type === 'from' ? this.fromToken : this.toToken;
            let fromTokenAddress = token.address;

            // if no 'to' token is selected
            if (_type === 'to' && !this.toToken.address) {
                fromTokenAddress = this.fromToken.address;
            }

            return this.tokens.map((_item) => {
                return { ..._item, _disabled: _item.address === fromTokenAddress };
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

            this.perPrice = `${perPrice.toFixed(this.$defi.getTokenDecimals(fromToken))} ${$defi.getTokenSymbol(
                fromToken
            )} per ${$defi.getTokenSymbol(toToken)}`;
        },

        swapPrice() {
            this.perPriceDirF2T = !this.perPriceDirF2T;
            this.setPerPrice();
        },

        updateInputColor(_value, _toInput = false) {
            const cValue = _toInput ? this.correctToInputValue(_value) : this.correctFromInputValue(_value);
            const eInput = _toInput ? this.$refs.toInput : this.$refs.fromInput;

            if (_value > cValue) {
                eInput.classList.add('invalid');
            } else {
                eInput.classList.remove('invalid');
            }
        },

        updateSubmitLabel() {
            this.$nextTick(() => {
                const fromInputValue = this.$refs.fromInput.value;
                const toInputValue = this.$refs.toInput.value;
                let submitLabel = '';
                let sbmtDisabled = true;

                if (fromInputValue && fromInputValue !== '0' && toInputValue && toInputValue !== '0') {
                    if (
                        parseInt(fromInputValue) > this.maxFromInputValue ||
                        parseInt(toInputValue) > this.maxToInputValue
                    ) {
                        submitLabel = 'Insufficient balance';
                    } else {
                        submitLabel = 'Swap';
                        sbmtDisabled = false;
                    }
                } else if (fromInputValue && fromInputValue !== '0') {
                    submitLabel = 'Select a token';
                } else {
                    submitLabel = 'Enter an amount';
                }

                this.$refs.submitBut.innerText = submitLabel;
                this.$refs.submitBut.disabled = sbmtDisabled;
            });
        },

        onMaxAmountClick() {
            this.fromValue = this.maxFromInputValue;
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

                // this.resetInputValues();
                this.toValue = this.convertFrom2To(this.$refs.fromInput.value);
                this.updateSubmitLabel();
                this.setPerPrice();
            }
        },

        /**
         * @param {InputEvent} _event
         */
        onFromInputChange(_event) {
            const cValue = this.correctFromInputValue(_event.target.value);

            if (this.fromValue === cValue) {
                this.$nextTick(() => {
                    this.$refs.fromInput.value = this.formatFromInputValue(cValue);
                });
            }

            this.fromValue = cValue;

            this.updateInputColor(this.fromValue);
        },

        /**
         * @param {InputEvent} _event
         */
        onFromInputInput(_event) {
            this.$refs.toInput.value = this.formatToInputValue(
                this.correctToInputValue(this.convertFrom2To(_event.target.value))
            );

            this.updateInputColor(parseFloat(_event.target.value));
            this.updateSubmitLabel();
        },

        /**
         * @param {InputEvent} _event
         */
        onToInputChange(_event) {
            const cValue = this.correctToInputValue(_event.target.value);

            if (this.toValue === cValue) {
                this.$nextTick(() => {
                    this.$refs.toInput.value = this.formatToInputValue(cValue);
                });
            }

            this.toValue = cValue;
            this.fromValue = this.convertTo2From(this.toValue);

            this.updateInputColor(this.toValue, true);
        },

        /**
         * @param {InputEvent} _event
         */
        onToInputInput(_event) {
            this.$refs.fromInput.value = this.formatFromInputValue(
                this.correctFromInputValue(this.convertTo2From(_event.target.value))
            );

            this.updateInputColor(parseFloat(_event.target.value), true);
            this.updateSubmitLabel();
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
            const { fromToken } = this;
            const { toToken } = this;
            // const ftmTokens = ['FTM', 'WFTM'];
            const params = {
                fromValue: this.fromValue,
                toValue: this.toValue,
                fromToken: { ...fromToken },
                toToken: { ...toToken },
                steps: 2,
                step: 1,
                max: this.maxFromInputValue === this.fromValue,
            };

            if (!this.submitDisabled) {
                this.$router.push({
                    name: 'fswap-confirmation',
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
