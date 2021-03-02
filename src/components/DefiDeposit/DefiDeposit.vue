<template>
    <div class="defi-deposit" :class="{ 'deposit-or-withdraw': depositOrWithdraw }">
        <div class="grid">
            <div>
                <div class="df-data-item smaller">
                    <h3 class="label">Available Balance</h3>
                    <div class="value">
                        <f-token-value v-if="!lockUnlockMode" :token="dToken" :value="availableBalance" />
                        <template v-else>
                            <div v-for="token1 in tokens" :key="`l1_${token1.symbol}`">
                                <f-token-value :token="token1" :value="getAvailableBalance(token1)" />
                            </div>
                        </template>
                    </div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">
                        <template v-if="lockUnlockMode">Locked Balance</template>
                        <template v-else>Deposit Balance</template>
                    </h3>
                    <div class="value">
                        <f-token-value v-if="!lockUnlockMode" :token="dToken" :value="collateral" />
                        <template v-else>
                            <div v-for="token2 in tokens" :key="`l2_${token2.symbol}`">
                                <f-token-value :token="token2" :value="getCollateral(token2)" />
                            </div>
                        </template>
                    </div>
                </div>
                <div v-if="!largeView" class="df-data-item smaller">
                    <h3 class="label">
                        <template v-if="lockUnlockMode">Total Locked</template>
                        <template v-else>Total Deposit</template>
                    </h3>
                    <div class="value"><f-token-value :token="fusdToken" :value="overallCollateral" /></div>
                </div>
                <div v-if="!largeView" class="df-data-item smaller">
                    <h3 class="label">
                        <template v-if="lockUnlockMode">Total Minted</template>
                        <template v-else>Total Borrowed</template>
                    </h3>
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

                    <div v-if="!depositOrWithdraw" class="f-slider-wrap">
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
                    <div v-else class="f-slider-wrap">
                        <f-slider
                            ref="slider"
                            v-model="currCollateral"
                            step="any"
                            :min="minCollateral.toString()"
                            :max="maxCollateral.toString()"
                            :labels="sliderLabels"
                            clickable-labels
                            use-lower-fill-bar
                        >
                            <template #top="sProps">
                                <label :for="sProps.inputId" class="not-visible">{{ label }}</label>
                            </template>
                        </f-slider>
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
                        <div class="collateral-info-label">
                            <template v-if="lockUnlockMode">Unlock {{ cTokenSymbol }}</template>
                            <template v-else>Withdraw</template>
                        </div>
                        <icon data="@/assets/svg/angle-double-left.svg" width="66" height="66" aria-hidden="true" />
                    </div>
                    <div class="collateral-info increase">
                        <div class="collateral-info-label">
                            <template v-if="lockUnlockMode">Lock {{ cTokenSymbol }}</template>
                            <template v-else>Deposit</template>
                        </div>
                        <icon data="@/assets/svg/angle-double-right.svg" width="66" height="66" aria-hidden="true" />
                    </div>
                </div>
            </div>
            <div v-if="!smallView" class="minting-limit-col align-center">
                <!--                <template v-if="debt > 0">-->
                <ratio-info :value="collateralRatio" />

                <!--
                </template>
                <div v-else class="df-data-item">
                    <h3 class="no-margin">Max mintable</h3>
                    <div class="value">
                        -&#45;&#45;
                        &lt;!&ndash;{{ maxMintable }} <span class="currency">{{ cTokenSymbol }}</span>&ndash;&gt;
                    </div>
                </div>
                -->
            </div>
            <div v-if="largeView" class="right-col">
                <div class="df-data-item smaller">
                    <h3 class="label">Minted {{ cTokenSymbol }}</h3>
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
                        <ratio-info :display-circle="false" :content-loaded="!!tokenPrice" :value="collateralRatio" />
                    </div>
                    <!--
                    <div v-else class="df-data-item smaller">
                        <h3 class="label">Max Mintable</h3>
                        <div class="value">
                            -&#45;&#45;
                            &lt;!&ndash;{{ maxMintable }} <span class="currency">{{ cTokenSymbol }}</span>&ndash;&gt;
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
                    <f-token-value :token="dToken" :value="increasedCollateral" no-currency /> {{ cTokenSymbol }}
                </span>
                to your collateral
            </f-message>
            <f-message v-else-if="decreasedCollateral > 0" type="info" role="alert" class="big">
                You’re removing
                <span class="inc-desc-collateral">
                    <f-token-value :token="dToken" :value="decreasedCollateral" no-currency /> {{ cTokenSymbol }}
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
        <tx-confirmation-window
            ref="confirmationWindow"
            body-min-height="350px"
            :steps-count="stepsCount"
            :active-step="activeStep"
        >
            <f-view-transition :views-structure="viewsStructure" :app-node-id="currentAppNodeId" class="min-h-100">
                <component
                    :is="currentComponent"
                    v-bind="currentComponentProperties"
                    @change-component="onChangeComponent"
                    @cancel-button-click="onCancelButtonClick"
                ></component>
            </f-view-transition>
        </tx-confirmation-window>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import FSlider from '../../components/core/FSlider/FSlider.vue';
import { getUniqueId } from '../../utils';
import { formatNumberByLocale } from '../../filters.js';
import { eventBusMixin } from '../../mixins/event-bus.js';
import FSelectButton from '../core/FSelectButton/FSelectButton.vue';
import FCryptoSymbol from '../core/FCryptoSymbol/FCryptoSymbol.vue';
import DefiTokenPickerWindow from '../windows/DefiTokenPickerWindow/DefiTokenPickerWindow.vue';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import RatioInfo from '@/components/RatioInfo/RatioInfo.vue';
import { componentViewMixin } from '@/mixins/component-view.js';
import TxConfirmationWindow from '@/components/windows/TxConfirmationWindow/TxConfirmationWindow.vue';
import DefiDepositConfirmation from '@/components/DefiDepositConfirmation/DefiDepositConfirmation.vue';
import TransactionSuccessMessage from '@/components/TransactionSuccessMessage/TransactionSuccessMessage.vue';
import FViewTransition from '@/components/core/FViewTransition/FViewTransition.vue';

export default {
    name: 'DefiDeposit',

    components: {
        FViewTransition,
        TransactionSuccessMessage,
        DefiDepositConfirmation,
        TxConfirmationWindow,
        RatioInfo,
        FTokenValue,
        DefiTokenPickerWindow,
        FCryptoSymbol,
        FSelectButton,
        FSlider,
        FMessage,
    },

    mixins: [eventBusMixin, componentViewMixin],

    props: {
        /** @type {DefiToken} */
        token: {
            type: Object,
            default() {
                return null;
            },
        },
        /** */
        tokenSymbol: {
            type: String,
            default: '',
        },
        /** */
        tokenAddress: {
            type: String,
            default: '',
        },
        /** Follow this route on submit. */
        onSubmitRoute: {
            type: String,
            default: 'defi-manage-deposit-confirmation',
        },
        /** Used in fMint. */
        lockUnlockMode: {
            type: Boolean,
            default: false,
        },
        /** Just deposit. */
        deposit: {
            type: Boolean,
            default: false,
        },
        /** Just withdraw deposit. */
        withdraw: {
            type: Boolean,
            default: false,
        },
        /** Mode with sindgle token - no token picker,... */
        singleToken: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            /** @type {FMintAccount} */
            fMintAccount: {
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
            depositOrWithdraw: this.deposit || this.withdraw,
            sliderLabels: ['0%', '25%', '50%', '75%', '100%'],
            label: 'tmp',
            id: getUniqueId(),
            stepsCount: 2,
            /** Active step (`<1, stepsCount>`) */
            activeStep: 1,
            viewsStructureRootNode: 'defi-home',
        };
    },

    computed: {
        ...mapGetters(['currentAccount', 'defiSlippageReserve']),

        availableBalance() {
            return this.getAvailableBalance(this.dToken);
        },

        cTokenSymbol() {
            return this.$defi.getTokenSymbol(this.dToken);
        },

        collateral() {
            return this.getCollateral(this.dToken);
        },

        overallCollateral() {
            return this.$defi.getOverallCollateral(this.fMintAccount);
        },

        overallDebt() {
            return this.$defi.getOverallDebt(this.fMintAccount);
        },

        minCollateral() {
            if (this.depositOrWithdraw) {
                return 0;
            } else {
                return this._minCollateral;
            }
        },

        _minCollateral() {
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
            let max = 0;

            if (this.withdraw) {
                max = this.collateral - this._minCollateral;
            } else {
                max = maxCollateral - maxCollateral * this.defiSlippageReserve;
            }

            if (max < 0) {
                max = 0;
            }

            return max;
        },

        _maxCollateral() {
            if (this.depositOrWithdraw) {
                return this.availableBalance;
            } else {
                return this.collateral + this.availableBalance;
            }
        },

        debt() {
            /** @type {FMintTokenBalance} */
            const tokenBalance = this.$defi.getFMintAccountDebt(this.fMintAccount, this.dToken);

            return this.$defi.fromTokenValue(tokenBalance.balance, this.dToken) || 0;
        },

        // ------------

        maxMintable() {
            /*
            const { $defi } = this;
            const fusdToken = this.tokens.find((_item) => _item.symbol === 'FUSD');
            const totalDebtFUSD = $defi.fromTokenValue(this.fMintAccount.debtValue, fusdToken);
            const totalCollateralFUSD = $defi.fromTokenValue(this.fMintAccount.collateralValue, fusdToken);
            const borrowLimitFUSD = $defi.getMaxDebtFUSD(totalCollateralFUSD) - totalDebtFUSD;

            return borrowLimitFUSD / this.tokenPrice;
*/
            return this.$defi.getMaxDebt(this.currCollateral, this.tokenPrice).toFixed(5);
        },

        currCollateralFUSD() {
            const collateral = parseFloat(this.collateral);
            const collateralFUSD = collateral * this.tokenPrice;
            let cCollateral = parseFloat(this.currCollateral);

            if (this.deposit) {
                cCollateral = collateral + cCollateral;
            } else if (this.withdraw) {
                cCollateral = collateral - cCollateral;
            }

            return cCollateral * this.tokenPrice - collateralFUSD;
        },

        debtLimit() {
            return this.$defi.getDebtLimit(this.fMintAccount, 0, this.currCollateralFUSD);
            // return this.$defi.getMintingLimit(this.debt, this.currCollateral, this.tokenPrice);
        },

        collateralRatio() {
            return this.$defi.getCollateralRatio(this.fMintAccount, 0, this.currCollateralFUSD);
        },

        inputValue() {
            return this.formatInputValue(this.currCollateral);
        },

        submitDisabled() {
            return !parseFloat(this.currCollateral);
            /*
            return !this.singleToken
                ? parseFloat(this.currCollateral) === parseFloat(this.collateral)
                : !parseFloat(this.currCollateral);
            */
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

                if (!this.depositOrWithdraw) {
                    this.$nextTick(() => {
                        this.currCollateral = this.collateral.toString();
                    });
                }
            }
        },
    },

    created() {
        this.updateMessage();

        this.init();

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        async init(_dontSetDToken) {
            const { $defi } = this;
            const result = await Promise.all([
                $defi.fetchFMintAccount(this.currentAccount.address),
                $defi.fetchTokens(this.currentAccount.address),
                $defi.init(),
            ]);

            this.fMintAccount = result[0];
            this.tokens = result[1];
            this.fusdToken = this.tokens.find((_item) => _item.symbol === 'FUSD');
            // this.currCollateral = this.collateral.toString();

            if (!this.singleToken) {
                // get tokens that are possible to deposit
                this.tokens = this.tokens.filter($defi.canTokenBeDeposited);

                if (this.lockUnlockMode) {
                    this.tokens = this.tokens.filter((_token) => _token.symbol !== 'FUSD');
                }
            }

            if (!_dontSetDToken) {
                if (this.token === null) {
                    if (this.tokenAddress) {
                        this.dToken = this.tokens.find((_token) => _token.address === this.tokenAddress);
                    } else if (this.tokenSymbol) {
                        this.dToken = this.tokens.find((_token) => _token.symbol === this.tokenSymbol);
                    } else {
                        // get first token that can be deposited
                        this.dToken = this.tokens[0];
                    }
                } else {
                    this.dToken = this.tokens.find((_item) => _item.symbol === this.token.symbol);
                }
            }
        },

        formatInputValue(_value) {
            return parseFloat(_value).toFixed(this.$defi.getTokenDecimals(this.dToken));
        },

        getAvailableBalance(_token) {
            return this.$defi.fromTokenValue(_token.availableBalance, _token) || 0;
        },

        getCollateral(_token) {
            /** @type {FMintTokenBalance} */
            const tokenBalance = this.$defi.getFMintAccountCollateral(this.fMintAccount, _token);

            return this.$defi.fromTokenValue(tokenBalance.balance, _token) || 0;
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

            // if (this.collateral > 0) {
            if (this.deposit) {
                this.increasedCollateral = parseFloat(this.currCollateral);
            } else if (this.withdraw) {
                this.decreasedCollateral = parseFloat(this.currCollateral);
            } else {
                const collateralDiff = parseFloat(this.currCollateral) - this.collateral;

                if (collateralDiff > 0) {
                    this.increasedCollateral = collateralDiff;
                    this.message = '';
                } else if (collateralDiff < 0) {
                    this.decreasedCollateral = -collateralDiff;
                    this.message = '';
                }
            }
            // }
        },

        updateCurrCollateral() {
            if (!this.depositOrWithdraw) {
                this.currCollateral = this.collateral.toString();
            }
        },

        onSubmit() {
            const tokenBalance = this.$defi.getFMintAccountCollateral(this.fMintAccount, this.dToken);
            const params = {
                currCollateral: parseFloat(this.currCollateral),
                collateral: this.collateral,
                collateralHex: tokenBalance.balance,
                token: { ...this.dToken },
                steps: this.stepsCount,
                step: this.activeStep,
            };

            if (this.deposit) {
                params.currCollateral = this.collateral + parseFloat(this.currCollateral);
            } else if (this.withdraw) {
                params.currCollateral = this.collateral - parseFloat(this.currCollateral);
            }

            if (!this.submitDisabled) {
                this.changeComponent('defi-deposit-confirmation', {
                    params,
                    compName: 'defi-lock-unlock',
                    token: params.token,
                });
                this.$refs.confirmationWindow.show();

                /*
                this.$router.push({
                    name: this.onSubmitRoute,
                    params,
                });
                */
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
            this.currCollateral = '0';
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

        onCancelButtonClick() {
            this.currCollateral = '0';
            this.activeStep = 1;
            // toto by melo byt onwindowclose
            this.currentComponent = '';
            this.currentAppNodeId = '';

            this.init(true);

            this.$refs.confirmationWindow.hide();
            this.currentComponent = '';
        },

        /**
         * @param {Object} _data
         */
        onChangeComponent(_data) {
            const { data } = _data;

            if (data && data.params && data.params.step) {
                this.activeStep = data.params.step;
            } else if (data && data.continueTo === 'hide-window') {
                // last transaction success/reject message
                this.activeStep = 1000;
            }

            componentViewMixin.methods.onChangeComponent.call(this, _data);
        },

        formatNumberByLocale,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
