<template>
    <div class="view-defi-manage-borrow-confirmation">
        <defi-borrow-confirmation :params="params" comp-name="defi-manage-borrow" :token="params.token" />
    </div>
</template>

<script>
import DefiBorrowConfirmation from '../../components/DefiBorrowConfirmation/DefiBorrowConfirmation.vue';

export default {
    name: 'DefiManageBorrowConfirmation',

    components: { DefiBorrowConfirmation },

    computed: {
        /**
         * @return {{debt: number, currDebt: number, address: string, steps: number, step: number, token: DefiToken}}
         */
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },
    },
};
</script>
