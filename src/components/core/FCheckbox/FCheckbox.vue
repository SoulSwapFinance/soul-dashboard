<template>
    <label class="option">
        <input type="checkbox" v-bind="checkboxProps" @change="onChange" />
        <span class="checkbox"></span> <slot>{{ label }}</slot>
    </label>
</template>

<script>
import { checkbox } from '../../../mixins/checkbox.js';

export default {
    mixins: [checkbox],

    model: {
        prop: 'checked',
        event: 'change',
    },

    methods: {
        onChange(_event) {
            this.$emit('change', _event.target.checked);
        },
    },
};
</script>
