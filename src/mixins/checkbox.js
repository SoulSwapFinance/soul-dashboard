import { inputCommon } from './input-common.js';

// props for custom inputs
export const checkbox = {
    props: {
        ...inputCommon.props,

        checked: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        checkboxProps() {
            return {
                ...inputCommon.computed.inputCommonProps.call(this),
                checked: this.checked,
            };
        },
    },
};
