<template>
    <div class="view-defi-manage-borrow">
        <h1 class="with-back-btn">
            <f-back-button :route-name="backButtonRoute" />
            Borrow
        </h1>

        <defi-borrow @defi-manage-borrow-submit="onDefiManageBorrowSubmit" />
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
        backButtonRoute() {
            const parentNode = getAppParentNode('defi-manage-borrow');

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
