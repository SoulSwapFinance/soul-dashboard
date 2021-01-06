<template>
    <div class="view-defi-unlock">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Unlock Collateral
        </h1>

        <h2 class="perex">Unlock collateral after you repaid minted synths.</h2>

        <defi-deposit
            :token="params.token"
            :token-symbol="params.tokenSymbol || query.tokenSymbol"
            :token-address="params.tokenAddress || query.tokenAddress"
            withdraw
            lock-unlock-mode
            on-submit-route="defi-unlock-confirmation"
        />
    </div>
</template>

<script>
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';
import DefiDeposit from '@/components/DefiDeposit/DefiDeposit.vue';
import { getAppParentNode } from '@/app-structure.js';

export default {
    name: 'DefiUnlock',

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
            const parentNode = getAppParentNode('defi-unlock');

            return parentNode ? parentNode.id : '';
        },
    },
};
</script>
