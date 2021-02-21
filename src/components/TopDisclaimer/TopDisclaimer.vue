<template>
    <div v-if="!hidden" class="topdisclaimer" @click="onClick">
        <span class="topdisclaimer_text">
            Always make sure the URL is <b><a href="https://pwawallet.fantom.network">pwawallet.fantom.network</a></b> -
            bookmark it to be safe.
        </span>
        <button class="btn small close-btn same-size round light" title="Close window">
            <icon data="@/assets/svg/times.svg" width="16" height="16" />
        </button>
    </div>
</template>

<script>
const tdKey = 'topdisclaimer';

export default {
    name: 'TopDisclaimer',

    data() {
        return {
            hidden: true,
        };
    },

    mounted() {
        const td = parseInt(window.localStorage.getItem(tdKey));

        if (isNaN(td) || td === 0) {
            this.hidden = false;
        }
    },

    methods: {
        onClick() {
            this.hidden = true;
            window.localStorage.setItem(tdKey, 1);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
