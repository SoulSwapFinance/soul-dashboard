<template>
    <div class="defi-manage-borrow">
        <div class="grid">
            <div>
                <div class="df-data-item smaller">
                    <h3 class="label">Borrow Limit</h3>
                    <div class="value">
                        {{ borrowLimit }} <span class="currency">{{ tokenSymbol }}</span>
                    </div>
                </div>
                <!--
                <div v-else class="df-data-item smaller">
                    <h3 class="label">{{ tokenSymbol }} balance</h3>
                    <div class="value">{{ debt }} <span class="currency">{{ tokenSymbol }}</span></div>
                </div>
                -->

                <div class="df-data-item smaller">
                    <h3 class="label">Current price</h3>
                    <div class="value">{{ currentPrice }}</div>
                </div>

                <template v-if="!largeView">
                    <div class="df-data-item smaller">
                        <h3 class="label">Borrowed {{ tokenSymbol }}</h3>
                        <div class="value">{{ debt }}</div>
                    </div>
                    <div class="df-data-item smaller">
                        <h3 class="label">Collateral</h3>
                        <div class="value">{{ collateralInFUSD }} <span class="currency">fUSD</span></div>
                    </div>
                </template>
            </div>
            <div class="defi-price-input-col align-center">
                <div class="defi-price-input">
                    <div class="token-label">
                        <f-select-button
                            v-if="!singleToken"
                            collapsed
                            aria-label="pick a token"
                            @click.native="onTokenSelectorClick"
                        >
                            <f-crypto-symbol :token="dToken" img-width="24px" img-height="24px" />
                        </f-select-button>
                        <template v-else>
                            <f-crypto-symbol :token="dToken" />
                        </template>
                    </div>

                    <label :for="`text-input-${id}`" class="not-visible">{{ label }}</label>
                    <input
                        :id="`text-input-${id}`"
                        ref="input"
                        :value="inputValue"
                        :min="minDebt"
                        :max="maxDebt"
                        type="number"
                        step="any"
                        class="text-input no-style"
                        @change="onInput"
                    />

                    <div class="f-slider-wrap">
                        <f-slider
                            ref="slider"
                            v-model="currDebt"
                            step="any"
                            :min="minDebt.toString()"
                            :max="maxDebt.toString()"
                            use-lower-fill-bar
                        >
                            <template #top="sProps">
                                <label :for="sProps.inputId" class="not-visible">{{ label }}</label>
                            </template>
                        </f-slider>
                        <div class="reset-btn" @click="onResetBtnClick">
                            <button class="btn small light">Reset</button>
                        </div>
                    </div>

                    <div class="token-info">
                        <div class="token-info-label">Decrease {{ tokenSymbol }}</div>
                        <icon data="@/assets/svg/angle-double-left.svg" width="66" height="66" aria-hidden="true" />
                    </div>
                    <div class="token-info increase">
                        <div class="token-info-label">Increase {{ tokenSymbol }}</div>
                        <icon data="@/assets/svg/angle-double-right.svg" width="66" height="66" aria-hidden="true" />
                    </div>
                </div>
            </div>
            <div v-if="!smallView" class="minting-limit-col align-center">
                <h3>Debt Limit</h3>
                <f-circle-progress
                    show-percentage
                    :stroke-width="6"
                    :animate="false"
                    :colors="colors"
                    :value="mintingLimit"
                />
            </div>
            <div v-if="largeView" class="right-col">
                <div v-if="!smallView" class="df-data-item smaller">
                    <h3 class="label">Today’s change</h3>
                    <div class="value">2.38%</div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Collateral</h3>
                    <div class="value">{{ collateralInFUSD }} <span class="currency">fUSD</span></div>
                </div>
                <div v-if="smallView" class="df-data-item smaller">
                    <h3 class="label">Debt Limit</h3>
                    <div class="value">
                        <f-colored-number-range show-percentage :colors="colors" :value="mintingLimit" />
                    </div>
                </div>
            </div>

            <f-message v-if="increasedDebt > 0" type="info" role="alert" class="big">
                You’re adding <span class="inc-desc-collateral">{{ increasedDebt.toFixed(2) }} {{ tokenSymbol }}</span>
            </f-message>
            <f-message v-else-if="decreasedDebt > 0" type="info" role="alert" class="big">
                You’re removing
                <span class="inc-desc-collateral">{{ decreasedDebt.toFixed(2) }} {{ tokenSymbol }}</span>
            </f-message>
        </div>

        <div class="buttons">
            <button class="btn large" :disabled="submitDisabled" @click="onSubmit">
                <template v-if="submitDisabled">Submit</template>
                <template v-else-if="increasedDebt > 0 || debt === 0">Mint {{ increasedDebt.toFixed(2) }} now</template>
                <template v-else>Repay {{ decreasedDebt.toFixed(2) }} now</template>
            </button>
        </div>

        <defi-token-picker-window ref="pickTokenWindow" :tokens="tokens" @defi-token-picked="onDefiTokenPicked" />

        <div
            v-if="tmpShow"
            style="margin-top: 48px; padding: 16px; opacity: 0.75; background-color: #eee;"
            @click="onTestBtnClick"
        >
            <h3>Test values</h3>
            <h4>Common values</h4>
            <p>
                Liquidation collateral ratio: {{ $defi.liqCollateralRatio }} <br />
                Minimal collateral ratio: {{ $defi.minCollateralRatio }} <br />
                Token price: {{ tokenPrice }}
            </p>
            <h4>Set values</h4>
            <div v-for="(item, index) in tmpTestData" :key="`td${id}${index}`">
                <button :data-idx="index" class="btn small light break-word">
                    Locked balance: {{ item.collateral }}, Borrowed {{ tokenSymbol }}: {{ item.debt }}
                    <template v-if="item.tokenPrice"> , Token price: {{ item.tokenPrice }} </template>
                </button>
                <br />
            </div>
        </div>
    </div>
</template>

<script>
import FColoredNumberRange from '../../components/core/FColoredNumberRange/FColoredNumberRange.vue';
import FSlider from '../../components/core/FSlider/FSlider.vue';
import FCircleProgress from '../../components/core/FCircleProgress/FCircleProgress.vue';
import { getUniqueId } from '../../utils';
import { mapGetters } from 'vuex';
import { formatNumberByLocale } from '../../filters.js';
import { getAppParentNode } from '../../app-structure.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import DefiTokenPickerWindow from '../windows/DefiTokenPickerWindow/DefiTokenPickerWindow.vue';
import FCryptoSymbol from '../core/FCryptoSymbol/FCryptoSymbol.vue';
import FSelectButton from '../core/FSelectButton/FSelectButton.vue';

/**
 * Common component for defi mint and repay.
 */
export default {
    name: 'DefiManageBorrow',

    components: {
        FSelectButton,
        FCryptoSymbol,
        DefiTokenPickerWindow,
        FMessage,
        FColoredNumberRange,
        FSlider,
        FCircleProgress,
    },

    props: {
        /** @type {DefiToken} */
        token: {
            type: Object,
            default() {
                return null;
            },
        },
        /** Mode with sindgle token - no token picker,... */
        singleToken: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            dToken: {},
            tokens: [],
            currDebt: '0',
            tokenPrice: 0,
            increasedDebt: 0,
            decreasedDebt: 0,
            label: 'tmp',
            id: getUniqueId(),
            tmpShow: false,
            tmpValues: {
                collateral: 0,
                debt: 0,
            },
            tmpTokenPrice: 0,
            tmpTestData: [
                { collateral: 0, debt: 0 },
                { collateral: 5000, debt: 0 },
                { collateral: 10000, debt: 20 },
                { collateral: 5000, debt: 20 },
                { collateral: 5000, debt: 20, tokenPrice: 0.008 },
            ],
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        debt() {
            return this.tmpValues.debt;
        },

        collateral() {
            // return this.tmpValues.collateral;
            return 0;
        },

        collateralInFUSD() {
            return (this.collateral * this.tokenPrice).toFixed(2);
        },

        currentPrice() {
            // return formatNumberByLocale(this.tokenPrice, 5, 'USD');
            return formatNumberByLocale(this.$defi.getTokenPrice(this.dToken), 2, 'USD');
        },

        borrowLimit() {
            return this.$defi.getMaxDebt(this.collateral, this.tokenPrice).toFixed(2);
        },

        mintingLimit() {
            return this.$defi.getMintingLimit(this.currDebt, this.collateral, this.tokenPrice);
        },

        minDebt() {
            return 0;
        },

        maxDebt() {
            return Math.max(this.borrowLimit, this.debt);
        },

        inputValue() {
            return this.formatInputValue(this.currDebt);
        },

        submitDisabled() {
            return parseFloat(this.currDebt) === parseFloat(this.debt);
        },

        colors() {
            return this.$defi.getColors();
        },

        tokenSymbol() {
            return this.$defi.getTokenSymbol(this.dToken);
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-manage-borrow');

            return parentNode ? parentNode.route : '';
        },

        /**
         * Property is set to `true`, if 'small' breakpoint is reached.
         *
         * @return {Boolean}
         */
        smallView() {
            const breakpoint = this.$store.state.breakpoints['small'];

            return breakpoint && breakpoint.matches;
        },

        /**
         * Property is set to `true`, if 'medium' breakpoint is reached.
         *
         * @return {Boolean}
         */
        mediumView() {
            const breakpoint = this.$store.state.breakpoints['medium'];

            return breakpoint && breakpoint.matches;
        },

        /**
         * Property is set to `true`, if 'large' breakpoint is reached.
         *
         * @return {Boolean}
         */
        largeView() {
            const breakpoint = this.$store.state.breakpoints['large'];

            return breakpoint && breakpoint.matches;
        },
    },

    watch: {
        currDebt(_value, _oldValue) {
            let cValue;

            if (_value !== _oldValue) {
                cValue = this.$refs.slider.getCorrectValue(_value);

                if (cValue !== _value && cValue === this.maxDebt.toString()) {
                    this.currDebt = cValue;
                }

                this.updateMessage();
            }
        },

        async dToken(_value) {
            if (_value) {
                this.tokenPrice = this.$defi.getTokenPrice(_value);

                this.tmpTokenPrice = this.tokenPrice;
            }
        },
    },

    async created() {
        if (this.token) {
            this.dToken = this.token;
        }

        this.currDebt = this.debt.toString();
        this.updateMessage();

        this.init();
    },

    methods: {
        async init() {
            const { $defi } = this;
            const result = await Promise.all([
                $defi.fetchDefiAccount(this.currentAccount.address),
                $defi.fetchTokens(this.currentAccount.address),
                $defi.init(),
            ]);
            const tokens = result[1];

            if (!this.singleToken) {
                // get tokens that are possible to borrow
                this.tokens = tokens.filter($defi.canTokenBeBorrowed);
            }

            if (this.token === null) {
                // get first token that can be borrowed
                this.dToken = tokens.find($defi.canTokenBeBorrowed);
            }
        },

        formatInputValue(_value) {
            return parseFloat(_value).toFixed(2);
        },

        updateMessage() {
            const debtDiff = parseFloat(this.currDebt) - this.debt;

            this.increasedDebt = 0;
            this.decreasedDebt = 0;

            if (debtDiff > 0) {
                this.increasedDebt = debtDiff;
            } else if (debtDiff < 0) {
                this.decreasedDebt = -debtDiff;
            }
        },

        updateCurrDebt() {
            this.currDebt = this.debt.toString();
        },

        onSubmit() {
            if (!this.submitDisabled) {
                this.$emit('defi-manage-borrow-submit', {
                    currDebt: parseFloat(this.currDebt),
                    debt: this.debt,
                });
            }
        },

        onInput(_event) {
            this.currDebt = this.$refs.slider.getCorrectValue(_event.target.value);
            _event.target.value = this.formatInputValue(this.currDebt);
        },

        onTokenSelectorClick() {
            this.$refs.pickTokenWindow.show();
        },

        onDefiTokenPicked(_token) {
            this.dToken = _token;
            console.log('picked token', _token);
        },

        onResetBtnClick() {
            this.updateCurrDebt();
        },

        _setTmpValues(_values) {
            this.tmpValues = {
                collateral: _values.collateral,
                debt: _values.debt,
            };

            if (_values.tokenPrice) {
                this.tokenPrice = _values.tokenPrice;
            } else {
                this.tokenPrice = this.tmpTokenPrice;
            }

            this.updateCurrDebt();
            this.updateMessage();
        },

        onTestBtnClick(_event) {
            const eBtn = _event.target.closest('button');
            let idx = -1;

            if (eBtn) {
                idx = parseInt(eBtn.getAttribute('data-idx'));
                if (!isNaN(idx)) {
                    this._setTmpValues(this.tmpTestData[idx]);
                }
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
