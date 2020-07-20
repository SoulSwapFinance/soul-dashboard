<template>
    <div class="view-defi-manage-collateral">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> Collateral</h1>

        <h2 class="perex">
            Lock FTM to increase the collateral ratio and mint fUSD, unlock FTM after you repaid fUSD.
        </h2>

        <div class="grid">
            <div>
                <div class="df-data-item smaller">
                    <h3 class="label">Available balance</h3>
                    <div class="value">{{ formatNumberByLocale(availableFTM) }} <span class="currency">FTM</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Locked balance</h3>
                    <div class="value">{{ collateral.toFixed(2) }} <span class="currency">FTM</span></div>
                </div>
                <div v-if="!largeView" class="df-data-item smaller">
                    <h3 class="label">Minted fUSD</h3>
                    <div class="value">{{ debt }} <span class="currency">fUSD</span></div>
                </div>
            </div>
            <div class="defi-price-input-col align-center">
                <div class="defi-price-input">
                    <label :for="`text-input-${id}`" class="not-visible">{{ label }}</label>
                    <input
                        :id="`text-input-${id}`"
                        ref="input"
                        :value="inputValue"
                        :min="minCollateral"
                        :max="maxCollateral"
                        type="number"
                        step="any"
                        class="text-input no-style"
                        @change="onInput"
                    />

                    <div class="f-slider-wrap">
                        <f-slider
                            ref="slider"
                            v-model="currCollateral"
                            step="any"
                            :min="minCollateral.toString()"
                            :max="maxCollateral.toString()"
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

                    <div class="token-label">FTM</div>
                    <div class="collateral-info">
                        <div class="collateral-info-label">Decrease collateral</div>
                        <icon data="@/assets/svg/angle-double-left.svg" width="66" height="66" aria-hidden="true" />
                    </div>
                    <div class="collateral-info increase">
                        <div class="collateral-info-label">Increase collateral</div>
                        <icon data="@/assets/svg/angle-double-right.svg" width="66" height="66" aria-hidden="true" />
                    </div>
                </div>
            </div>
            <div v-if="!smallView" class="minting-limit-col align-center">
                <template v-if="debt > 0">
                    <h3>Debt Limit</h3>
                    <f-circle-progress
                        show-percentage
                        :stroke-width="6"
                        :animate="false"
                        :colors="colors"
                        :value="mintingLimit"
                    />
                </template>
                <div v-else class="df-data-item">
                    <h3 class="no-margin">Max mintable</h3>
                    <div class="value">{{ maxMintable }} <span class="currency">fUSD</span></div>
                </div>
            </div>
            <div v-if="largeView" class="right-col">
                <div class="df-data-item smaller">
                    <h3 class="label">Minted fUSD</h3>
                    <div class="value">{{ debt }} <span class="currency">fUSD</span></div>
                </div>
                <template v-if="smallView">
                    <div v-if="debt > 0" class="df-data-item smaller">
                        <h3 class="label">Debt Limit</h3>
                        <div class="value">
                            <f-colored-number-range show-percentage :colors="colors" :value="mintingLimit" />
                        </div>
                    </div>
                    <div v-else class="df-data-item smaller">
                        <h3 class="label">Max mintable</h3>
                        <div class="value">{{ maxMintable }} <span class="currency">fUSD</span></div>
                    </div>
                </template>
            </div>

            <f-message v-if="message" type="info" role="alert" class="big">
                {{ message }}
            </f-message>
            <f-message v-else-if="increasedCollateral > 0" type="info" role="alert" class="big">
                You’re adding <span class="inc-desc-collateral">{{ increasedCollateral.toFixed(2) }} FTM</span> to your
                collateral
            </f-message>
            <f-message v-else-if="decreasedCollateral > 0" type="info" role="alert" class="big">
                You’re removing <span class="inc-desc-collateral">{{ decreasedCollateral.toFixed(2) }} FTM</span> from
                your collateral
            </f-message>
        </div>

        <div class="buttons">
            <button class="btn large" :disabled="submitDisabled" @click="onSubmit">
                <template v-if="collateral > 0">Rebalance now</template>
                <template v-else>Add collateral</template>
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
                    Available balance: {{ item.availableFTM }}, Locked balance: {{ item.collateral }}, Minted fUSD:
                    {{ item.debt }}
                    <template v-if="item.tokenPrice"> , Token price: {{ item.tokenPrice }} </template>
                </button>
                <br />
            </div>
        </div>
    </div>
</template>

<script>
import FCircleProgress from '../../components/core/FCircleProgress/FCircleProgress.vue';
import { mapGetters } from 'vuex';
import { WEIToFTM } from '../../utils/transactions.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import FSlider from '../../components/core/FSlider/FSlider.vue';
import { getUniqueId } from '../../utils';
import FColoredNumberRange from '../../components/core/FColoredNumberRange/FColoredNumberRange.vue';
import { getAppParentNode } from '../../app-structure.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { formatNumberByLocale } from '../../filters.js';

export default {
    name: 'DefiManageCollateral',

    components: { FBackButton, FColoredNumberRange, FSlider, FMessage, FCircleProgress },

    data() {
        return {
            /** @type {DefiAccount} */
            defiAccount: {
                collateral: [],
                debt: [],
            },
            /** @type {DefiToken} */
            token: null,
            /** @type {DefiToken[]} */
            tokens: [],
            currCollateral: '0',
            message: '',
            tokenPrice: 0,
            increasedCollateral: 0,
            decreasedCollateral: 0,
            label: 'tmp',
            id: getUniqueId(),
            tmpShow: false,
            tmpValues: {
                availableFTM: 10000,
                collateral: 0,
                debt: 0,
                /*
                availableFTM: 5000,
                collateral: 10000,
                debt: 20,
*/
            },
            tmpTokenPrice: 0,
            tmpTestData: [
                { availableFTM: 10000, collateral: 0, debt: 0 },
                { availableFTM: 0, collateral: 4000, debt: 0 },
                { availableFTM: 10000, collateral: 5000, debt: 0 },
                { availableFTM: 5000, collateral: 10000, debt: 20 },
                { availableFTM: 10000, collateral: 5000, debt: 20 },
                { availableFTM: 2000, collateral: 5000, debt: 20, tokenPrice: 0.008 },
                { availableFTM: 2000, collateral: 5000, debt: 20, tokenPrice: 0.007 },
                { availableFTM: 2000, collateral: 5000, debt: 20, tokenPrice: 0.0065 },
            ],
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        debt() {
            /** @type {DefiToken} */
            const token = this.tokens.find((_item) => _item.symbol === 'FUSD');
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountCollateral(this.defiAccount, token);

            return this.$defi.fromTokenValue(tokenBalance.value, token) || 0;
        },

        collateral() {
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountCollateral(this.defiAccount, this.token);

            return this.$defi.fromTokenValue(tokenBalance.balance, this.token) || 0;
        },

        availableFTM() {
            const available = this.currentAccount ? this.currentAccount.balance : 0;

            return WEIToFTM(available);
        },

        /*
        debt() {
            return this.tmpValues.debt;
        },

        collateral() {
            return this.tmpValues.collateral;
        },

        availableFTM() {
            return this.tmpValues.availableFTM;
        },
        */

        maxMintable() {
            return this.$defi.getMaxDebt(this.currCollateral, this.tokenPrice).toFixed(2);
        },

        mintingLimit() {
            return this.$defi.getMintingLimit(this.debt, this.currCollateral, this.tokenPrice);
        },

        minCollateral() {
            let minC = 0;

            if (this.tokenPrice > 0) {
                minC = this.$defi.getMinCollateral(this.debt, this.tokenPrice) + (this.debt > 0 ? 1 : 0);
            }

            return Math.min(minC, this.collateral);
        },

        maxCollateral() {
            return this.collateral + this.availableFTM;
        },

        inputValue() {
            return this.formatInputValue(this.currCollateral);
        },

        submitDisabled() {
            return parseFloat(this.currCollateral) === parseFloat(this.collateral);
        },

        colors() {
            return this.$defi.getColors();
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-manage-collateral');

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
        currCollateral(_value, _oldValue) {
            let cValue;

            // console.log('tf', _value, _oldValue);

            if (_value !== _oldValue) {
                cValue = this.$refs.slider.getCorrectValue(_value);

                if (cValue !== _value && cValue === this.maxCollateral.toString()) {
                    this.currCollateral = cValue;
                    // this.$refs.input.select();
                }

                // const currCollateral = parseFloat(this.currCollateral);
                this.updateMessage();
            }
        },
    },

    created() {
        this.updateMessage();

        this.init();
        /*

        console.log(this.debt, this.tokenPrice);
        console.log(this.tmp);
*/
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
            this.tokens = result[1];
            this.token = this.tokens.find((_item) => _item.symbol === 'FTM');
            this.tokenPrice = $defi.getTokenPrice(this.token);
            this.currCollateral = this.collateral.toString();

            this.tmpTokenPrice = this.tokenPrice;
        },

        formatInputValue(_value) {
            return parseFloat(_value).toFixed(2);
        },

        updateMessage() {
            if (this.availableFTM <= 0.01) {
                this.message = 'Deposit more FTM to increase your collateral';
            } else {
                this.message = '';
            }

            this.increasedCollateral = 0;
            this.decreasedCollateral = 0;

            if (this.collateral > 0) {
                const collateralDiff = parseFloat(this.currCollateral) - this.collateral;

                if (collateralDiff > 0) {
                    this.increasedCollateral = collateralDiff;
                    this.message = '';
                } else if (collateralDiff < 0) {
                    this.decreasedCollateral = -collateralDiff;
                    this.message = '';
                }
            }
        },

        updateCurrCollateral() {
            this.currCollateral = this.collateral.toString();
        },

        onSubmit() {
            if (!this.submitDisabled) {
                this.$router.push({
                    name: 'defi-manage-collateral-confirmation',
                    params: { currCollateral: parseFloat(this.currCollateral), collateral: this.collateral },
                });
            }
        },

        onInput(_event) {
            this.currCollateral = this.$refs.slider.getCorrectValue(_event.target.value);
            _event.target.value = this.formatInputValue(this.currCollateral);
        },

        onResetBtnClick() {
            this.updateCurrCollateral();
        },

        formatNumberByLocale,

        _setTmpValues(_values) {
            this.tmpValues = {
                availableFTM: _values.availableFTM,
                collateral: _values.collateral,
                debt: _values.debt,
            };

            if (_values.tokenPrice) {
                this.tokenPrice = _values.tokenPrice;
            } else {
                this.tokenPrice = this.tmpTokenPrice;
            }

            this.updateCurrCollateral();
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
