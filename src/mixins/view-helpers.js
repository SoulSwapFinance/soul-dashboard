import { cloneObject, toKebabCase } from '@/utils';
import { getAppParentNode } from '@/app-structure.js';

export const viewHelpersMixin = {
    props: {
        /** Identifies if component is view (has route). */
        isView: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            compName: toKebabCase(this.$options.name),
        };
    },

    computed: {
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },
    },

    methods: {
        /**
         * Map route params to properties. Param (and related prop) with name
         * `paramName` (prop `paramName`) is then mapped to `d_paramName`.
         */
        setDataFromParams() {
            const { params } = this;
            const props = {};

            Object.keys(this.$props).forEach((_prop) => {
                const dPropName = `d_${_prop}`;

                if (_prop in params && dPropName in this) {
                    props[dPropName] = params[_prop];
                }
            });

            Object.keys(props).forEach((_prop) => {
                const value = props[_prop];

                if (typeof value === 'object') {
                    this[_prop] = cloneObject(value);
                } else {
                    this[_prop] = value;
                }
            });
        },

        /**
         * Get route for back button.
         *
         * @param {string} _nodeId
         * @return {string}
         */
        getBackButtonRoute(_nodeId) {
            const parentNode = getAppParentNode(_nodeId);

            return parentNode ? parentNode.id : '';
        },
    },
};
