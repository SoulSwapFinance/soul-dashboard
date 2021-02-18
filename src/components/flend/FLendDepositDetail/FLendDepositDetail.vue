<template>
    <div class="flenddepositdetail">
        <h1 class="with-back-btn">
            <f-back-button :route-name="getBackButtonRoute(compName)" :params="$route.params" />
            Deposit {{ $defi.getTokenSymbol(reserve.asset) }}
        </h1>

        <h2 class="perex">Please enter an amount you would like to deposit.</h2>

        <div class="flenddepositdetail_body">
            <f-lend-deposit-withdraw :reserve="reserve" @cancel-button-click="onCancelButtonClick" />
            <f-lend-reserve-overview :reserve="reserve" />
        </div>
    </div>
</template>

<script>
import { viewHelpersMixin } from '@/mixins/view-helpers.js';
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';
import FLendReserveOverview from '@/components/flend/FLendReserveOverview/FLendReserveOverview.vue';
import FLendDepositWithdraw from '@/components/flend/FLendDepositWithdraw/FLendDepositWithdraw.vue';

export default {
    name: 'FLendDepositDetail',

    components: { FLendDepositWithdraw, FLendReserveOverview, FBackButton },

    mixins: [viewHelpersMixin],

    props: {
        assetAddress: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            d_assetAddress: '',
            /** @type {FLendReserve} */
            reserve: {
                asset: {},
            },
        };
    },

    created() {
        this.setDataFromParams();
        this.init();
    },

    methods: {
        init() {
            this.setReserve();
        },

        async setReserve() {
            /** @type {FLendReserve} */
            const reserve = await this.$flend.fetchReserveWithAsset(this.d_assetAddress);

            if (reserve.assetAddress) {
                this.reserve = reserve;
            }
        },

        /**
         * Called when tx window's cancel button was clicked
         */
        onCancelButtonClick() {
            this.setReserve();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
