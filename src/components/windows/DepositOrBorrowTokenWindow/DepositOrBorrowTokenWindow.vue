<template>
    <div class="deposit-or-borrow-token-window">
        <f-window
            ref="win"
            modal
            style="max-width: 400px;"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            class="deposit-or-borrow-token-window"
            @window-hide="$emit('window-hide', $event)"
        >
            <template #title>
                <div class="title"><f-crypto-symbol :token="token" img-width="40px" img-height="40px" /></div>
            </template>
            <div class="buttons">
                <router-link
                    class="btn large secondary"
                    :to="{ name: depositRouteName, params: { token: { ...token } } }"
                >
                    Deposit
                </router-link>
                <router-link
                    class="btn large secondary"
                    :to="{ name: borrowRouteName, params: { token: { ...token } } }"
                >
                    Borrow
                </router-link>
            </div>
        </f-window>
    </div>
</template>

<script>
import FWindow from '@/components/core/FWindow/FWindow.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
export default {
    name: 'DepositOrBorrowTokenWindow',

    components: { FCryptoSymbol, FWindow },

    props: {
        /** @type {DefiToken} */
        token: {
            type: Object,
            default() {
                return {};
            },
            required: true,
        },
        depositRouteName: {
            type: String,
            default: 'defi-manage-deposit',
        },
        borrowRouteName: {
            type: String,
            default: 'defi-manage-borrow',
        },
    },

    methods: {
        show() {
            this.$refs.win.show();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
