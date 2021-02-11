<template>
    <div class="flendreservedetail">
        <h1 class="with-back-btn">
            <f-back-button :route-name="getBackButtonRoute(compName)" :params="$route.params" />
            {{ reserve.erc20Info.name }}
        </h1>
    </div>
</template>

<script>
import { viewHelpersMixin } from '@/mixins/view-helpers.js';
import FBackButton from '@/components/core/FBackButton/FBackButton.vue';

export default {
    name: 'FLendReserveDetail',

    components: { FBackButton },

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
