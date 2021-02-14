<template>
    <div class="flenddepositwithdrawmessage">
        <f-message v-if="!withdraw" type="info" role="alert" class="big">
            You’re adding
            <span class="inc-desc-collateral">
                <f-token-value :token="token" :value="value" no-currency /> {{ tokenSymbol }}
            </span>
            to your deposits
        </f-message>
        <f-message v-else type="info" role="alert" class="big">
            You’re removing
            <span class="inc-desc-collateral">
                <f-token-value :token="token" :value="value" no-currency /> {{ tokenSymbol }}
            </span>
            from your deposits
        </f-message>
    </div>
</template>

<script>
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import FMessage from '@/components/core/FMessage/FMessage.vue';

export default {
    name: 'FLendDepositWithdrawMessage',

    components: { FMessage, FTokenValue },

    props: {
        /** @type {ERC20Token} */
        token: {
            type: Object,
            default() {
                return {};
            },
            required: true,
        },
        /** */
        value: {
            type: [Number, String],
            default: 0,
            required: true,
        },
        /** Withdraw deposit */
        withdraw: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            fee: 0.5,
        };
    },

    computed: {
        tokenSymbol() {
            return this.$defi.getTokenSymbol({ symbol: this.token.symbol });
        },
    },
};
</script>
