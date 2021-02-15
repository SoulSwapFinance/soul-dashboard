<template>
    <div class="flendreservedetail">
        <h1 class="with-back-btn">
            <f-back-button :route-name="getBackButtonRoute(compName)" :params="$route.params" />
            {{ reserve.asset.name }}
        </h1>

        <div class="flendreservedetail_body">
            <div class="flendreservedetail_reserve">
                <h3 class="flendreservedetail_title">Reserve Status & Configuration</h3>
                <f-lend-reserve-status :reserve="reserve" />
            </div>
            <div class="flendreservedetail_user">
                <h3 class="flendreservedetail_title">Your information</h3>
                <f-lend-user-info :reserve="reserve" />
            </div>
        </div>
    </div>
</template>

<script>
import { viewHelpersMixin } from '@/mixins/view-helpers.js';
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';
import FLendReserveStatus from '@/components/flend/FLendReserveStatus/FLendReserveStatus.vue';
import FLendUserInfo from '@/components/flend/FLendUserInfo/FLendUserInfo.vue';

export default {
    name: 'FLendReserveDetail',

    components: { FLendUserInfo, FLendReserveStatus, FBackButton },

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
