<template>
    <div class="view-defi-lock-confirmation">
        <defi-deposit-confirmation :params="params" comp-name="defi-lock" :token="params.token" />
    </div>
</template>

<script>
import DefiDepositConfirmation from '../../components/DefiDepositConfirmation/DefiDepositConfirmation.vue';

export default {
    name: 'DefiLockConfirmation',

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
