<template>
    <label class="option">
        <input type="checkbox" :name="name" :checked="value" :disabled="disabled" class="def" @change="onChange" />
        <span class="checkbox"></span> <slot>{{ label }}</slot>
    </label>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: '',
        },
        value: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        onChange(_event) {
            this.$emit('input', _event.target.checked);
        },
    },
};
</script>
