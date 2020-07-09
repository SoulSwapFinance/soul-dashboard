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
                    <div class="value">{{ lockedFTM }} <span class="currency">FTM</span></div>
                </div>
                <div v-if="!mediumView" class="df-data-item smaller">
                    <h3 class="label">Minted fUSD</h3>
                    <div class="value">{{ mintedFUSD }} <span class="currency">fUSD</span></div>
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
                            v-model="currLocked"
                            step="any"
                            :min="minLocked.toString()"
                            :max="maxLocked.toString()"
                            use-lower-fill-bar
                        >
                            <template #top="sProps">
                                <label :for="sProps.inputId" class="not-visible">{{ label }}</label>
                            </template>
                        </f-slider>
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
            <f-message v-if="showErrorMsg" type="info" role="alert">
                Deposit more FTM to increase your collateral
            </f-message>
        </div>

        <div class="buttons">
            <button class="btn large" disabled>Rebalance now</button>
        </div>
    </div>
</template>

<script>
import FCircleProgress from '../../components/core/FCircleProgress/FCircleProgress.vue';
import { filtersOptions, formatNumberByLocale } from '../../filters.js';
import { mapGetters } from 'vuex';
import { toFTM } from '../../utils/transactions.js';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import FSlider from '../../components/core/FSlider/FSlider.vue';
import { getUniqueId } from '../../utils';

export default {
    name: 'DefiManageCollateral',

    components: { FSlider, FMessage, FCircleProgress },

    data() {
        return {
            showErrorMsg: true,
            currLocked: '0',
            label: 'tmp',
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

        mintedFUSD() {
            return 0;
        },

        lockedFTM() {
            return 0;
        },

        availableFTM() {
            const available = this.currentAccount ? this.currentAccount.balance : 0;

            // return '200,743';
            return toFTM(available);
        },

        currentPrice() {
            return formatNumberByLocale(this.tokenPrice, 5, filtersOptions.currency);
        },

        liquidationPrice() {
            return '-';
        },

        maxMintable() {
            return 0;
        },

        tokenPrice() {
            return this.$store.state.tokenPrice;
        },

        minLocked() {
            return 0;
        },

        maxLocked() {
            return this.lockedFTM + this.availableFTM;
        },

        inputValue() {
            return this.formatInputValue(this.currLocked);
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

    watch: {
        currLocked(_value, _oldValue) {
            let cValue;

            if (_value !== _oldValue) {
                cValue = this.$refs.slider.getCorrectValue(_value);

                if (cValue !== _value && cValue === this.maxLocked.toString()) {
                    this.currLocked = cValue;
                    // this.$refs.input.select();
                }

                console.log(cValue, parseFloat(this.currLocked));
            }
        },
    },

    created() {
        this.currLocked = this.minLocked.toString();
    },

    methods: {
        formatInputValue(_value) {
            return parseFloat(_value).toFixed(2);
        },

        onInput(_event) {
            this.currLocked = this.$refs.slider.getCorrectValue(_event.target.value);
            _event.target.value = this.formatInputValue(this.currLocked);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
