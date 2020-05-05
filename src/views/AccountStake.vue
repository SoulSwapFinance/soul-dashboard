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
import StakeFTM from '../components/StakeFTM/StakeFTM.vue';
import StakeForm from '../components/forms/StakeForm.vue';

export default {
    components: { StakeForm, StakeFTM },

    data() {
        return {
            currentComponent: 'stake-f-t-m',
        };
    },

    computed: {
        currentComponentProperties() {
            switch (this.currentComponent) {
                case 'transaction-confirmation':
                    return {
                        txData: this._data_,
                    };
                case 'transaction-success-message':
                    return {
                        tx: this._data_,
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
            if (_data.to === 'stake-form') {
                this._data_ = _data.data;
            }

            this.currentComponent = _data.to;

            this.$nextTick(() => {
                this._data_ = null;
            });
        },
    },
};
</script>

<style lang="scss"></style>
