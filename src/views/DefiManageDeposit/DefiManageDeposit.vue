<template>
    <div class="view-defi-manage-deposit">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Deposit
        </h1>

        <defi-deposit />
    </div>
</template>

<script>
import { getAppParentNode } from '../../app-structure.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import DefiDeposit from '../../components/DefiDeposit/DefiDeposit.vue';

export default {
    name: 'DefiManageDeposit',

    components: { DefiDeposit, FBackButton },

    computed: {
        backButtonRoute() {
            const parentNode = getAppParentNode('defi-manage-deposit');

            return parentNode ? parentNode.route : '';
        },
    },
};
</script>
