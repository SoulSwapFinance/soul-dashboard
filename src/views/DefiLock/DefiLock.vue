<template>
    <div class="view-defi-lock">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Lock Collateral
        </h1>

        <h2 class="perex">
            Lock wFTM, sFTM to increase the collateral ratio and mint fUSD.
        </h2>

        <defi-deposit
            :token="params.token"
            :token-symbol="params.tokenSymbol"
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

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-lock');

            return parentNode ? parentNode.route : '';
        },
    },
};
</script>
