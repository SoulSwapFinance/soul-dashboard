<template>
    <div class="funiswap-liquidity funiswap">
        <f-card>
            <div class="funiswap__box">
                <div class="funiswap__token__balance">
                    <span>Input</span>
                    <span class="balance">
                        Balance:
                        <f-token-value
                            :token="fromToken"
                            :value="fromTokenBalance"
                            :use-placeholder="false"
                            :add-decimals="addDeciamals"
                            no-currency
                        />
                    </span>
                </div>
                <div class="funiswap__token__body">
                    <input
                        :id="`text-input-${id}`"
                        ref="fromInput"
                        v-model="fromValue"
                        type="number"
                        placeholder="0"
                        step="any"
                        min="0"
                        :max="maxFromInputValue"
                        class="text-input no-style"
                        @change="onFromInputChange"
                        @keydown="onInputKeydown"
                    />
                    <button class="btn small secondary max-amount" @click="onFromMaxAmountClick">Max</button>
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

            <div class="funiswap__swap-cont">
                <icon data="@/assets/svg/plus.svg" width="12" height="12" dir="left" aria-hidden="true" />
            </div>

            <div class="funiswap__box">
                <div class="funiswap__token__balance">
                    <span>Input</span>
                    <span class="balance">
                        Balance:
                        <f-token-value
                            :token="toToken"
                            :value="toTokenBalance"
                            :use-placeholder="false"
                            :add-decimals="addDeciamals"
                            no-currency
                        />
                    </span>
                </div>
                <div class="funiswap__token__body">
                    <input
                        :id="`text-input-${id}`"
                        ref="toInput"
                        v-model="toValue"
                        type="number"
                        placeholder="0"
                        step="any"
                        min="0"
                        :max="maxFromInputValue"
                        class="text-input no-style"
                        @change="onToInputChange"
                        @keydown="onInputKeydown"
                    />
                    <template v-if="toToken.address">
                        <button class="btn small secondary max-amount" @click="onToMaxAmountClick">Max</button>
                        <f-select-button
                            collapsed
                            aria-label="pick a token"
                            class="bigger-arrow"
                            @click.native="onToTokenSelectorClick"
                        >
                            <f-crypto-symbol :token="toToken" img-width="24px" img-height="24px" />
                        </f-select-button>
                    </template>
                    <button
                        v-else
                        class="btn small secondary funiswap__select-token-btn"
                        type="button"
                        @click="onToTokenSelectorClick"
                    >
                        Select a token <icon data="@/assets/svg/chevron-down.svg" width="12" height="12" />
                    </button>
                </div>
            </div>

            <div v-show="toToken.address" class="funiswap__box funiswap-liquidity__prices">
                Prices and pool share
                <div class="row no-collapse">
                    <div class="col">
                        <div>{{ toPerFromPrice }}</div>
                        <div class="defi-label">
                            {{ $defi.getTokenSymbol(toToken) }} per {{ $defi.getTokenSymbol(fromToken) }}
                        </div>
                    </div>
                    <div class="col">
                        <div>{{ fromPerToPrice }}</div>
                        <div class="defi-label">
                            {{ $defi.getTokenSymbol(fromToken) }} per {{ $defi.getTokenSymbol(toToken) }}
                        </div>
                    </div>
                    <div class="col">
                        <div>{{ shareOfPool }}</div>
                        <div class="defi-label">
                            Share of Pool
                        </div>
                    </div>
                </div>
            </div>

            <div class="funiswap__submit-cont">
                <button ref="submitBut" class="btn large" :disabled="submitBtnDisabled" @click="onSubmit">
                    {{ submitLabel }}
                </button>
            </div>
        </f-card>

        <div class="funiswap__bottom-box">
            By adding liquidity you'll earn 0.3% of all trades on this pair proportional to your share of the pool. Fees
            are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
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
import FCard from '@/components/core/FCard/FCard.vue';
import { defer, getUniqueId } from '@/utils';
import { mapGetters } from 'vuex';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import FSelectButton from '@/components/core/FSelectButton/FSelectButton.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
import { eventBusMixin } from '@/mixins/event-bus.js';
import DefiTokenPickerWindow from '@/components/windows/DefiTokenPickerWindow/DefiTokenPickerWindow.vue';

export default {
    name: 'FUniswapLiquidity',

    components: { DefiTokenPickerWindow, FCryptoSymbol, FSelectButton, FTokenValue, FCard },

    mixins: [eventBusMixin],

    props: {
        slippageTolerance: {
            type: Number,
            default: 0.005,
        },
    },

    data() {
        return {
            /** @type {FMintAccount} */
            fMintAccount: {
                collateral: [],
                debt: [],
            },
            fromValue: '',
            toValue: '',
            toPerFromPrice: 0,
            fromPerToPrice: 0,
            /** Per price direction. true - from -> to, false - to -> from */
            perPriceDirF2T: true,
            submitBtnDisabled: true,
            showPriceInfo: false,
            /** @type {DefiToken} */
            fromToken: {},
            /** @type {DefiToken} */
            toToken: {},
            /** @type {DefiToken[]} */
            tokens: [],
            sliderLabels: ['0%', '25%', '50%', '75%', '100%'],
            id: getUniqueId(),
            liquidityProviderFee: 0.003,
            submitLabel: 'Enter an amount',
            pair: {},
            addDeciamals: 2,
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

        fromTokens() {
            return this.getPickerTokens('from');
        },

        toTokens() {
            return this.getPickerTokens('to');
        },

        maxFromInputValue() {
            return this.fromTokenBalance;
        },

        maxToInputValue() {
            return this.$defi.convertTokenValue(this.maxFromInputValue, this.fromToken, this.toToken);
        },

        submitDisabled() {
            return this.correctFromInputValue(this.fromValue) === 0;
        },

        shareOfPool() {
            const { pair } = this;

            if (pair.pairAddress) {
                const share = parseInt(pair.shareOf, 16) / parseInt(pair.totalSupply, 16);

                return `${(share * 100).toFixed(3)} %`;
            }

            return '-';
        },
    },

    watch: {
        fromValue(_value, _oldValue) {
            if (_value !== _oldValue) {
                this.updateInputColor(parseFloat(_value));
                this.updateSubmitLabel();

                this.setPrices();

                this._fromValueChanged = true;

                this.toValue = this.convertFrom2To(_value);

                defer(() => {
                    this.$refs.toInput.value = this.formatToInputValue(this.toValue);
                    this._fromValueChanged = false;
                });
            }
        },

        toValue(_value, _oldValue) {
            if (_value !== _oldValue) {
                this.updateInputColor(parseFloat(_value), true);
                this.updateSubmitLabel();

                if (!this._fromValueChanged) {
                    // correct 'from' input value
                    this.setFromInputValue(this.correctFromInputValue(this.convertTo2From(_value)));
                }

                this._fromValueChanged = false;
            }
        },

        async fromToken(_value, _oldValue) {
            if (_value !== _oldValue) {
                if (_value.address && this.toToken.address) {
                    this.pair = await this.getUniswapPair();
                }
            }
        },

        async toToken(_value, _oldValue) {
            if (_value !== _oldValue) {
                if (_value.address && this.fromToken.address) {
                    this.pair = await this.getUniswapPair();
                }
            }
        },
    },

    created() {
        this.init();

        this._fromValueChanged = false;

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        async getUniswapPair() {
            const addressA = this.fromToken.address;
            const addressB = this.toToken.address;

            if (addressA && addressB) {
                return await this.$defi.fetchUniswapPairs(this.currentAccount.address, '', [addressA, addressB]);
            }

            return {};
        },

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

            this.setPrices();
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
            this.fromValue = '';
            this.toValue = '';
        },

        swapTokens() {
            const hToken = this.fromToken;
            const hValue = this.fromValue;

            this.fromToken = this.toToken;
            this.toToken = hToken;

            this.fromValue = this.toValue || '';
            this.toValue = hValue || '';

            this.fromValue = this.correctFromInputValue(this.fromValue) || '';

            this.setPrices();
        },

        /**
         * @param {number} _value
         */
        formatToInputValue(_value) {
            const value = parseFloat(_value);

            return value !== 0 ? value.toFixed(this.$defi.getTokenDecimals(this.toToken) + this.addDeciamals) : '';
        },

        /**
         * @param {number} _value
         */
        formatFromInputValue(_value) {
            const value = parseFloat(_value);

            return value !== 0 ? value.toFixed(this.$defi.getTokenDecimals(this.fromToken) + this.addDeciamals) : '';
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
            return Math.min(Math.max(_value, 0), Math.min(this.maxToInputValue, this.toTokenBalance));
        },

        convertFrom2To(_value) {
            return this.$defi.convertTokenValue(_value, this.fromToken, this.toToken);
        },

        convertTo2From(_value) {
            return this.$defi.convertTokenValue(_value, this.toToken, this.fromToken);
        },

        setFromInputValue(_value) {
            defer(() => {
                this.$refs.fromInput.value = this.formatFromInputValue(_value);
            });
        },

        setToInputValue(_value) {
            defer(() => {
                this.$refs.toInput.value = this.formatToInputValue(_value);
            });
        },

        setPrices() {
            this.toPerFromPrice = this.convertFrom2To(1).toFixed(4);
            this.fromPerToPrice = this.convertTo2From(1).toFixed(4);
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

                this.submitBtnDisabled = true;

                if (fromInputValue && fromInputValue !== '0' && toInputValue && toInputValue !== '0') {
                    if (parseInt(fromInputValue) > Math.min(this.maxFromInputValue, this.fromTokenBalance)) {
                        this.submitLabel = `Insufficient ${this.$defi.getTokenSymbol(this.fromToken)} balance`;
                    } else if (parseInt(toInputValue) > Math.min(this.maxToInputValue, this.toTokenBalance)) {
                        this.submitLabel = `Insufficient ${this.$defi.getTokenSymbol(this.toToken)} balance`;
                    } else {
                        this.submitLabel = 'Supply';
                        this.submitBtnDisabled = false;
                    }
                } else if (fromInputValue && fromInputValue !== '0') {
                    this.submitLabel = 'Select a token';
                } else {
                    this.submitLabel = 'Enter an amount';
                }
            });
        },

        onFromMaxAmountClick() {
            const fromValue = Math.min(this.maxFromInputValue, this.fromTokenBalance);
            const toValue = this.convertFrom2To(fromValue);

            if (toValue > this.toTokenBalance) {
                this.toValue = this.toTokenBalance;
            } else {
                this.fromValue = fromValue;
            }

            this.setFromInputValue(this.fromValue);
        },

        onToMaxAmountClick() {
            const toValue = Math.min(this.maxToInputValue, this.toTokenBalance);
            const fromValue = this.convertTo2From(toValue);

            if (fromValue > this.fromTokenBalance) {
                this.fromValue = this.fromTokenBalance;
            } else {
                this.toValue = toValue;
            }

            this.setToInputValue(this.toValue);
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
                const value = this.$refs.fromInput.value;

                if (value !== '') {
                    this.toValue = this.convertFrom2To(this.$refs.fromInput.value);
                }

                this.updateSubmitLabel();
                this.setPrices();
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
        onToInputChange(_event) {
            const cValue = this.correctToInputValue(_event.target.value);

            if (this.toValue === cValue) {
                this.$nextTick(() => {
                    this.$refs.toInput.value = this.formatToInputValue(cValue);
                });
            }

            this.toValue = cValue;
            // this.fromValue = this.convertTo2From(this.toValue);

            this.updateInputColor(this.toValue, true);
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
                slippageTolerance: this.slippageTolerance,
                steps: 3,
                step: 1,
                max: this.maxFromInputValue === this.fromValue,
            };

            if (!this.submitDisabled) {
                this.$router.push({
                    name: 'funiswap-liquidity-confirmation',
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
