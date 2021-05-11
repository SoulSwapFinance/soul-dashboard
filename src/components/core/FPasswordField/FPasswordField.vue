<template>
    <span class="f-password-field" :class="classes">
        <f-input
            ref="input"
            :type="dType"
            v-bind="fInputProps"
            :autocomplete="cAutocomplete"
            :readonly="disableAutocomplete"
            @focus="onFocus"
            @blur="onBlur"
            @input="onInput"
        >
            <template #top="sProps">
                <slot name="top" v-bind="sProps"></slot>
            </template>
            <template #prefix="sProps">
                <slot name="prefix" v-bind="sProps"></slot>
            </template>
            <template #suffix="sProps">
                <slot name="suffix" v-bind="sProps">
                    <span @click="onEyeButtonClick">
                        <span
                            v-if="dType === 'password'"
                            class="btn same-size round small light"
                            aria-hidden="true"
                            tabindex="0"
                        >
                            <icon data="@/assets/svg/eye-slash.svg" width="16" height="16" aria-hidden="true" />
                        </span>
                        <span
                            v-if="dType === 'text'"
                            class="btn same-size round small light"
                            aria-hidden="true"
                            tabindex="0"
                        >
                            <icon data="@/assets/svg/eye.svg" width="16" height="16" aria-hidden="true" />
                        </span>
                    </span>
                </slot>
            </template>
            <template #bottom="sProps">
                <slot name="bottom" v-bind="sProps"></slot>
            </template>
        </f-input>
    </span>
</template>

<script>
import { inputMixin } from '../../../mixins/input.js';
import FInput from '../FInput/FInput.vue';

/*
function isSafariBrowser() {
    const nAgt = navigator.userAgent;

    return (
        nAgt.indexOf('Chrome') === -1 &&
        nAgt.indexOf('Safari') > -1 &&
        (nAgt.indexOf('CriOS') === -1 || nAgt.indexOf('iOS') === -1)
    );
}
*/

function isWebkitTextSecuritySupported() {
    const el = document.createElement('input');
    el.type = 'text';
    const style = window.getComputedStyle(el);

    return 'webkitTextSecurity' in style;
    // return !isSafariBrowser() && 'webkitTextSecurity' in style;
}

const webkitTextSecuritySupported = isWebkitTextSecuritySupported();

export default {
    components: { FInput },

    mixins: [inputMixin],

    props: {
        ...FInput.props,
        /** Disable autocomplete only */
        disableAutocomplete: {
            type: Boolean,
            default: !webkitTextSecuritySupported,
        },
        /** Prevent save prompt and autocomplete as well */
        preventSavePrompt: {
            type: Boolean,
            default: webkitTextSecuritySupported,
        },
    },

    data() {
        return {
            dType: this.preventSavePrompt ? 'text' : 'password',
            pwdVisible: this.preventSavePrompt,
        };
    },

    computed: {
        fInputProps() {
            return {
                ...FInput.computed.fInputProps.call(this),
            };
        },

        cAutocomplete() {
            if (this.preventSavePrompt) {
                return 'off';
            } else if (this.disableAutocomplete) {
                return 'new-password';
            }

            return null;
        },

        classes() {
            return {
                showdisc: this.pwdVisible,
            };
        },
    },

    methods: {
        async validate() {
            await this.$refs.input.validate();
        },

        onEyeButtonClick() {
            if (!this.preventSavePrompt) {
                if (this.dType === 'password') {
                    this.dType = 'text';
                } else {
                    this.dType = 'password';
                }
            } else {
                this.pwdVisible = !this.pwdVisible;
            }
        },

        onInput(_value) {
            this.$emit('input', _value);
        },

        onFocus() {
            const { input } = this.$refs;

            if (this.disableAutocomplete && input && input.$refs.input) {
                input.$refs.input.removeAttribute('readonly');
            }
        },

        onBlur() {
            const { input } = this.$refs;

            if (this.disableAutocomplete && input && input.$refs.input) {
                input.$refs.input.setAttribute('readonly', 'readonly');
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
