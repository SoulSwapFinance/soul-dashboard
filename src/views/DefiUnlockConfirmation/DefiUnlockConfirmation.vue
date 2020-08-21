<template>
    <div class="view-defi-unlock-confirmation">
        <defi-deposit-confirmation :params="params" comp-name="defi-unlock" :token="params.token" />
    </div>
</template>

<script>
import DefiDepositConfirmation from '../../components/DefiDepositConfirmation/DefiDepositConfirmation.vue';

export default {
    name: 'DefiUnlockConfirmation',

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
