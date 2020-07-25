<template>
    <div class="view-defi-mint-repay-confirmation">
        <defi-borrow-confirmation :params="params" />
    </div>
</template>

<script>
import DefiBorrowConfirmation from '../../components/DefiBorrowConfirmation/DefiBorrowConfirmation.vue';

export default {
    name: 'DefiMintRepayConfirmation',

    components: { DefiBorrowConfirmation },

    computed: {
        /**
         * @return {{debt: number, currDebt: number, address: string, steps: number, step: number}}
         */
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },
    },
};
</script>
