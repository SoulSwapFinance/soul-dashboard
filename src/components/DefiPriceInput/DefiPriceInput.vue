<template>
    <div class="defi-price-input">
        <label :for="`text-input-${id}`" class="not-visible">{{ label }}</label>
        <input
            :id="`text-input-${id}`"
            ref="input"
            v-model="dValue"
            type="number"
            :min="min"
            :max="max"
            :step="step"
            class="text-input no-style"
        />
        <f-slider
            ref="slider"
            v-model="dValue"
            :min="min"
            :max="max"
            :step="step"
            :labels="labels"
            clickable-labels
            use-lower-fill-bar
        >
            <template #top="sProps">
                <label :for="sProps.inputId" class="not-visible">{{ label }}</label>
            </template>
        </f-slider>
    </div>
</template>

<script>
import FSlider from '../core/FSlider/FSlider.vue';
import { getUniqueId } from '../../utils';

export default {
    name: 'DefiPriceInput',

    components: { FSlider },

    props: {
        /** Price. */
        value: {
            type: String,
            default: '',
        },
        /** Minimal value. */
        min: {
            type: String,
            default: '0',
        },
        /** Maximal value. */
        max: {
            type: String,
            default: '100',
        },
        /** Step. */
        step: {
            type: String,
            default: '1',
        },
        /** Hidden label. */
        label: {
            type: String,
            default: 'Enter price',
        },
    },

    data() {
        return {
            dValue: this.value,
            id: getUniqueId(),
            labels: ['0%', '50%', '100%'],
        };
    },

    watch: {
        dValue(_value, _oldValue) {
            let cValue;

            if (_value !== _oldValue) {
                cValue = this.$refs.slider.getCorrectValue(_value);

                if (cValue !== _value && cValue === this.max) {
                    this.dValue = cValue;
                    // this.$refs.input.select();
                }

                this.$emit('defi-price-input-change', cValue);
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
