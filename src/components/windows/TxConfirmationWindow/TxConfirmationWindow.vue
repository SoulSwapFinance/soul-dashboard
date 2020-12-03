<template>
    <div class="tx-confirmation-window">
        <f-window
            ref="win"
            modal
            class="tx-confirmation-f-window"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            no-controls
            :hide-on-escape-key="false"
            @window-hide="$emit('window-hide', $event)"
        >
            <template #title>
                <h2>Confirmation</h2>
                <div>steps</div>
            </template>
            <component
                :is="currentComponent"
                v-bind="currentComponentProperties"
                @change-component="onChangeComponent"
            ></component>
        </f-window>
    </div>
</template>

<script>
import FWindow from '@/components/core/FWindow/FWindow.vue';
import DefiDepositConfirmation from '@/components/DefiDepositConfirmation/DefiDepositConfirmation.vue';

export default {
    name: 'TxConfirmationWindow',

    components: { DefiDepositConfirmation, FWindow },

    data() {
        return {
            currentComponent: '',
        };
    },

    computed: {
        currentComponentProperties() {
            if (this.currentComponent) {
                return this._data_;
            }

            return null;
        },
    },

    created() {
        // temporary data
        this._data_ = null;
    },

    methods: {
        show(_compName, _data = {}) {
            if (_compName) {
                this.currentComponent = _compName;
                this._data_ = _data;
                this.$refs.win.show();
            }
        },

        /**
         * @param {Object} _data
         */
        onChangeComponent(_data) {
            this._data_ = _data.data;

            this.currentComponent = _data.to;

            this.$nextTick(() => {
                this._data_ = null;
            });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
