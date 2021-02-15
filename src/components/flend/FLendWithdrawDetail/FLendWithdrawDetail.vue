<template>
    <div class="flendwithdrawdetail">
        <h1 class="with-back-btn">
            <f-back-button :route-name="getBackButtonRoute(compName)" :params="$route.params" />
            Withdraw {{ $defi.getTokenSymbol(reserve.asset) }}
        </h1>

        <h2 class="perex">Please enter an amount you would like to withdraw.</h2>

        <div class="flendwithdrawdetail_body">
            <f-lend-deposit-withdraw :reserve="reserve" withdraw />
            <f-lend-reserve-overview :reserve="reserve" />
        </div>
    </div>
</template>

<script>
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';
import FLendReserveOverview from '@/components/flend/FLendReserveOverview/FLendReserveOverview.vue';
import FLendDepositWithdraw from '@/components/flend/FLendDepositWithdraw/FLendDepositWithdraw.vue';
import FLendDepositDetail from '@/components/flend/FLendDepositDetail/FLendDepositDetail.vue';

export default {
    name: 'FLendWithdrawDetail',

    components: { FLendDepositWithdraw, FLendReserveOverview, FBackButton },

    mixins: [FLendDepositDetail],
};
</script>

<style lang="scss">
@import 'style';
</style>
