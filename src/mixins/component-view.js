/**
 * Helper methods and properties for handling component changes via `<component>`.
 */
export const componentViewMixin = {
    data() {
        return {
            currentComponent: '',
        };
    },

    computed: {
        currentComponentProperties() {
            if (this.currentComponent) {
                return this._cwmData;
            }

            return null;
        },
    },

    created() {
        // temporary data
        this._cwmData = null;
    },

    methods: {
        changeComponent(_compName, _data = null) {
            this._cwmData = _data;
            this.currentComponent = _compName;

            this.$nextTick(() => {
                this._cwmData = null;
            });
        },

        /**
         * @param {Object} _data
         */
        onChangeComponent(_data) {
            this.changeComponent(_data.to, _data.data);
        },
    },
};
