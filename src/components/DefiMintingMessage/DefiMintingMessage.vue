<template>
    <div class="defi-minting-message">
        You’re minting
        <span class="inc-desc-collateral">
            <f-token-value :token="token" :value="value" no-currency /> {{ cTokenSymbol }}
        </span>
        <br />
        Minting fee is
        <span class="inc-desc-collateral">
            <f-token-value :token="token" :value="value * 0.005" no-currency /> {{ cTokenSymbol }} ({{ fee }}%)
        </span>
        <br />
        You will receive
        <span class="inc-desc-collateral">
            <f-token-value :token="token" :value="value * 0.995" no-currency /> {{ cTokenSymbol }}
        </span>
        into your account.
    </div>
</template>

<script>
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';

export default {
    name: 'DefiMintingMessage',

    components: { FTokenValue },

    props: {
        /** @type {DefiToken} */
        token: {
            type: Object,
            default() {
                return {};
            },
            required: true,
        },
        /** */
        value: {
            type: Number,
            default: 0,
            required: true,
        },
    },

    data() {
        return {
            fee: 0.5,
        };
    },

    computed: {
        cTokenSymbol() {
            return this.$defi.getTokenSymbol({ symbol: this.token.symbol });
        },
    },
};
</script>
