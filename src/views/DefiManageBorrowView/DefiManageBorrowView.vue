<template>
    <div class="view-defi-manage-borrow">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Borrow
        </h1>

        <defi-manage-borrow @defi-manage-borrow-submit="onDefiManageBorrowSubmit" />
    </div>
</template>

<script>
import { getAppParentNode } from '../../app-structure.js';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import DefiManageBorrow from '../../components/DefiManageBorrow/DefiManageBorrow.vue';

export default {
    name: 'DefiManageBorrowView',

    components: { DefiManageBorrow, FBackButton },

    computed: {
        backButtonRoute() {
            const parentNode = getAppParentNode('defi-manage-borrow-view');

            return parentNode ? parentNode.route : '';
        },
    },

    methods: {
        onDefiManageBorrowSubmit(_data) {
            console.log('onDefiManageBorrowSubmit', _data);

            /*
            this.$router.push({
                name: 'defi-manage-borrow-confirmation',
                params: _data,
            });
            */
        },
    },
};
</script>
