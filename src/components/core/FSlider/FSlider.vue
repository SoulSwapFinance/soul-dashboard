<template>
    <div class="f-slider" :class="classes">
        <f-input ref="input" v-model="val" type="range" v-bind="fInputProps" no-input-style @input="onInput">
            <template #top="sProps">
                <slot name="top" v-bind="sProps"></slot>
            </template>
            <template #bottom="sProps">
                <slot name="bottom" v-bind="sProps"></slot>
            </template>
        </f-input>
    </div>
</template>

<script>
import FInput from '../FInput/FInput.vue';
import { inputMixin } from '../../../mixins/input.js';

/**
 * Accessible slider.
 * Wrapper around input[type="range"] field with fill bars.
 */
export default {
    name: 'FSlider',

    components: { FInput },

    mixins: [inputMixin],

    props: {
        ...FInput.props,
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
        /** Use fill bar from left corner to thumb. */
        useLowerFillBar: {
            type: Boolean,
            default: false,
        },
        /** Use fill bar from thumb to right corner. */
        useUpperFillBar: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            val: this.value,
        };
    },

    computed: {
        fInputProps() {
            return {
                ...FInput.computed.fInputProps.call(this),
            };
        },

        classes() {
            return {
                'use-lower-fill-bar': this.useLowerFillBar,
                'use-upper-fill-bar': this.useUpperFillBar,
            };
        },
    },

    watch: {
        value(_value) {
            this.val = this.getCorrectValue(_value);
            this.updateFills(this.val);
        },
    },

    mounted() {
        this.updateFills();
    },

    methods: {
        /**
         * Update fill bars according to slider value.
         */
        updateFills(_value) {
            const dValue = this.getDetailedValue(_value);
            const inputStyle = this.$refs.input.$el.style;

            if (inputStyle.setProperty && (this.useLowerFillBar || this.useUpperFillBar)) {
                // Set slider value in percentage to css custom property
                inputStyle.setProperty(
                    '--f-slider-value',
                    ((dValue.value - dValue.min) / (dValue.max - dValue.min)) * 100
                );
            }
        },

        /**
         * Get detailed slider value - current value, min value, ...
         *
         * @param {string|number} _value
         * @return {{min: number, max: number, step: number, value: number}}
         */
        getDetailedValue(_value) {
            return {
                value: parseFloat(_value !== undefined ? _value : this.$refs.input.$refs.input.value),
                min: parseFloat(this.min),
                max: parseFloat(this.max),
                step: parseFloat(this.step),
            };
        },

        /**
         *
         * @param {*} _value
         */
        getCorrectValue(_value) {
            const dValue = this.getDetailedValue(_value);

            if (isNaN(dValue.value)) {
                dValue.value = dValue.min;
            }
            // Clamp value
            else if (dValue.value < dValue.min) {
                dValue.value = dValue.min;
            } else if (dValue.value > dValue.max) {
                dValue.value = dValue.max;
            }

            return dValue.value.toString();
        },

        onInput(_value) {
            this.updateFills(_value);

            this.$emit('input', _value);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
