<template>
    <div class="view-defi-lock">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Lock wFTM
        </h1>

        <h2 class="perex">
            Lock wFTM to increase the collateral ratio and mint fUSD.
        </h2>

        <defi-deposit
            :token="params.token"
            deposit
            lock-unlock-mode
            single-token
            token-symbol="WFTM"
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
