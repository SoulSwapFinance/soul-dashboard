<template>
    <span :id="id" class="f-input" :class="classes" @click="onClick">
        <slot name="top" v-bind="slotProps">
            <label :for="`${id}-f-inp`">{{ label }}</label>
        </slot>
        <span class="inp" :class="inpClasses">
            <slot name="prefix"></slot>
            <input
                :id="`${id}-f-inp`"
                ref="input"
                v-bind="inputProps"
                :value="val"
                :aria-invalid="isInvalid"
                @input="onInput"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlur"
            />
            <slot name="suffix"></slot>
        </span>
        <slot name="bottom" v-bind="slotProps"></slot>
    </span>
</template>

<script>
import { input } from '../../../mixins/input.js';

export default {
    mixins: [input],

    props: {
        // input type
        type: {
            type: String,
            default: 'text',
        },
        // custom validator function
        validator: {
            type: Function,
            default: null,
        },
        // size of input, 'large' | 'small'
        fieldSize: {
            type: String,
            default: '',
        },
        // validate on input event as well
        validateOnInput: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            val: this.value,
            isInvalid: this.invalid,
            hasFocus: false,
            errmsgslot: 'suffix',
        };
    },

    computed: {
        classes() {
            return {
                'prefix-slot': this.hasSlot('prefix'),
                'suffix-slot': this.hasSlot('suffix'),
                'bottom-slot': this.hasSlot('bottom'),
            };
        },

        inpClasses() {
            return {
                focus: this.hasFocus,
                invalid: this.isInvalid,
                large: this.fieldSize === 'large',
                small: this.fieldSize === 'small',
                readonly: this.readonly,
                disabled: this.disabled,
            };
        },

        fInputProps() {
            return {
                ...this.inputProps,
                label: this.label,
                validator: this.validator,
                fieldSize: this.fieldSize,
                validateOnInput: this.validateOnInput,
                hideInfoOnError: this.hideInfoOnError,
            };
        },

        slotProps() {
            return {
                showErrorMessage: this.isInvalid,
                showInfoMessage: this.showInfoMessage,
            };
        },

        showInfoMessage() {
            return this.hideInfoOnError ? !this.isInvalid : true;
        },
    },

    watch: {
        value(_val) {
            this.val = _val;
        },
    },

    methods: {
        validate() {
            if (this.validator) {
                this.isInvalid = !this.validator(this.val);
            }
        },

        /**
         * Check non-empty slot existence.
         *
         * @param {string} _name
         * @return {boolean}
         */
        hasSlot(_name = 'default') {
            return !!this.$slots[_name] || !!this.$scopedSlots[_name];
        },

        /**
         * @param {Event} _event
         */
        onClick(_event) {
            if (_event.target !== this.$refs.input) {
                this.$refs.input.focus();
            }
        },

        /**
         * @param {Event} _event
         */
        onInput(_event) {
            this.val = _event.target.value;
            this.$emit('input', _event.target.value);

            if (this.validateOnInput) {
                this.validate();
            }
        },

        onChange() {
            this.validate();
        },

        onFocus() {
            this.hasFocus = true;
        },

        onBlur() {
            this.hasFocus = false;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
