<template>
    <div class="view-defi-manage-deposit">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Deposit
        </h1>
    </div>
</template>

<script>
import { getAppParentNode } from '../../app-structure.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';

export default {
    name: 'DefiManageDeposit',

    components: { FBackButton },

    computed: {
        backButtonRoute() {
            const parentNode = getAppParentNode('defi-manage-deposit');

            return parentNode ? parentNode.route : '';
        },
    },
};
</script>
