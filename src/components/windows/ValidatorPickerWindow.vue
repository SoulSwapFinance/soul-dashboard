<template>
    <div class="validator-picker-window">
        <f-window
            ref="win"
            modal
            style="max-width: 1000px; height: 100%;"
            class="normal-padding"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            @window-hide="onWindowHide"
        >
            <template #title>
                <h2>
                    Validators <span class="f-records-count">({{ validatorListRecordsCount }})</span>
                </h2>
            </template>
            <validator-list
                @records-count="onValidatorListRecordsCount"
                @validator-selected="onValidatorSelected"
            ></validator-list>
        </f-window>
    </div>
</template>

<script>
import FWindow from '../core/FWindow/FWindow.vue';
import ValidatorList from '../data-tables/ValidatorList/ValidatorList.vue';

export default {
    name: 'ValidatorPickerWindow',

    components: { ValidatorList, FWindow },

    data() {
        return {
            validatorListRecordsCount: 0,
        };
    },

    methods: {
        show() {
            this.$refs.win.show();
        },

        onValidatorListRecordsCount(_recordsCount) {
            this.validatorListRecordsCount = _recordsCount;
        },

        onValidatorSelected(_validatorInfo) {
            this.$refs.win.hide('fade-leave-active');
            this.$emit('validator-selected', _validatorInfo);
        },

        /**
         * Re-target `'window-hide'` event.
         *
         * @param {object} _data
         */
        onWindowHide(_data) {
            this.$emit('window-hide', _data);
        },
    },
};
</script>
