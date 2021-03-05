<template>
    <div class="funiswapsettings">
        <f-card class="f-card-double-padding">
            <f-form ref="form" center-form @f-form-change="onFormChange">
                <div class="form-body">
                    <f-input
                        name="funiswap_slippage_tolerance"
                        :value="$store.state.fUniswapSlippageTolerance.toString()"
                        label="Slippage Tolerance"
                        type="number"
                        min="0.1"
                        max="100"
                        step="0.1"
                        field-size="large"
                        validate-on-input
                        :validator="checkFUniswapSlippageTolerance"
                    >
                        <template #top="sProps">
                            <div class="input-label-layout">
                                <label :for="sProps.inputId">{{ sProps.label }}</label>
                                <f-info window-closeable window-class="light" style="margin-left: 8px;">
                                    Your transaction in fUNI will revert if the price changes unfavorable by more than
                                    this percentage.
                                </f-info>
                            </div>
                        </template>
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                Value must be between 0.1% and 100%
                            </f-message>
                        </template>
                    </f-input>
                </div>
            </f-form>
        </f-card>
    </div>
</template>

<script>
import FCard from '@/components/core/FCard/FCard.vue';
import FInput from '@/components/core/FInput/FInput.vue';
import FMessage from '@/components/core/FMessage/FMessage.vue';
import FInfo from '@/components/core/FInfo/FInfo.vue';
import FForm from '@/components/core/FForm/FForm.vue';

export default {
    name: 'FUniswapSettings',

    components: { FForm, FInfo, FMessage, FInput, FCard },

    methods: {
        /**
         * @param {string} _value
         * @return {boolean}
         */
        checkFUniswapSlippageTolerance(_value) {
            let ok = false;
            const value = parseFloat(_value);

            if (!isNaN(value)) {
                ok = value >= 0.1 && value <= 100;
            }

            return ok;
        },

        onFormChange(_event) {
            const { detail } = _event;
            const appNode = this.$root.$children[0];

            if (detail.eTarget.name === 'funiswap_slippage_tolerance') {
                if (appNode && this.checkFUniswapSlippageTolerance(detail.value)) {
                    appNode.setFUniswapSlippageTolerance(parseFloat(detail.value));
                }
            }
        },
    },
};
</script>
