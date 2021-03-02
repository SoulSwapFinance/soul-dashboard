<template>
    <div class="view-defi-manage-borrow">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Borrow/Repay
        </h1>

        <defi-borrow :token="params.token" />
    </div>
</template>

<script>
import { getAppParentNode } from '../../app-structure.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import DefiBorrow from '../../components/DefiBorrow/DefiBorrow.vue';

export default {
    name: 'DefiManageBorrow',

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
            const parentNode = getAppParentNode('defi-manage-borrow');

            return parentNode ? parentNode.id : '';
        },
    },
};
</script>
