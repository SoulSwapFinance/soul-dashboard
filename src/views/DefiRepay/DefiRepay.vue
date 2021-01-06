<template>
    <div class="view-defi-repay">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Repay Synths
        </h1>

        <h2 class="perex">
            Repay synths to unlock your collateral.
        </h2>

        <defi-borrow
            :token="params.token"
            :token-symbol="params.tokenSymbol || query.tokenSymbol"
            :token-address="params.tokenAddress || query.tokenAddress"
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

        /**
         * @return {{token: DefiToken}|{}}
         */
        query() {
            const { $route } = this;

            return $route && $route.query ? $route.query : {};
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-repay');

            return parentNode ? parentNode.id : '';
        },
    },
};
</script>
