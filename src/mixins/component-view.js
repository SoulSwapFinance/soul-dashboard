import { Tree } from '@/utils/tree.js';

/**
 * Helper methods and properties for handling component changes via `<component>`.
 */
export const componentViewMixin = {
    data() {
        return {
            currentComponent: '',
            currentAppNodeId: '',
            _viewsStructure: null,
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
            let compName = _compName;

            if (this.viewsStructure) {
                if (!this._viewsStructure) {
                    this._viewsStructure = new Tree(this.viewsStructure);
                }

                const appNode = this._viewsStructure.getBy(compName, 'id');
                if (appNode && appNode.component) {
                    compName = appNode.component;
                    this.currentAppNodeId = appNode.id;
                }
            }

            this._cwmData = _data;
            this.currentComponent = compName;

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
