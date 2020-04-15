import { getUniqueId } from '../utils';

export default {
    methods: {
        /**
         * Generate unique id if there is no 'id' property in object.
         *
         * @param {array} _items
         */
        setIds(_items) {
            if (_items && _items.length) {
                for (let i = 0, len1 = _items.length; i < len1; i += 1) {
                    if (!('id' in _items[i])) {
                        _items[i].id = getUniqueId();
                    }
                }
            }
        },

        /**
         * Find child component by name.
         *
         * @param {string} _name
         * @param {array} [_children]
         * @return {null|*|Vue}
         */
        findChildByName(_name, _children) {
            const children = _children || this.$children;

            for (let i = 0, len1 = children.length; i < len1; i++) {
                if (children[i].$options._componentTag === _name) {
                    return children[i];
                }
            }

            return null;
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
    },
};
