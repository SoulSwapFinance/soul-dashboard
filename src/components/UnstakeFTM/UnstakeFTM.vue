<template>
    <div class="unstake-ftm">
        <f-card class="f-card-double-padding f-data-layout">
            <f-form ref="form" center-form @f-form-submit="onFormSubmit">
                <legend class="h2">
                    <div class="cont-with-back-btn">
                        <span>
                            Undelegate FTM <span class="f-steps"><b>1</b> / 2</span>
                        </span>
                        <button type="button" class="btn light" @click="onPreviousBtnClick">Back</button>
                    </div>
                </legend>

                <div class="form-body">
                    <h3>The withdrawal of your delegated tokens will take 7 days</h3>
                    <h3 v-if="isLocked" class="orange-color" style="padding-top: 0;">
                        Your delegation is still locked. You will lose part of your rewards by undelegating before the
                        lock expiration.
                    </h3>

                    <f-input
                        v-model="amount"
                        label="Amount"
                        field-size="large"
                        type="number"
                        autocomplete="off"
                        min="1"
                        step="any"
                        name="amount"
                        :validator="checkAmount"
                        validate-on-input
                    >
                        <template #top="sProps">
                            <div class="input-label-layout">
                                <label :for="sProps.inputId">{{ sProps.label }}</label>
                                <button type="button" class="btn light small" @click="onEntireDelegationClick">
                                    Entire Delegation
                                </button>
                            </div>
                        </template>
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                {{ amountErrMsg }}
                            </f-message>
                        </template>
                    </f-input>

                    <div class="form-buttons align-center">
                        <button type="submit" class="btn large" :class="{ 'orange-btn': orangeBtn }">
                            Ok, undelegate
                        </button>
                    </div>
                </div>
            </f-form>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import FForm from '../core/FForm/FForm.vue';
import FInput from '../core/FInput/FInput.vue';
import FMessage from '../core/FMessage/FMessage.vue';
import { WEIToFTM } from '../../utils/transactions.js';
export default {
    name: 'UnstakeFTM',

    components: { FMessage, FInput, FForm, FCard },

    props: {
        /** `accountInfo` object from `StakingInfo` component. */
        accountInfo: {
            type: Object,
            default() {
                return {};
            },
        },
        /***/
        stakerId: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            amountErrMsg: '',
            amount: '',
        };
    },

    computed: {
        undelegateMax() {
            return this.accountInfo
                ? WEIToFTM(this.accountInfo.delegation.amount) - this.accountInfo.withdrawRequestsAmount
                : 0;
        },

        /**
         * Returns `true` if delegetion is still locked.
         *
         * @return {boolean}
         */
        isLocked() {
            const { accountInfo } = this;
            const lockedUntilTS =
                accountInfo && accountInfo.delegation && accountInfo.delegation.lockedUntil
                    ? parseInt(accountInfo.delegation.lockedUntil, 16)
                    : 0;
            const now = new Date().getTime() / 1000;

            return lockedUntilTS > now;
        },

        /**
         * Color of 'Undelegate' button.
         *
         * @return {boolean}
         */
        orangeBtn() {
            return this.isLocked;
        },
    },

    created() {
        this.setMaxUndelegation();
    },

    methods: {
        checkAmount(_value) {
            const value = parseFloat(_value);
            const { undelegateMax } = this;
            let ok = false;

            this.amountErrMsg = `You can undelegate min 1 FTM and max ${undelegateMax} FTM`;

            if (!isNaN(value)) {
                if (value >= 1 && value <= undelegateMax) {
                    ok = true;
                }
            }

            return ok;
        },

        onPreviousBtnClick() {
            this.$emit('change-component', {
                to: 'staking-info',
                from: 'unstake-f-t-m',
                data: {
                    stakerId: this.stakerId,
                },
            });
        },

        onFormSubmit(_event) {
            const amount = parseFloat(_event.detail.data.amount);

            this.$emit('change-component', {
                to: 'unstake-confirmation',
                from: 'unstake-f-t-m',
                data: {
                    accountInfo: this.accountInfo,
                    amount,
                    undelegateMax: amount === this.undelegateMax,
                    stakerId: this.stakerId,
                },
            });
        },

        setMaxUndelegation() {
            this.amount = this.undelegateMax.toString();
        },

        onEntireDelegationClick() {
            this.setMaxUndelegation();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
