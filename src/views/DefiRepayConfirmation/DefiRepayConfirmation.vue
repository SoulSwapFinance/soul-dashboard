<template>
    <div class="view-defi-repay-confirmation">
        <defi-borrow-confirmation :params="params" comp-name="defi-repay" :token="params.token" />
    </div>
</template>

<script>
import DefiBorrowConfirmation from '@/components/DefiBorrowConfirmation/DefiBorrowConfirmation.vue';

export default {
    name: 'DefiRepayConfirmation',

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
