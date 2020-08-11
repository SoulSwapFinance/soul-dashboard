<template>
    <span class="f-token-value">
        {{ tokenValue }} <span v-if="!noCurrency" class="currency">{{ tokenSymbol }}</span>
    </span>
</template>

<script>
import { formatNumberByLocale } from '@/filters.js';

export default {
    name: 'FTokenValue',

    props: {
        /** @type {DefiToken} */
        token: {
            type: Object,
            default() {
                return {};
            },
            required: true,
        },
        /** Token's value. */
        value: {
            type: [Number, String],
            default: 0,
        },
        /** Hide currency. */
        noCurrency: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        tokenSymbol() {
            return this.$defi.getTokenSymbol(this.token);
        },

        tokenValue() {
            let decimals = this.$defi.tokenDecimals[this.token.symbol];

            return this.value === 0 ? 0 : formatNumberByLocale(parseFloat(this.value).toFixed(decimals), decimals);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
