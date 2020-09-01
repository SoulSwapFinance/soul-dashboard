<template>
    <div class="view-account-stake account-main-content-mt">
        <keep-alive>
            <component
                :is="currentComponent"
                v-bind="currentComponentProperties"
                @change-component="onChangeComponent"
            ></component>
        </keep-alive>
    </div>
</template>

<script>
import DelegationsInfo from '@/components/DelegationsInfo/DelegationsInfo.vue';
import StakingInfo from '../components/StakingInfo/StakingInfo.vue';
import StakeForm from '../components/forms/StakeForm.vue';
import StakeConfirmation from '../components/StakeConfirmation/StakeConfirmation.vue';
import TransactionSuccessMessage from '../components/TransactionSuccessMessage/TransactionSuccessMessage.vue';
import TransactionRejectMessage from '../components/TransactionRejectMessage/TransactionRejectMessage.vue';
import UnstakeFTM from '../components/UnstakeFTM/UnstakeFTM.vue';
import UnstakeConfirmation from '../components/UnstakeConfirmation/UnstakeConfirmation.vue';
import ClaimRewardsConfirmation from '../components/ClaimRewardsConfirmation/ClaimRewardsConfirmation.vue';
import WithdrawFTMConfirmation from '../components/WithdrawFTMConfirmation/WithdrawFTMConfirmation.vue';
import UnstashConfirmation from '../components/UnstashConfirmation/UnstashConfirmation.vue';
import { eventBusMixin } from '../mixins/event-bus.js';

const DEFAULT_COMPONENT = 'delegations-info';

export default {
    components: {
        UnstakeFTM,
        TransactionSuccessMessage,
        TransactionRejectMessage,
        StakeConfirmation,
        StakeForm,
        DelegationsInfo,
        StakingInfo,
        UnstakeConfirmation,
        ClaimRewardsConfirmation,
        WithdrawFTMConfirmation,
        UnstashConfirmation,
    },

    mixins: [eventBusMixin],

    data() {
        return {
            currentComponent: DEFAULT_COMPONENT,
        };
    },

    computed: {
        currentComponentProperties() {
            switch (this.currentComponent) {
                case 'stake-form':
                    return this._data_;
                case 'stake-confirmation':
                    return {
                        stakeData: this._data_,
                        increaseDelegation: this._data_.increaseDelegation,
                        stakerInfo: this._data_.stakerInfo,
                        previousComponent: this._data_.previousComponent,
                    };
                case 'unstake-f-t-m':
                case 'unstake-confirmation':
                case 'claim-rewards-confirmation':
                    return {
                        accountInfo: this._data_.accountInfo,
                        amount: this._data_.amount,
                        undelegateMax: this._data_.undelegateMax,
                    };
                case 'transaction-success-message':
                    return {
                        tx: this._data_.tx,
                        title: this._data_.successMessage,
                        continueTo: this._data_.continueTo,
                    };
                case 'withdraw-f-t-m-confirmation':
                case 'unstash-confirmation':
                    return this._data_;
                default:
                    return null;
            }
        },
    },

    created() {
        // temporary data
        this._data_ = null;

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        /**
         * @param {Object} _data
         */
        onChangeComponent(_data) {
            this._data_ = _data.data;
            this.currentComponent = _data.to;

            this.$nextTick(() => {
                this._data_ = null;
            });
        },

        onAccountPicked() {
            this.currentComponent = '';
            this.$nextTick(() => {
                this.currentComponent = DEFAULT_COMPONENT;
            });
        },
    },
};
</script>
