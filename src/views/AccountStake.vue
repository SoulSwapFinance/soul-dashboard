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

export default {
    components: { TransactionSuccessMessage, TransactionRejectMessage, StakeConfirmation, StakeForm, StakingInfo },

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
                case 'transaction-success-message':
                    return {
                        tx: this._data_.tx,
                        title: 'Delegation Successful',
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
