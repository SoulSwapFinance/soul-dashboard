<template>
    <div class="view-defi-manage-deposit-confirmation">
        <defi-deposit-confirmation :params="params" comp-name="defi-manage-deposit" :token="params.token" />
    </div>
</template>

<script>
import DefiDepositConfirmation from '../../components/DefiDepositConfirmation/DefiDepositConfirmation.vue';

export default {
    name: 'DefiManageDepositConfirmation',

    components: { DefiDepositConfirmation },

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
