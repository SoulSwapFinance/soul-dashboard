import { inputCommonMixin } from './input-common.js';

// props for custom inputs
export const inputMixin = {
    props: {
        ...inputCommonMixin.props,

        autocomplete: {
            type: String,
            default: '',
        },
        // password, search, tel, text, url
        placeholder: {
            type: String,
            default: '',
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        // email, file
        multiple: {
            type: Boolean,
            default: false,
        },
        invalid: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        inputProps() {
            return {
                ...inputCommonMixin.computed.inputCommonProps.call(this),
                autocomplete: this.autocomplete,
                readonly: this.readonly,
                multiple: this.multiple,
            };
        },
    },
};
