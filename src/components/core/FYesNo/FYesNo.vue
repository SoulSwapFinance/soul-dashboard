<template>
    <div class="fyesno">
        <span v-if="value" class="fyesno_yes">yes</span>
        <span v-else class="fyesno_no">no</span>
    </div>
</template>

<script>
/**
 * Component for displaying text 'yes' in green color or 'no' in red color.
 */
export default {
    name: 'FYesNo',

    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
