<template>
    <div class="defi-mint-repay">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Manage fUSD
        </h1>

        <h2 class="perex">
            Mint fUSD with your locked FTM or repay fUSD to unlock your FTM. You can use fUSD to trade synths, lend it
            to the liquidity pool to earn interest, and use it as a collateral to borrow synths.
        </h2>

        <div class="grid">
            <div>
                <div class="df-data-item smaller">
                    <h3 class="label">Max mintable</h3>
                    <div class="value">{{ maxMintable }} <span class="currency">fUSD</span></div>
                </div>
                <!--
                <div v-else class="df-data-item smaller">
                    <h3 class="label">fUSD balance</h3>
                    <div class="value">{{ debt }} <span class="currency">fUSD</span></div>
                </div>
                -->

                <div class="df-data-item smaller">
                    <h3 class="label">Current price</h3>
                    <div class="value">{{ currentPrice }}</div>
                </div>

                <template v-if="!largeView">
                    <div class="df-data-item smaller">
                        <h3 class="label">Minted fUSD</h3>
                        <div class="value">{{ debt }}</div>
                    </div>
                    <div class="df-data-item smaller">
                        <h3 class="label">Locked balance</h3>
                        <div class="value">{{ collateral }} <span class="currency">FTM</span></div>
                    </div>
                </template>
            </div>
            <div class="defi-price-input-col align-center">
                <div class="defi-price-input">
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

                    <div class="token-label">fUSD</div>
                    <div class="token-info">
                        <div class="token-info-label">Decrease fUSD</div>
                        <icon data="@/assets/svg/angle-double-left.svg" width="66" height="66" aria-hidden="true" />
                    </div>
                    <div class="token-info increase">
                        <div class="token-info-label">Increase fUSD</div>
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
                    <h3 class="label">Locked balance</h3>
                    <div class="value">{{ collateral }} <span class="currency">FTM</span></div>
                </div>
                <div v-if="smallView" class="df-data-item smaller">
                    <h3 class="label">Debt Limit</h3>
                    <div class="value">
                        <f-colored-number-range show-percentage :colors="colors" :value="mintingLimit" />
                    </div>
                </div>
            </div>

            <f-message v-if="increasedDebt > 0" type="info" role="alert">
                You’re adding <span class="inc-desc-collateral">{{ increasedDebt.toFixed(2) }} fUSD</span>
            </f-message>
            <f-message v-else-if="decreasedDebt > 0" type="info" role="alert">
                You’re removing <span class="inc-desc-collateral">{{ decreasedDebt.toFixed(2) }} fUSD</span>
            </f-message>
        </div>

        <div class="buttons">
            <button class="btn large" :disabled="submitDisabled">
                <template v-if="submitDisabled">Mint or Repay now</template>
                <template v-else-if="increasedDebt > 0 || debt === 0">Mint {{ increasedDebt.toFixed(2) }} now</template>
                <template v-else>Repay {{ decreasedDebt.toFixed(2) }} now</template>
            </button>
        </div>

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
                    Locked balance: {{ item.collateral }}, Minted fUSD: {{ item.debt }}
                    <template v-if="item.tokenPrice"> , Token price: {{ item.tokenPrice }} </template>
                </button>
                <br />
            </div>
        </div>
    </div>
</template>

<script>
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import FColoredNumberRange from '../../components/core/FColoredNumberRange/FColoredNumberRange.vue';
import FSlider from '../../components/core/FSlider/FSlider.vue';
import FCircleProgress from '../../components/core/FCircleProgress/FCircleProgress.vue';
import { getUniqueId } from '../../utils';
import { mapGetters } from 'vuex';
import { formatNumberByLocale } from '../../filters.js';
import { getAppParentNode } from '../../app-structure.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';

/**
 * Common component for defi mint and repay.
 */
export default {
    name: 'DefiMintRepay',

    components: { FMessage, FBackButton, FColoredNumberRange, FSlider, FCircleProgress },

    data() {
        return {
            currDebt: '0',
            tokenPrice: 0,
            increasedDebt: 0,
            decreasedDebt: 0,
            label: 'tmp',
            id: getUniqueId(),
            tmpShow: true,
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
            return this.tmpValues.collateral;
        },

        currentPrice() {
            return formatNumberByLocale(this.tokenPrice, 5, 'USD');
        },

        maxMintable() {
            return this.$defi.getMaxDebt(this.collateral, this.tokenPrice).toFixed(2);
        },

        mintingLimit() {
            return this.$defi.getMintingLimit(this.currDebt, this.collateral, this.tokenPrice);
        },

        minDebt() {
            return 0;
        },

        maxDebt() {
            return Math.max(this.maxMintable, this.debt);
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

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-mint-repay');

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
    },

    created() {
        this.currDebt = this.debt.toString();
        this.updateMessage();

        this.init();
    },

    methods: {
        async init() {
            this.tokenPrice = await this.$defi.init('USD');
            this.tmpTokenPrice = this.tokenPrice;
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

        onInput(_event) {
            this.currDebt = this.$refs.slider.getCorrectValue(_event.target.value);
            _event.target.value = this.formatInputValue(this.currDebt);
        },

        onResetBtnClick() {
            this.updateCurrDebt();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
