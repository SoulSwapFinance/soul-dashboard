<template>
    <div class="flendreserveoverview">
        <f-card>
            <div class="flendreserveoverview_label">
                <f-crypto-symbol :token="reserve.asset" img-width="16px" img-height="16px" /> Reserve Overview
            </div>
            <div class="flendreserveoverview_body gridauto">
                <template v-if="!borrow">
                    <div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">Utilization rate</div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ overview.utilisationRate }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-5 light-text-color fs-80">Available liquidity</div>
                            <div class="col-7 flendreserveoverview_value">
                                <b>{{ $flend.formatAmount(overview.available) }}</b> {{ tokenSymbol }}
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">Deposit APY</div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ overview.depositAPY }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">Can be used as collateral</div>
                            <div class="col-4 flendreserveoverview_value">
                                <f-yes-no :value="overview.usedAsColllateral" /> ??
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-5 light-text-color fs-80">Asset price</div>
                            <div class="col-7 flendreserveoverview_value">
                                <b>{{ overview.assetPriceFormatted }}</b> USD
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">Maximum LTV <f-lend-l-t-v-info /></div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ overview.maximumLTV }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">
                                Liquidation threshold <f-lend-liquidation-treshold-info />
                            </div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ overview.liquidationTreshold }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">
                                Liquidation penalty <f-lend-liquidation-penalty />
                            </div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ overview.liquidationPenalty }}</b> %
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">Utilization rate</div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ overview.utilisationRate }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-5 light-text-color fs-80">Available liquidity</div>
                            <div class="col-7 flendreserveoverview_value"><b>6,834,233.97004</b> {{ tokenSymbol }}</div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-5 light-text-color fs-80">Asset price</div>
                            <div class="col-7 flendreserveoverview_value">
                                <b>{{ overview.assetPrice }}</b> USD
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Stable borrow APR</div>
                            <div class="col flendreserveoverview_value">
                                <b>{{ overview.stableBorrowAPR }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Variable borrow APR</div>
                            <div class="col flendreserveoverview_value">
                                <b>{{ overview.variableBorrowAPR }}</b> %
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '@/components/core/FCard/FCard.vue';
import FYesNo from '@/components/core/FYesNo/FYesNo.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
import FLendLTVInfo from '@/components/flend/infos/FLendLTVInfo.vue';
import FLendLiquidationTresholdInfo from '@/components/flend/infos/FLendLiquidationTresholdInfo.vue';
import FLendLiquidationPenalty from '@/components/flend/infos/FLendLiquidationPenalty.vue';

export default {
    name: 'FLendReserveOverview',

    components: {
        FLendLiquidationPenalty,
        FLendLiquidationTresholdInfo,
        FLendLTVInfo,
        FCryptoSymbol,
        FYesNo,
        FCard,
    },

    props: {
        /** @type {FLendReserve} */
        reserve: {
            type: Object,
            default() {
                return {
                    asset: {},
                };
            },
        },
        /** Specifies if show reserve borrow info */
        borrow: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            overview: {
                available: 0,
                utilisationRate: '??',
                depositAPY: '??',
                depositAPY30d: '??',
                assetPriceFormatted: '$0',
                maximumLTV: 0,
                liquidationTreshold: 0,
                liquidationPenalty: 0,
                usedAsColllateral: true,
                stableBorrowAPR: 0,
                variableBorrowAPR: 0,
                variableBorrowAPR30d: '??',
            },
        };
    },

    computed: {
        tokenSymbol() {
            return this.$defi.getTokenSymbol(this.reserve.asset);
        },
    },

    watch: {
        reserve: {
            immediate: true,
            handler() {
                this.setData();
            },
        },
    },

    methods: {
        async setData() {
            /** @type {FLendReserve} */
            const reserve = this.reserve;

            if (!reserve.ID) {
                return;
            }

            /** @type {FLendReserveOverview} */
            const reserveOverview = await this.$flend.getReserveOverview(reserve);

            this.overview = { ...this.overview, ...reserveOverview };
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
