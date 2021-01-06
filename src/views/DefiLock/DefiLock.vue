<template>
    <div class="view-defi-lock">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Lock Collateral
        </h1>

        <h2 class="perex">
            Lock collateral to increase the collateral ratio and mint synths.
        </h2>

        <defi-deposit
            :token="params.token"
            :token-symbol="params.tokenSymbol || query.tokenSymbol"
            :token-address="params.tokenAddress || query.tokenAddress"
            deposit
            lock-unlock-mode
            on-submit-route="defi-lock-confirmation"
        />
    </div>
</template>

<script>
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';
import DefiDeposit from '@/components/DefiDeposit/DefiDeposit.vue';
import { getAppParentNode } from '@/app-structure.js';

export default {
    name: 'DefiLock',

    components: { DefiDeposit, FBackButton },

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
            const parentNode = getAppParentNode('defi-lock');

            return parentNode ? parentNode.id : '';
        },
    },
};
</script>
