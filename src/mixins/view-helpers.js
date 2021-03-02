import { cloneObject } from '@/utils';
import { getAppParentNode } from '@/app-structure.js';

export const viewHelpersMixin = {
    methods: {
        setDataFromParams() {
            const { $route } = this;
            const params = $route && $route.params ? $route.params : {};
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
