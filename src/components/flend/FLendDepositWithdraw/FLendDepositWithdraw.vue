<template>
    <div class="flenddepositwithdraw view-defi">
        <div class="flenddepositwithdraw_body">
            <div>
                <div class="df-data-item smaller">
                    <h3 class="label">Available Balance</h3>
                    <div class="value">
                        <f-placeholder :content-loaded="loaded" :replacement-num-chars="9">
                            <f-token-value :token="asset" :value="availableBalance" />
                        </f-placeholder>
                    </div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Deposited</h3>
                    <div class="value">
                        <f-placeholder :content-loaded="loaded" :replacement-num-chars="9">
                            <f-token-value :token="asset" :value="deposited" />
                        </f-placeholder>
                    </div>
                </div>
            </div>

            <div class="defi-price-input-col align-center">
                <div class="defi-price-input">
                    <div class="flenddepositwithdraw_tokenlabel">
                        <f-select-button
                            v-if="!singleAsset"
                            collapsed
                            aria-label="pick an asset"
                            @click.native="onTokenSelectorClick"
                        >
                            <f-crypto-symbol :token="asset" />
                        </f-select-button>
                        <template v-else>
                            <f-crypto-symbol :token="asset" />
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
            <div v-if="!submitDisabled || availableBalance === 0" class="flenddepositwithdraw_messages">
                <f-message v-if="availableBalance === 0 && loaded" type="info" role="alert" class="big">
                    Your balance of {{ assetSymbol }} is 0. Transfer {{ assetSymbol }} to your wallet to be able to
                    deposit
                </f-message>
                <f-lend-deposit-withdraw-message
                    v-if="!submitDisabled"
                    :token="asset"
                    :value="currAmount"
                    :withdraw="withdraw"
                />
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
import { mapGetters } from 'vuex';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import TransactionSuccessMessage from '@/components/TransactionSuccessMessage/TransactionSuccessMessage.vue';
import { toHex } from '@/utils/bignumber.js';

export default {
    name: 'FLendDepositWithdraw',

    components: {
        FPlaceholder,
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
        TransactionSuccessMessage,
    },

    mixins: [eventBusMixin, componentViewMixin],

    props: {
        /** @type {FLendReserve} */
        reserve: {
            type: Object,
            default() {
                return {
                    asset: {},
                };
            },
        },
        /** Mode with single asset - no asset picker,... */
        singleAsset: {
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

            availableBalance: 0,
            deposited: 0,
            healthFactor: 0,
            userTokenBalance: '',
            userDeposit: '',

            dataSet: false,
            id: getUniqueId(),
            label: 'Amount',
            stepsCount: 2,
            /** Active step (`<1, stepsCount>`) */
            activeStep: 1,
            viewsStructureRootNode: 'f-lend',
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        inputValue() {
            return this.formatInputValue(this.currAmount);
        },

        minAmount() {
            return 0;
        },

        maxAmount() {
            return this.withdraw ? this.deposited : this.availableBalance;
        },

        currAmountF() {
            return parseFloat(this.currAmount);
        },

        submitDisabled() {
            return this.currAmountF === this.minAmount || !this.loaded;
        },

        /**
         * Defi token
         *
         * @return {DefiToken|*}
         */
        asset() {
            return this.reserve.asset;
        },

        assetSymbol() {
            return this.$defi.getTokenSymbol(this.asset);
        },

        loaded() {
            return this.reserve.ID !== undefined && this.dataSet;
        },
    },

    watch: {
        reserve: {
            immediate: true,
            handler() {
                this.setData();
            },
        },
    },

    created() {
        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        async setData() {
            /** @type {FLendReserve} */
            const reserve = this.reserve;

            if (!('ID' in reserve)) {
                return;
            }

            this.dataSet = false;

            /** @type {FLendUserOverview} */
            const userOverview = await this.$flend.getUserOverview(this.currentAccount.address, reserve, {
                borrow: false,
            });

            this.userTokenBalance = toHex(userOverview.bBalance);
            this.userDeposit = toHex(userOverview.bDeposited);

            this.availableBalance = userOverview.balance;
            this.deposited = userOverview.deposited;
            // this.healthFactor = userOverview.bHealthFactor.toNumber();

            this.dataSet = true;
        },

        formatInputValue(_value) {
            return parseFloat(_value).toFixed(this.$defi.getTokenDecimals(this.asset));
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
                userTokenBalance: this.userTokenBalance,
                userDeposit: this.userDeposit,
                withdraw: this.withdraw,
                maxAmount: this.currAmountF === this.maxAmount,
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

        /**
         * Called when tx window's cancel button was clicked
         */
        onCancelButtonClick() {
            this.currAmount = '0';
            this.activeStep = 1;
            this.currentAppNodeId = '';

            // this.setData();

            this.$refs.confirmationWindow.hide();
            this.currentComponent = '';

            this.$emit('cancel-button-click');
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
            this.setData();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
