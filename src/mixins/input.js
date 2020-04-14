import { inputCommon } from './input-common.js';

// props for custom inputs
export const input = {
    props: {
        ...inputCommon.props,

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
                ...inputCommon.computed.inputCommonProps.call(this),
                autocomplete: this.autocomplete,
                readonly: this.readonly,
                multiple: this.multiple,
            };
        },
    },
};
