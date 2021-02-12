<template>
    <div class="flenddepositdetail">
        <h1 class="with-back-btn">
            <f-back-button :route-name="getBackButtonRoute(compName)" :params="$route.params" />
            Deposit {{ $defi.getTokenSymbol(reserve.erc20Info) }}
        </h1>

        <div class="flenddepositdetail_body">
            <f-lend-reserve-overview :reserve="reserve" />
        </div>
    </div>
</template>

<script>
import { viewHelpersMixin } from '@/mixins/view-helpers.js';
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';
import FLendReserveOverview from '@/components/flend/FLendReserveOverview/FLendReserveOverview.vue';

export default {
    name: 'FLendDepositDetail',

    components: { FLendReserveOverview, FBackButton },

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
                erc20Info: {},
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
            const reserve = await this.$flend.fetchReserveWithERC20Info(this.d_assetAddress);

            if (reserve.assetAddress) {
                this.reserve = reserve;
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
