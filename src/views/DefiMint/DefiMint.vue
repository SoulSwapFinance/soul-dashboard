<template>
    <div class="view-defi-mint">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Mint Synths
        </h1>

        <h2 class="perex">
            Mint synths with your locked collateral.
        </h2>

        <defi-borrow
            :token="params.token"
            :token-symbol="params.tokenSymbol || query.tokenSymbol"
            :token-address="params.tokenAddress || query.tokenAddress"
            borrow
            mint-repay-mode
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

        /**
         * @return {{token: DefiToken}|{}}
         */
        query() {
            const { $route } = this;

            return $route && $route.query ? $route.query : {};
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-mint');

            return parentNode ? parentNode.id : '';
        },
    },
};
</script>
