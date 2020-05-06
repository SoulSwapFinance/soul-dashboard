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
import StakingInfo from '../components/StakingInfo/StakingInfo.vue';
import StakeForm from '../components/forms/StakeForm.vue';
import StakeConfirmation from '../components/StakeConfirmation/StakeConfirmation.vue';
import TransactionSuccessMessage from '../components/TransactionSuccessMessage/TransactionSuccessMessage.vue';
import TransactionRejectMessage from '../components/TransactionRejectMessage/TransactionRejectMessage.vue';
import UnstakeFTM from '../components/UnstakeFTM/UnstakeFTM.vue';
import UnstakeConfirmation from '../components/UnstakeConfirmation/UnstakeConfirmation.vue';

export default {
    components: {
        UnstakeFTM,
        TransactionSuccessMessage,
        TransactionRejectMessage,
        StakeConfirmation,
        StakeForm,
        StakingInfo,
        UnstakeConfirmation,
    },

    data() {
        return {
            currentComponent: 'staking-info',
        };
    },

    computed: {
        currentComponentProperties() {
            switch (this.currentComponent) {
                case 'stake-confirmation':
                    return {
                        stakeData: this._data_,
                    };
                case 'unstake-f-t-m':
                case 'unstake-confirmation':
                    return {
                        accountInfo: this._data_.accountInfo,
                    };
                case 'transaction-success-message':
                    return {
                        tx: this._data_.tx,
                        title: this._data_.successMessage,
                    };
                default:
                    return null;
            }
        },
    },

    created() {
        // temporary data
        this._data_ = null;
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
    },
};
</script>

<style lang="scss"></style>
