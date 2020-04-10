<template>
    <span class="btn f-file-input-btn" tabindex="0" role="button">
        <label :for="id"><slot></slot></label>
        <input
            type="file"
            tabindex="-1"
            :accept="accept"
            :multiple="multiple"
            v-bind="cInputProps"
            @change="onFFileInputButtonChange"
        />
    </span>
</template>

<script>
import { input } from '../../../mixins/input.js';

export default {
    mixins: [input],

    props: {
        accept: {
            type: String,
            default: '',
        },
        multiple: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        onFFileInputButtonChange(_event) {
            this.$emit('change', _event);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
