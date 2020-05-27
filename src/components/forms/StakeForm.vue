<template>
    <div class="stake-form account-main-content-mt">
        <f-card class="f-card-double-padding">
            <f-form ref="stakeForm" center-form @f-form-submit="onFormSubmit">
                <fieldset class="">
                    <legend class="h2">
                        Delegate FTM <span class="f-steps"><b>1</b> / 2</span>
                    </legend>

                    <div class="form-body">
                        <f-input
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
                            <template #bottom="sProps">
                                <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                    {{ amountErrMsg }}
                                </f-message>
                            </template>
                        </f-input>

                        <f-input
                            v-model="validator"
                            label="Validator"
                            field-size="large"
                            autocomplete="off"
                            name="validator"
                            readonly
                            class="validator-select"
                            :validator="checkValidator"
                            validate-on-input
                            @click.native="onSelectValidatorClick"
                            @keydown.native="onSelectValidatorKeyup"
                        >
                            <template #suffix>
                                <span class="btn same-size round small light">
                                    <icon data="@/assets/svg/chevron-down.svg" />
                                </span>
                            </template>
                            <template #bottom="sProps">
                                <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                    {{ validatorErrMsg }}
                                </f-message>
                            </template>
                        </f-input>

                        <div class="align-center form-buttons">
                            <a
                                href="#"
                                class="btn light large break-word"
                                style="max-width: 100%;"
                                aria-label="Go to previous form"
                                @click.prevent="onPreviousBtnClick"
                            >
                                Previous
                            </a>
                            <button type="submit" class="btn large break-word" style="max-width: 100%;">
                                Continue
                            </button>
                        </div>
                    </div>
                </fieldset>
            </f-form>
        </f-card>

        <validator-picker-window ref="validatorPickerWindow" @validator-selected="onValidatorSelected" />
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import FForm from '../core/FForm/FForm.vue';
import FMessage from '../core/FMessage/FMessage.vue';
import FInput from '../core/FInput/FInput.vue';
import ValidatorPickerWindow from '../windows/ValidatorPickerWindow.vue';
import { mapGetters } from 'vuex';
import { isAriaAction } from '../../utils/aria.js';
import sfcUtils from 'fantom-ledgerjs/src/sfc-utils.js';

// import { formatHexToInt } from '../../filters.js';
// import { WEIToFTM } from '../../utils/transactions.js';

export default {
    name: 'StakeForm',

    components: { ValidatorPickerWindow, FInput, FMessage, FForm, FCard },

    data() {
        return {
            amountErrMsg: 'Invalid amount',
            gasPrice: '',
            validator: 'Select a Validator',
            validatorErrMsg: 'Please select a validator',
            /** Info about selected validator. */
            validatorInfo: {
                address: '',
                id: '',
                name: '',
            },
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        /**
         * @return {number}
         */
        remainingBalance() {
            const { currentAccount } = this;
            let price = 0;

            if (this.gasPrice && currentAccount) {
                price = this.$fWallet.getRemainingBalance(currentAccount.balance, this.gasPrice);
            }

            return price;
        },
    },

    created() {
        this.$fWallet.getGasPrice().then((_gasPrice) => {
            this.gasPrice = _gasPrice;
        });
    },

    methods: {
        /**
         * Validator for `amount` input field.
         *
         * @param {String} _value
         * @return {Boolean}
         */
        checkAmount(_value) {
            const remainingBalance = parseFloat(this.remainingBalance);
            const value = parseFloat(_value);
            let ok = false;

            this.amountErrMsg = 'Invalid amount';

            // await this.$fWallet.getStakerById(accountInfo.stakerIdHex)

            if (!isNaN(value)) {
                if (value <= remainingBalance && value >= 1) {
                    ok = true;
                } else if (remainingBalance < 0) {
                    this.amountErrMsg = `You have no balance left`;
                } else if (value > 0 && value < 1) {
                    this.amountErrMsg = `You can't stake amount less than 1 FTM`;
                } else if (value >= 1) {
                    this.amountErrMsg = `You can stake max ${remainingBalance} FTM`;
                }
            }

            if (ok && this.validatorInfo.delegatedLimit) {
                const delegatedLimit = parseFloat(this.$fWallet.WEIToFTM(this.validatorInfo.delegatedLimit));

                if (value > delegatedLimit) {
                    this.amountErrMsg =
                        `Staking limit reached. You can stake max ${delegatedLimit} FTM on validator ` + this.validator;
                    ok = false;
                }
            }

            return ok;
        },

        /**
         * Validator for `validator` input field.
         *
         * @return {Boolean}
         */
        checkValidator() {
            return !!this.validatorInfo.address;
        },

        /**
         * Update validator info with the newest data.
         *
         * @return {Promise<void>}
         */
        async updateValidatorInfo() {
            const validatorInfo = await this.$fWallet.getStakerById(this.validatorInfo.id);

            this.validatorInfo = {
                ...this.validatorInfo,
                ...validatorInfo,
            };
        },

        /**
         * Get transaction object for staking and change view to `StakeConfirmation`.
         *
         * @param {Number} _amount Amount of FTM to stake.
         * @return {Promise<void>}
         */
        async stakeCofirmation(_amount) {
            const amount = parseFloat(_amount);
            const tx = await this.$fWallet.getSFCTransactionToSign(
                sfcUtils.createDelegationTx(amount, parseInt(this.validatorInfo.id, 16)),
                this.currentAccount.address,
                '0x30D40'
            );

            this.$emit('change-component', {
                to: 'stake-confirmation',
                from: 'stake-form',
                data: {
                    amount: amount,
                    ...this.validatorInfo,
                    tx,
                },
            });
        },

        onValidatorSelected(_validatorInfo) {
            this.validator = `${_validatorInfo.name}, ${parseInt(_validatorInfo.id, 16)}`;
            this.validatorInfo = { ..._validatorInfo };
            this.updateValidatorInfo().then(() => {
                this.$refs.stakeForm.checkValidity();
            });
        },

        onSelectValidatorClick() {
            this.$refs.validatorPickerWindow.show();
        },

        onSelectValidatorKeyup(_event) {
            if (isAriaAction(_event)) {
                this.$refs.validatorPickerWindow.show();
            }
        },

        onPreviousBtnClick() {
            this.$emit('change-component', {
                to: 'staking-info',
                from: 'stake-form',
            });
        },

        async onFormSubmit(_event) {
            const { data } = _event.detail;

            this.updateValidatorInfo().then(() => {
                if (this.$refs.stakeForm.checkValidity()) {
                    this.stakeCofirmation(parseFloat(data.amount));
                }
            });
        },
    },
};
</script>

<style lang="scss">
.validator-select,
.validator-select > *,
.validator-select input {
    cursor: pointer !important;
}
</style>
