<template>
    <div class="view-defi-manage-borrow-confirmation">
        <defi-borrow-confirmation
            :params="params"
            comp-name="defi-manage-borrow"
            :token-symbol="params.tokenSymbol"
            :debt-decimals="5"
        />
    </div>
</template>

<script>
import DefiBorrowConfirmation from '../../components/DefiBorrowConfirmation/DefiBorrowConfirmation.vue';

export default {
    name: 'DefiManageBorrowConfirmation',

    components: { DefiBorrowConfirmation },

    computed: {
        /**
         * @return {{debt: number, currDebt: number, address: string, steps: number, step: number, tokenSymbol: string}}
         */
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },
    },
};
</script>
