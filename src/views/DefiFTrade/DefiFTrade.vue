<template>
    <div class="view-defi-ftrade">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> Trade</h1>

        <div class="grid">
            <div class="from-col">
                <div class="defi-label">From</div>
                <f-select-button @click.native="onFromTokenSelectorClick">
                    <div class="sb-content">
                        <f-crypto-symbol :token="fromToken" />
                        <span>{{ fromTokenBalance }}</span>
                    </div>
                </f-select-button>
                <div class="defi-price-input">
                    <input
                        :id="`text-input-${id}`"
                        ref="input"
                        :value="fromInputValue !== 0 ? fromInputValue.toFixed(6) : fromInputValue"
                        type="number"
                        step="any"
                        min="0"
                        :max="maxFromInputValue"
                        class="text-input no-style"
                        @change="onFromInputChange"
                    />
                </div>
            </div>
            <div class="swap-cont">
                <div>
                    <div class="defi-label">Current rate</div>
                    <div class="value">{{ toTokenPrice }}</div>
                </div>
                <div class="swap-col">
                    <button class="btn large round same-size light" title="Swap Tokens" @click="swapTokens">
                        <icon
                            data="@/assets/svg/exchange-alt.svg"
                            width="24"
                            height="24"
                            dir="right"
                            aria-hidden="true"
                        />
                    </button>
                </div>
                <div class="align-right">
                    <div class="defi-label">Today's change</div>
                    <div class="value">2.38%</div>
                </div>
            </div>
            <div class="to-col">
                <div class="defi-label">To</div>
                <f-select-button @click.native="onToTokenSelectorClick">
                    <div class="sb-content">
                        <f-crypto-symbol :token="toToken" />
                        <span>{{ toTokenBalance }}</span>
                    </div>
                </f-select-button>
                <div class="defi-price-input">
                    <input
                        :id="`text-input-${id}`"
                        ref="input"
                        :value="toInputValue !== 0 ? toInputValue.toFixed(6) : toInputValue"
                        type="number"
                        step="any"
                        min="0"
                        :max="maxToInputValue"
                        class="text-input no-style"
                        @change="onToInputChange"
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

        fromTokenBalance() {
            return this.$defi.fromTokenValue(this.fromToken.availableBalance, this.fromToken).toFixed(5);
        },

        toTokenBalance() {
            return this.$defi.fromTokenValue(this.toToken.availableBalance, this.toToken).toFixed(5);
        },

        toTokenPrice() {
            return formatNumberByLocale(this.$defi.getTokenPrice(this.toToken), 5, 'USD');
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
    },

    watch: {
        currFromValue(_value, _oldValue) {
            if (_value !== _oldValue) {
                this.fromValue = parseFloat(_value);
            }
        },

        fromValue(_value, _oldValue) {
            if (_value !== _oldValue) {
                this.toValue = this.convertFrom2To(_value);
                this.currFromValue = _value.toString();
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
            const result = await Promise.all([
                $defi.fetchDefiAccount(this.currentAccount.address),
                $defi.fetchTokens(this.currentAccount.address),
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
            const hValue = this.fromValue;

            this.fromToken = this.toToken;
            this.toToken = hToken;

            this.fromValue = this.toValue;
            this.toValue = hValue;

            // this.currFromValue = this.fromValue.toString();
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

        onSubmit() {
            alert('not implemented yet');
            /*
            const params = {
                currDebt: parseFloat(this.currDebt),
                debt: this.debt,
                tokenSymbol: this.dToken.symbol,
            };

            if (this.decreasedDebt > 0) {
                params.steps = 2;
                params.step = 1;
            }

            if (!this.submitDisabled) {
                this.$router.push({
                    name: 'defi-manage-borrow-confirmation',
                    params,
                });
            }
*/
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
