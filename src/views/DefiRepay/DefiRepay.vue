<template>
    <div class="view-defi-repay">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Repay Synths
        </h1>

        <h2 class="perex">
            Repay fUSD to unlock your wFTM. You can use fUSD to trade synths, lend it to the liquidity pool to earn
            interest, and use it as a collateral to borrow synths.
        </h2>

        <defi-borrow
            :token="params.token"
            :token-symbol="params.tokenSymbol"
            repay
            mint-repay-mode
            on-submit-route="defi-repay-confirmation"
        />
    </div>
</template>

<script>
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '@/app-structure.js';
import DefiBorrow from '@/components/DefiBorrow/DefiBorrow.vue';

export default {
    name: 'DefiRepay',

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
            const parentNode = getAppParentNode('defi-repay');

            return parentNode ? parentNode.route : '';
        },
    },
};
</script>
