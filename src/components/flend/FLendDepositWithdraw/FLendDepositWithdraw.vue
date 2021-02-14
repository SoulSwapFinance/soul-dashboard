<template>
    <div class="flenddepositwithdraw view-defi">
        <div class="flenddepositwithdraw_body">
            <div>
                <div class="df-data-item smaller">
                    <h3 class="label">Available Balance</h3>
                    <div class="value">
                        <f-token-value :token="token" :value="availableBalance" />
                    </div>
                </div>
            </div>

            <div class="defi-price-input-col align-center">
                <div class="defi-price-input">
                    <div class="flenddepositwithdraw_tokenlabel">
                        <f-select-button
                            v-if="!singleToken"
                            collapsed
                            aria-label="pick a token"
                            @click.native="onTokenSelectorClick"
                        >
                            <f-crypto-symbol :token="token" />
                        </f-select-button>
                        <template v-else>
                            <f-crypto-symbol :token="token" />
                        </template>
                    </div>

                    <label :for="`text-input-${id}`" class="not-visible">{{ label }}</label>
                    <input
                        :id="`text-input-${id}`"
                        ref="input"
                        :value="inputValue"
                        :min="minAmount"
                        :max="maxAmount"
                        type="number"
                        step="any"
                        class="flenddepositwithdraw_input text-input no-style"
                        @change="onInput"
                    />

                    <div class="f-slider-wrap">
                        <f-slider
                            ref="slider"
                            v-model="currAmount"
                            step="any"
                            :min="minAmount.toString()"
                            :max="maxAmount.toString()"
                            :labels="sliderLabels"
                            clickable-labels
                            use-lower-fill-bar
                        >
                            <template #top="sProps">
                                <label :for="sProps.inputId" class="not-visible">{{ label }}</label>
                            </template>
                        </f-slider>
                    </div>
                </div>
            </div>

            <div class="flenddepositwithdraw_rightcol">
                <f-lend-health-factor />
            </div>
        </div>

        <div class="flenddepositwithdraw_footer">
            <div v-if="!submitDisabled" class="flenddepositwithdraw_messages">
                <f-lend-deposit-withdraw-message :token="token" :value="currAmount" :withdraw="withdraw" />
            </div>

            <div class="defi-buttons">
                <button class="btn large" :disabled="submitDisabled" @click="onSubmit">
                    Submit
                </button>
            </div>
        </div>

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
import FSlider from '@/components/core/FSlider/FSlider.vue';
import FSelectButton from '@/components/core/FSelectButton/FSelectButton.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
import { cloneObject, getUniqueId } from '@/utils';
import FLendHealthFactor from '@/components/flend/FLendHealthFactor/FLendHealthFactor.vue';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import { eventBusMixin } from '@/mixins/event-bus.js';
import { componentViewMixin } from '@/mixins/component-view.js';
import TxConfirmationWindow from '@/components/windows/TxConfirmationWindow/TxConfirmationWindow.vue';
import FViewTransition from '@/components/core/FViewTransition/FViewTransition.vue';
import FMessage from '@/components/core/FMessage/FMessage.vue';
import FLendDepositWithdrawConfirmation from '@/components/flend/FLendDepositWithdrawConfirmation/FLendDepositWithdrawConfirmation.vue';
import FLendDepositWithdrawMessage from '@/components/flend/FLendDepositWithdrawMessage/FLendDepositWithdrawMessage.vue';

export default {
    name: 'FLendDepositWithdraw',

    components: {
        FLendDepositWithdrawMessage,
        FMessage,
        FViewTransition,
        TxConfirmationWindow,
        FTokenValue,
        FLendHealthFactor,
        FCryptoSymbol,
        FSelectButton,
        FSlider,
        FLendDepositWithdrawConfirmation,
    },

    mixins: [eventBusMixin, componentViewMixin],

    props: {
        /** @type {FLendReserve} */
        reserve: {
            type: Object,
            default() {
                return {
                    erc20Info: {},
                };
            },
        },
        /** Mode with sindgle token - no token picker,... */
        singleToken: {
            type: Boolean,
            default: true,
        },
        /** Withdraw deposit. */
        withdraw: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            currAmount: '0',
            sliderLabels: ['0%', '25%', '50%', '75%', '100%'],

            id: getUniqueId(),
            label: 'Amount',
            stepsCount: 2,
            /** Active step (`<1, stepsCount>`) */
            activeStep: 1,
            viewsStructureRootNode: 'f-lend',
        };
    },

    computed: {
        inputValue() {
            return this.formatInputValue(this.currAmount);
        },

        availableBalance() {
            return 100;
        },

        minAmount() {
            return 0;
        },

        maxAmount() {
            return this.availableBalance;
        },

        currAmountF() {
            return parseFloat(this.currAmount);
        },

        submitDisabled() {
            return this.currAmountF === this.minAmount;
        },

        /**
         * ERC20 token
         *
         * @return {ERC20Token|*}
         */
        token() {
            return this.reserve.erc20Info;
        },

        tokenSymbol() {
            return this.$defi.getTokenSymbol(this.token);
        },
    },

    created() {
        this.init();

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        init() {},

        formatInputValue(_value) {
            return parseFloat(_value).toFixed(this.$defi.getTokenDecimals(this.token));
        },

        onInput(_event) {
            this.currAmount = this.$refs.slider.getCorrectValue(_event.target.value);
            _event.target.value = this.formatInputValue(this.currAmount);
        },

        onSubmit() {
            const params = {
                currAmount: this.currAmountF,
                stepsCount: this.stepsCount,
                activeStep: this.activeStep,
                withdraw: this.withdraw,
                compName: 'f-lend-deposit',
                reserve: cloneObject(this.reserve),
            };

            /*if (!this.withdraw) {
                params.currCollateral = this.collateral + parseFloat(this.currCollateral);
            } else if (this.withdraw) {
                params.currCollateral = this.collateral - parseFloat(this.currCollateral);
            }*/

            if (!this.submitDisabled) {
                this.changeComponent('f-lend-deposit-withdraw-confirmation', params);
                this.$refs.confirmationWindow.show();
            }
        },

        onCancelButtonClick() {
            this.currAmount = '0';
            this.activeStep = 1;
            this.currentAppNodeId = '';

            this.init();

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

        onTokenSelectorClick() {},

        onAccountPicked() {
            this.init();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
