<template>
    <div class="view-defi-mint">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Mint fUSD
        </h1>

        <h2 class="perex">
            Mint fUSD with your locked wFTM. You can use fUSD to trade synths, lend it to the liquidity pool to earn
            interest, and use it as a collateral to borrow synths.
        </h2>

        <defi-borrow
            :token="params.token"
            borrow
            mint-repay-mode
            single-token
            token-symbol="FUSD"
            on-submit-route="defi-mint-confirmation"
        />
    </div>
</template>

<script>
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '@/app-structure.js';
import DefiBorrow from '@/components/DefiBorrow/DefiBorrow.vue';

export default {
    name: 'DefiMint',

    components: { DefiBorrow, FBackButton },

    computed: {
        /**
         * @return {{token: DefiToken}|{}}
         */
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-mint');

            return parentNode ? parentNode.route : '';
        },
    },
};
</script>
