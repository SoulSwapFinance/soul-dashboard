<template>
    <div class="defi-deposit">
        <div class="grid">
            <div>
                <div class="df-data-item smaller">
                    <h3 class="label">Available Balance</h3>
                    <div class="value"><f-token-value :token="dToken" :value="availableBalance" /></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Deposit Balance</h3>
                    <div class="value"><f-token-value :token="dToken" :value="collateral" /></div>
                </div>
                <div v-if="!largeView" class="df-data-item smaller">
                    <h3 class="label">Total Deposit</h3>
                    <div class="value"><f-token-value :token="fusdToken" :value="overallCollateral" /></div>
                </div>
                <div v-if="!largeView" class="df-data-item smaller">
                    <h3 class="label">Total Borrowed</h3>
                    <div class="value"><f-token-value :token="fusdToken" :value="overallDebt" /></div>
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
                        <div class="slider-buttons">
                            <button class="btn small light" @click="onMinBtnClick">Min</button>
                            <button
                                v-show="currCollateral !== collateral.toString()"
                                class="btn small light"
                                @click="onResetBtnClick"
                            >
                                Reset
                            </button>
                            <button class="btn small light" @click="onMaxBtnClick">Max</button>
                        </div>
                    </div>

                    <div class="token-label">
                        <f-select-button
                            v-if="!singleToken"
                            collapsed
                            aria-label="pick a token"
                            @click.native="onTokenSelectorClick"
                        >
                            <f-crypto-symbol :token="dToken" />
                        </f-select-button>
                        <template v-else>
                            <f-crypto-symbol :token="dToken" />
                        </template>
                    </div>

                    <div class="collateral-info">
                        <div class="collateral-info-label">Withdraw</div>
                        <icon data="@/assets/svg/angle-double-left.svg" width="66" height="66" aria-hidden="true" />
                    </div>
                    <div class="collateral-info increase">
                        <div class="collateral-info-label">Deposit</div>
                        <icon data="@/assets/svg/angle-double-right.svg" width="66" height="66" aria-hidden="true" />
                    </div>
                </div>
            </div>
            <div v-if="!smallView" class="minting-limit-col align-center">
                <!--                <template v-if="debt > 0">-->
                <h3>Debt Limit</h3>
                <f-circle-progress
                    show-percentage
                    :stroke-width="6"
                    :animate="false"
                    :colors="colors"
                    :value="debtLimit"
                />
                <!--
                </template>
                <div v-else class="df-data-item">
                    <h3 class="no-margin">Max mintable</h3>
                    <div class="value">
                        -&#45;&#45;
                        &lt;!&ndash;{{ maxMintable }} <span class="currency">{{ tokenSymbol }}</span>&ndash;&gt;
                    </div>
                </div>
                -->
            </div>
            <div v-if="largeView" class="right-col">
                <div class="df-data-item smaller">
                    <h3 class="label">Minted {{ tokenSymbol }}</h3>
                    <div class="value"><f-token-value :token="dToken" :value="debt" no-currency /></div>
                </div>
                <!--
                <div class="df-data-item smaller">
                    <h3 class="label">Total Deposit</h3>
                    <div class="value">{{ overallCollateral.toFixed(3) }} <span class="currency">fUSD</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Total Borrowed</h3>
                    <div class="value">{{ overallDebt.toFixed(3) }} <span class="currency">fUSD</span></div>
                </div>
                -->
                <template v-if="smallView">
                    <div class="df-data-item smaller">
                        <h3 class="label">Debt Limit</h3>
                        <div class="value">
                            <f-placeholder :content-loaded="!!tokenPrice" replacement-text="99%">
                                <f-colored-number-range show-percentage :colors="colors" :value="debtLimit" />
                            </f-placeholder>
                        </div>
                    </div>
                    <!--
                    <div v-else class="df-data-item smaller">
                        <h3 class="label">Max Mintable</h3>
                        <div class="value">
                            -&#45;&#45;
                            &lt;!&ndash;{{ maxMintable }} <span class="currency">{{ tokenSymbol }}</span>&ndash;&gt;
                        </div>
                    </div>
                    -->
                </template>
            </div>

            <f-message v-if="message" type="info" role="alert" class="big">
                {{ message }}
            </f-message>
            <f-message v-else-if="increasedCollateral > 0" type="info" role="alert" class="big">
                You’re adding
                <span class="inc-desc-collateral">
                    <f-token-value :token="dToken" :value="increasedCollateral" no-currency /> {{ tokenSymbol }}
                </span>
                to your collateral
            </f-message>
            <f-message v-else-if="decreasedCollateral > 0" type="info" role="alert" class="big">
                You’re removing
                <span class="inc-desc-collateral">
                    <f-token-value :token="dToken" :value="decreasedCollateral" no-currency /> {{ tokenSymbol }}
                </span>
                from your collateral
            </f-message>
        </div>

        <div class="defi-buttons">
            <button class="btn large" :disabled="submitDisabled" @click="onSubmit">
                Submit
                <!--
                <template v-if="collateral > 0">
                    <template v-if="collateral === parseFloat(currCollateral)">Rebalance Now</template>
                    <template v-else-if="increasedCollateral > 0">Deposit Now</template>
                    <template v-else>Withdraw Deposit Now</template>
                </template>
                <template v-else>Add collateral</template>
                -->
            </button>
        </div>

        <defi-token-picker-window ref="pickTokenWindow" :tokens="tokens" @defi-token-picked="onDefiTokenPicked" />
    </div>
</template>

<script>
import FCircleProgress from '../../components/core/FCircleProgress/FCircleProgress.vue';
import { mapGetters } from 'vuex';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import FSlider from '../../components/core/FSlider/FSlider.vue';
import { getUniqueId } from '../../utils';
import FColoredNumberRange from '../../components/core/FColoredNumberRange/FColoredNumberRange.vue';
import { formatNumberByLocale } from '../../filters.js';
import { eventBusMixin } from '../../mixins/event-bus.js';
import FSelectButton from '../core/FSelectButton/FSelectButton.vue';
import FCryptoSymbol from '../core/FCryptoSymbol/FCryptoSymbol.vue';
import DefiTokenPickerWindow from '../windows/DefiTokenPickerWindow/DefiTokenPickerWindow.vue';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';

export default {
    name: 'DefiDeposit',

    components: {
        FPlaceholder,
        FTokenValue,
        DefiTokenPickerWindow,
        FCryptoSymbol,
        FSelectButton,
        FColoredNumberRange,
        FSlider,
        FMessage,
        FCircleProgress,
    },

    mixins: [eventBusMixin],

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
            /** @type {DefiAccount} */
            defiAccount: {
                collateral: [],
                debt: [],
            },
            /** @type {DefiToken} */
            dToken: {},
            /** @type {DefiToken} */
            fusdToken: {},
            /** @type {DefiToken[]} */
            tokens: [],
            currCollateral: '0',
            message: '',
            tokenPrice: 0,
            increasedCollateral: 0,
            decreasedCollateral: 0,
            label: 'tmp',
            id: getUniqueId(),
        };
    },

    computed: {
        ...mapGetters(['currentAccount', 'defiSlippageReserve']),

        availableBalance() {
            return this.$defi.fromTokenValue(this.dToken.availableBalance, this.dToken) || 0;
        },

        tokenSymbol() {
            return this.$defi.getTokenSymbol(this.dToken);
        },

        collateral() {
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountCollateral(this.defiAccount, this.dToken);

            return this.$defi.fromTokenValue(tokenBalance.balance, this.dToken) || 0;
        },

        overallCollateral() {
            return this.$defi.getOverallCollateral(this.defiAccount);
        },

        overallDebt() {
            return this.$defi.getOverallDebt(this.defiAccount);
        },

        minCollateral() {
            const collateralFUSD = parseFloat(this.collateral) * this.tokenPrice;
            let minC = 0;

            if (this.tokenPrice > 0) {
                /*
                console.log(
                    'overallCollateral ' + this.overallCollateral,
                    'overallDebt ' + this.overallDebt,
                    'collateral ' + this.collateral,
                    'collateralFUSD ' + collateralFUSD,
                    'tokenPrice ' + this.tokenPrice,
                    'min collateral ' + this.$defi.getMinCollateral(this.overallDebt, 1)
                );
                */
                const overallCollateralLeft = this.overallCollateral - this.$defi.getMinCollateral(this.overallDebt, 1);
                minC = collateralFUSD - overallCollateralLeft;
                if (minC < 0) {
                    minC = 0;
                } else {
                    // collateral minus rest in token currency
                    minC = this.collateral - (collateralFUSD - minC) / this.tokenPrice;
                    // TMP!
                    minC *= 1.005;
                }

                console.log('minc', minC);
            }

            return minC + this.defiSlippageReserve * this._maxCollateral;
        },

        /*
        minCollateral() {
            let minC = 0;

            if (this.tokenPrice > 0) {
                // minC = this.$defi.getMinCollateral(this.debt, this.tokenPrice) + (this.debt > 0 ? 1 : 0);
                minC = this.$defi.getMinCollateral(this.debt, this.tokenPrice);
            }

            return Math.min(minC, this.collateral);
        },
*/

        maxCollateral() {
            const maxCollateral = this._maxCollateral;

            console.log(this._maxCollateral);

            return maxCollateral - maxCollateral * this.defiSlippageReserve;
        },

        _maxCollateral() {
            return this.collateral + this.availableBalance;
        },

        debt() {
            /** @type {DefiTokenBalance} */
            const tokenBalance = this.$defi.getDefiAccountDebt(this.defiAccount, this.dToken);

            return this.$defi.fromTokenValue(tokenBalance.balance, this.dToken) || 0;
        },

        // ------------

        maxMintable() {
            /*
            const { $defi } = this;
            const fusdToken = this.tokens.find((_item) => _item.symbol === 'FUSD');
            const totalDebtFUSD = $defi.fromTokenValue(this.defiAccount.debtValue, fusdToken);
            const totalCollateralFUSD = $defi.fromTokenValue(this.defiAccount.collateralValue, fusdToken);
            const borrowLimitFUSD = $defi.getMaxDebtFUSD(totalCollateralFUSD) - totalDebtFUSD;

            return borrowLimitFUSD / this.tokenPrice;
*/
            return this.$defi.getMaxDebt(this.currCollateral, this.tokenPrice).toFixed(5);
        },

        debtLimit() {
            // const currCollateralFUSD = parseFloat(this.currCollateral) * this.tokenPrice;
            const collateralFUSD = parseFloat(this.collateral) * this.tokenPrice;
            const currCollateralFUSD = parseFloat(this.currCollateral) * this.tokenPrice - collateralFUSD;

            return this.$defi.getDebtLimit(this.defiAccount, 0, currCollateralFUSD);
            // return this.$defi.getMintingLimit(this.debt, this.currCollateral, this.tokenPrice);
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

        dToken(_value) {
            if (_value) {
                this.tokenPrice = this.$defi.getTokenPrice(_value);

                this.$nextTick(() => {
                    this.currCollateral = this.collateral.toString();
                });
            }
        },
    },

    created() {
        this.updateMessage();

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
            const tokens = result[1];

            this.defiAccount = result[0];
            this.tokens = result[1];
            this.fusdToken = this.tokens.find((_item) => _item.symbol === 'FUSD');
            // this.currCollateral = this.collateral.toString();

            if (!this.singleToken) {
                // get tokens that are possible to deposit
                this.tokens = tokens.filter($defi.canTokenBeDeposited);
            }

            if (this.token === null) {
                // get first token that can be deposited
                this.dToken = this.tokens[0];
            } else {
                this.dToken = tokens.find((_item) => _item.symbol === this.token.symbol);
            }
        },

        formatInputValue(_value) {
            return parseFloat(_value).toFixed(this.$defi.getTokenDecimals(this.dToken));
        },

        updateMessage() {
            /*
            if (this.availableFTM <= 0.01) {
                this.message = 'Deposit more FTM to increase your collateral';
            } else {
                this.message = '';
            }
*/

            this.message = '';

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
            const tokenBalance = this.$defi.getDefiAccountCollateral(this.defiAccount, this.dToken);
            const params = {
                currCollateral: parseFloat(this.currCollateral),
                collateral: this.collateral,
                collateralHex: tokenBalance.balance,
                token: { ...this.dToken },
                steps: 2,
                step: 1,
            };

            if (!this.submitDisabled) {
                this.$router.push({
                    name: 'defi-manage-deposit-confirmation',
                    params,
                });
            }
        },

        onInput(_event) {
            this.currCollateral = this.$refs.slider.getCorrectValue(_event.target.value);
            _event.target.value = this.formatInputValue(this.currCollateral);
        },

        onTokenSelectorClick() {
            this.$refs.pickTokenWindow.show();
        },

        onDefiTokenPicked(_token) {
            this.dToken = _token;
        },

        onMinBtnClick() {
            this.currCollateral = this.minCollateral.toString();
        },

        onResetBtnClick() {
            this.updateCurrCollateral();
        },

        onMaxBtnClick() {
            this.currCollateral = this.maxCollateral.toString();
        },

        onAccountPicked() {
            this.init();
        },

        formatNumberByLocale,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
