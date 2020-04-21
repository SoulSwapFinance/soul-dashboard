<template>
    <button type="button" title="Copy to clipboard" @click="onClick">
        <slot><icon data="@/assets/svg/copy.svg" width="20" height="20" aria-hidden="true" /></slot>
    </button>
</template>

<script>
import copy from 'copy-to-clipboard';

export default {
    props: {
        text: {
            type: String,
            default: '',
        },
    },

    methods: {
        onClick() {
            copy(this.text);
        },
    },
};
</script>
