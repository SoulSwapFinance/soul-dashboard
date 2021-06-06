<template>
    <div class="delegation-lock">
        <f-card class="f-card-double-padding f-data-layout">
            <h2 class="align-left cont-with-back-btn">
                <span>
                    Lock Delegation <span v-if="canLockDelegation" class="f-steps"><b>1</b> / 2</span>
                </span>
                <button type="button" class="btn light" @click="onPreviousBtnClick">Back</button>
            </h2>

            <div class="delegation-lock-body">
                <f-placeholder :content-loaded="canLockDelegation" block style="min-height: 200px;">
                    <div class="defi-price-input">
                        <f-auto-resize-input ref="lockDaysInputAR" min-width="48px">
                            <input
                                :id="`lock-days-${id}`"
                                ref="lockDaysInput"
                                :value="lockDaysInputValue"
                                type="number"
                                placeholder="0"
                                step="1"
                                :min="minLockDays"
                                :max="maxLockDays"
                                class="text-input no-style"
                                @change="onLockDaysInputChange"
                                @input="onLockDaysInputInput"
                                @focus="onLockDaysInputFocus"
                                @keydown="onLockDaysInputKeydown"
                            />
                        </f-auto-resize-input>
                        <label :for="`lock-days-${id}`" class="days-label">days</label>
                    </div>

                    <div class="f-slider-wrap">
                        <f-slider
                            ref="slider"
                            v-model="lockDaysValue"
                            step="1"
                            :min="minLockDays.toString()"
                            :max="maxLockDays.toString()"
                            use-lower-fill-bar
                            clickable-labels
                            :labels="sliderLabels"
                        >
                            <template #top="sProps">
                                <label :for="sProps.inputId" class="not-visible">slider label</label>
                            </template>
                        </f-slider>
                    </div>

                    <!--                    <f-input
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
                    </f-input>-->
                </f-placeholder>
                <template v-if="canLockDelegation">
                    <!--                    <h3>Description</h3>-->
                </template>

                <f-message v-if="lockedUntilDate" type="info" role="alert" class="big">
                    Delegation will be locked until <b>{{ lockedUntilDate }}</b>
                </f-message>
                <f-message v-if="message" type="info" role="alert" class="big">
                    {{ message }}
                </f-message>

                <div class="form-buttons align-center">
                    <button
                        type="submit"
                        class="btn large"
                        :disabled="!canLockDelegation || !valueIsCorrect || !!amountErrMsg"
                        @click="onSubmit"
                    >
                        Ok, lock
                    </button>
                </div>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '@/components/core/FCard/FCard.vue';
import gql from 'graphql-tag';
import { mapGetters, mapState } from 'vuex';
import FMessage from '@/components/core/FMessage/FMessage.vue';
import FAutoResizeInput from '@/components/core/FAutoResizeInput/FAutoResizeInput.vue';
import { getUniqueId } from '@/utils';
import FSlider from '@/components/core/FSlider/FSlider.vue';
import { formatDate, timestampToDate } from '@/filters.js';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import appConfig from '../../../app.config.js';

/** Day in seconds. */
const dayS = 86400;
/** Minimal lock duration in days. */
// const minDays = 14;
/** Estimated time of block in seconds. */
// const blockTime = 15 * 60;

export default {
    name: 'DelegationLock',

    components: { FPlaceholder, FSlider, FAutoResizeInput, FMessage, FCard },

    props: {
        /***/
        stakerId: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            delegation: null,
            validator: null,
            message: '',
            lockedUntilDate: '',
            lockDaysValue: '',
            lockDaysInputValue: '',
            minLock: 0,
            // minLock: minDays * dayS,
            amount: '',
            amountDelegated: 0,
            amountErrMsg: '',
            // sliderLabels: ['', ''],
            id: getUniqueId(),
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        ...mapState(['breakpoints']),

        /**
         * @return {number}
         */
        minLockDays() {
            // tmp
            // const lockedUntil = this.delegation ? parseInt(this.validator.lockedUntil, 16) - dayS * 5 - this.now() : 0;

            return Math.max(this.minDays, Math.floor((this.delegationLockedUntil - this.now()) / dayS) + 1);
        },

        minDays() {
            return Math.round(this.minLock / dayS);
        },

        /**
         * @return {number}
         */
        maxLockDays() {
            return Math.floor((this.validatorLockedUntil - this.now()) / dayS);
        },

        /**
         * @return {boolean}
         */
        canLockDelegation() {
            return this.validatorLockedUntil - this.now() > this.minLock && this.minLockDays < this.maxLockDays;
        },

        /**
         * @return {boolean}
         */
        valueIsCorrect() {
            return this.lockDaysInputValue === this.correctLockDaysInputValue(this.lockDaysInputValue);
        },

        /**
         * @return {number} Timestamp.
         */
        validatorLockedUntil() {
            return this.validator ? parseInt(this.validator.lockedUntil, 16) : 0;
        },

        /**
         * @return {number} Timestamp.
         */
        delegationLockedUntil() {
            return this.delegation ? parseInt(this.delegation.lockedUntil, 16) : 0;
        },

        /**
         * @return {[string, string]}
         */
        sliderLabels() {
            return [`${this.minLockDays} days`, `${this.maxLockDays} days`];
        },
    },

    watch: {
        lockDaysValue(_value, _oldValue) {
            if (_value !== _oldValue) {
                this.lockDaysInputValue = parseFloat(_value);
                this.updateARInput();
                this.updateLockDaysInputColor(this.lockDaysInputValue);
                this.updateMessage();
            }
        },

        lockDaysInputValue(_value, _oldValue) {
            if (_value !== _oldValue) {
                this.lockDaysValue = _value.toString();
            }
        },

        breakpoints() {
            this.updateARInput();
        },
    },

    created() {
        this.init();
    },

    mounted() {
        // this.sliderLabels = [`${this.minLockDays} days`, `${this.maxLockDays} days`];
    },

    methods: {
        async init() {
            // fetch and set delegation and validator
            const data = await Promise.all([
                this.fetchDelegation(this.stakerId),
                this.$fWallet.getStakerById(this.stakerId),
            ]);
            const sfcConfig = await this.$fWallet.getSFCConfig();

            this.minLock = sfcConfig.minLockupDuration.num;

            this.delegation = data[0];
            this.validator = data[1];

            this.amountDelegated = parseFloat(this.$fWallet.WEIToFTM(this.delegation.amountDelegated));
            this.amount = this.amountDelegated.toString(10);

            this.lockDaysValue = this.minLockDays.toString();
            this.lockDaysInputValue = this.lockDaysValue;

            this.updateMessage();

            this.$nextTick(() => {
                this.updateARInput();
            });
            // console.log('delegation', this.delegation, this.validator);
        },

        /**
         * Validator for `amount` input field.
         *
         * @param {String} _value
         * @return {Boolean}
         */
        checkAmount(_value) {
            const { amountDelegated } = this;
            const value = parseFloat(_value);
            let ok = false;

            this.amountErrMsg = 'Invalid amount';

            if (!isNaN(value)) {
                if (value <= amountDelegated && value >= 1) {
                    ok = true;
                } else if (value > 0 && value < 1) {
                    this.amountErrMsg = `You can't lock amount less than 1 FTM`;
                } else if (value >= 1) {
                    this.amountErrMsg = `You can lock max ${amountDelegated} FTM`;
                }
            }

            if (ok) {
                this.amountErrMsg = '';
            }

            return ok;
        },

        updateMessage() {
            this.message = '';
            this.lockedUntilDate = '';

            if (!this.canLockDelegation) {
                if (this.minLockDays >= this.maxLockDays && this.maxLockDays > 0) {
                    this.message = 'You have reached maximum days to lock delegation.';
                } else {
                    this.message = `Validator doesn't lock delegations or lock time is less than ${this.minDays} days.`;
                }
            } else if (this.valueIsCorrect) {
                this.lockedUntilDate = this.lockedUntil();
            }
        },

        updateARInput() {
            const eInput = this.$refs.lockDaysInputAR;

            if (eInput) {
                this.$nextTick(() => {
                    eInput.update();
                });
            }
        },

        /**
         * Get current timestamp in seconds.
         *
         * @return {number}
         */
        now() {
            return Math.floor(new Date().getTime() / 1000);
        },

        /**
         * Fetch delegation by staker id and current account address.
         *
         * @param {string} _stakerId
         */
        async fetchDelegation(_stakerId) {
            const data = await this.$apollo.query({
                query: gql`
                    query Delegation($address: Address!, $staker: BigInt!) {
                        delegation(address: $address, staker: $staker) {
                            isDelegationLocked
                            lockedFromEpoch
                            lockedUntil
                            amount
                            amountDelegated
                            amountInWithdraw
                            claimedReward
                        }
                    }
                `,
                variables: {
                    address: this.currentAccount.address,
                    staker: _stakerId,
                },
                fetchPolicy: 'network-only',
            });

            return data.data.delegation;
        },

        /**
         * @return {string} Formatted date.
         */
        lockedUntil() {
            const lds = this.lockDaysInputValue * dayS;

            return formatDate(timestampToDate(this.now() + lds));
        },

        /**
         * @param {number} _value
         */
        updateLockDaysInputColor(_value) {
            const eInput = this.$refs.lockDaysInput;

            if (eInput) {
                if (_value !== this.correctLockDaysInputValue(_value)) {
                    eInput.classList.add('invalid');
                } else {
                    eInput.classList.remove('invalid');
                }
            }
        },

        /**
         * @param {number} _value
         */
        correctLockDaysInputValue(_value) {
            return Math.min(Math.max(_value, this.minLockDays), this.maxLockDays);
        },

        onSubmit() {
            // const amount = parseFloat(this.amount);
            const amountDelegated = parseFloat(this.amountDelegated);
            let lockDuration = 0;

            if (this.canLockDelegation && this.valueIsCorrect) {
                if (this.lockDaysInputValue === this.maxLockDays) {
                    lockDuration = this.validatorLockedUntil - this.now();
                } else {
                    lockDuration = this.lockDaysInputValue * dayS;
                }

                lockDuration -= 7200;

                if (appConfig.useTestnet && this.lockDaysInputValue === 14) {
                    lockDuration = 10 * 60 + 5;
                }

                this.$emit('change-component', {
                    to: 'delegation-lock-confirmation',
                    from: 'delegation-lock',
                    data: {
                        stakerId: this.stakerId,
                        lockDuration,
                        amount: amountDelegated,
                        amountHex: this.delegation.amountDelegated,
                        // amountDelegated: this.delegation.amountDelegated,
                        // max: amount >= this.amountDelegated,
                    },
                });
            }
        },

        onPreviousBtnClick() {
            this.$emit('change-component', {
                to: 'staking-info',
                from: 'delegation-lock',
                data: {
                    stakerId: this.stakerId,
                },
            });
        },

        /**
         * @param {InputEvent} _event
         */
        onLockDaysInputChange(_event) {
            this.lockDaysInputValue = 0;
            this.lockDaysInputValue = this.correctLockDaysInputValue(_event.target.value);
            this.updateLockDaysInputColor(this.lockDaysInputValue);
            this.updateMessage();
        },

        /**
         * @param {InputEvent} _event
         */
        onLockDaysInputInput(_event) {
            this.updateLockDaysInputColor(parseFloat(_event.target.value));
        },

        /**
         * @param {InputEvent} _event
         */
        onLockDaysInputFocus(_event) {
            _event.target.select();
        },

        /**
         * Prevent typing '+' or '-'.
         * @param {KeyboardEvent} _event
         */
        onLockDaysInputKeydown(_event) {
            if (_event.key === '+' || _event.key === '-') {
                _event.preventDefault();
            }
        },

        onEntireDelegationClick() {
            this.amount = this.amountDelegated.toString();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
