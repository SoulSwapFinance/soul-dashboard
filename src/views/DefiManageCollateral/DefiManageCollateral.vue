<template>
    <div class="view-defi-manage-collateral">
        <h1 class="">Manage collateral</h1>

        <h2 class="perex">
            Lock FTM to increase the collateral ratio and mint fUSD, unlock FTM after you repaid fUSD.
        </h2>

        <div class="grid">
            <div>
                <div class="df-data-item smaller">
                    <h3 class="label">Available balance</h3>
                    <div class="value">{{ availableFTM }} <span class="currency">FTM</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Locked balance</h3>
                    <div class="value">{{ collateral }} <span class="currency">FTM</span></div>
                </div>
                <div v-if="!mediumView" class="df-data-item smaller">
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
                        :min="minLocked"
                        :max="maxLocked"
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
                            :min="minLocked.toString()"
                            :max="maxLocked.toString()"
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
            <div class="align-right">
                <template v-if="false">
                    <h3>Minting limit</h3>
                    <f-circle-progress
                        show-percentage
                        :stroke-width="6"
                        :animate="false"
                        :colors="circleColors"
                        :value="90"
                    />
                </template>
                <div class="df-data-item">
                    <h3 class="no-margin">Max mintable</h3>
                    <div class="value">{{ maxMintable }} <span class="currency">fUSD</span></div>
                </div>
            </div>
            <f-message v-if="message" type="info" role="alert">
                {{ message }}
            </f-message>
            <f-message v-else-if="increasedCollateral > 0" type="info" role="alert">
                You’re adding <span class="inc-desc-collateral">{{ increasedCollateral.toFixed(2) }} FTM</span> to your
                collateral
            </f-message>
            <f-message v-else-if="decreasedCollateral > 0" type="info" role="alert">
                You’re removing <span class="inc-desc-collateral">{{ decreasedCollateral.toFixed(2) }} FTM</span> from
                your collateral
            </f-message>
        </div>

        <div class="buttons">
            <button class="btn large" :disabled="parseFloat(currCollateral) === parseFloat(collateral)">
                <template v-if="collateral > 0">Rebalance now</template>
                <template v-else>Add collateral</template>
            </button>
        </div>

        <div style="margin-top: 32px; opacity: 0.75;">
            <!--            {{ tmpValues }} <br />-->
            <button class="btn small light break-word" @click="onTest1BtnClick">
                Available balance: 10000, Locked balance: 0, Minted fUSD: 0
            </button>
            <br />
            <button class="btn small light break-word" @click="onTest2BtnClick">
                Available balance: 0, Locked balance: 4000, Minted fUSD: 0
            </button>
            <br />
            <button class="btn small light break-word" @click="onTest3BtnClick">
                Available balance: 10000, Locked balance: 5000, Minted fUSD: 0
            </button>
            <br />
        </div>
    </div>
</template>

<script>
import FCircleProgress from '../../components/core/FCircleProgress/FCircleProgress.vue';
import { filtersOptions, formatNumberByLocale } from '../../filters.js';
import { mapGetters } from 'vuex';
// import { toFTM } from '../../utils/transactions.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import FSlider from '../../components/core/FSlider/FSlider.vue';
import { getUniqueId } from '../../utils';

export default {
    name: 'DefiManageCollateral',

    components: { FSlider, FMessage, FCircleProgress },

    data() {
        return {
            currCollateral: '0',
            message: '',
            increasedCollateral: 0,
            decreasedCollateral: 0,
            label: 'tmp',
            tmpValues: {
                availableFTM: 10000,
                collateral: 0,
                debt: 0,
            },
            circleColors: [
                {
                    value: 23,
                    color: '#15cd72',
                },
                {
                    value: 40,
                    color: '#ffaf19',
                },
                {
                    value: 75,
                    color: '#ff1716',
                },
            ],
            id: getUniqueId(),
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

        availableFTM() {
            /*
            const available = this.currentAccount ? this.currentAccount.balance : 0;

            return parseFloat(toFTM(available));
            */

            return this.tmpValues.availableFTM;
        },

        currentPrice() {
            return formatNumberByLocale(this.tokenPrice, 5, filtersOptions.currency);
        },

        liquidationPrice() {
            return '-';
        },

        maxMintable() {
            return this.$defi.getMaxDebt(this.currCollateral, this.tokenPrice).toFixed(2);
        },

        minLocked() {
            return 0;
        },

        maxLocked() {
            return this.collateral + this.availableFTM;
        },

        inputValue() {
            return this.formatInputValue(this.currCollateral);
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
    },

    asyncComputed: {
        async tokenPrice() {
            return await this.$defi.getTokenPrice('USD');
        },
    },

    watch: {
        currCollateral(_value, _oldValue) {
            let cValue;

            console.log(_value, _oldValue);

            if (_value !== _oldValue) {
                cValue = this.$refs.slider.getCorrectValue(_value);

                if (cValue !== _value && cValue === this.maxLocked.toString()) {
                    this.currCollateral = cValue;
                    // this.$refs.input.select();
                }

                // const currCollateral = parseFloat(this.currCollateral);
                this.updateMessage();
            }
        },
    },

    created() {
        this.currCollateral = this.collateral.toString();
        this.updateMessage();
    },

    methods: {
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

        onInput(_event) {
            this.currCollateral = this.$refs.slider.getCorrectValue(_event.target.value);
            _event.target.value = this.formatInputValue(this.currCollateral);
        },

        onResetBtnClick() {
            this.updateCurrCollateral();
        },

        onTest1BtnClick() {
            this.tmpValues = {
                availableFTM: 10000,
                collateral: 0,
                debt: 0,
            };

            this.updateCurrCollateral();
            this.updateMessage();
        },

        onTest2BtnClick() {
            this.tmpValues = {
                availableFTM: 0,
                collateral: 4000,
                debt: 0,
            };

            this.updateCurrCollateral();
            this.updateMessage();
        },

        onTest3BtnClick() {
            this.tmpValues = {
                availableFTM: 10000,
                collateral: 5000,
                debt: 0,
            };

            this.updateCurrCollateral();
            this.updateMessage();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
