<template>
    <div class="flendreservestatus">
        <f-card>
            <div class="flendreservestatus_top">
                <div class="flendreservestatus_reserve">
                    <div class="flendreservestatus_reserve_borrowed">
                        <div class="light-text-color">
                            <span class="flendreservestatus_square flendreservestatus_square-red"></span> Total Borrowed
                        </div>
                        <div class="flendreservestatus_reserve_value">
                            <f-placeholder :content-loaded="loaded" block :replacement-num-chars="10">
                                {{ totalBorrowed }}
                            </f-placeholder>
                        </div>
                        <div class="light-text-color">
                            <f-placeholder :content-loaded="loaded" :replacement-num-chars="14">
                                {{ totalBorrowedUSD }}
                            </f-placeholder>
                        </div>
                    </div>
                    <div class="flendreservestatus_reserve_circle">
                        <div class="flendreservestatus_reserve_circle_wrap">
                            <f-circle-progress :value="availableLiquidityValue" :show-value="false" />
                            <f-crypto-symbol :token="reserve.asset" no-symbol />
                        </div>
                    </div>
                    <div class="flendreservestatus_reserve_liquidity">
                        <div class="light-text-color">
                            Available Liquidity
                            <span class="flendreservestatus_square flendreservestatus_square-green"></span>
                        </div>
                        <div class="flendreservestatus_reserve_value">
                            <f-placeholder :content-loaded="loaded" block :replacement-num-chars="10">
                                {{ available }}
                            </f-placeholder>
                        </div>
                        <div class="light-text-color">
                            <f-placeholder :content-loaded="loaded" :replacement-num-chars="14">
                                {{ availableUSD }}
                            </f-placeholder>
                        </div>
                    </div>
                </div>
                <div class="flendreservestatus_sizerate">
                    <div class="flendreservestatus_sizerate_box">
                        <span class="light-text-color">Reserve size</span>
                        <span class="flendreservestatus_sizerate_box_value">
                            <f-placeholder :content-loaded="loaded" :replacement-num-chars="14">
                                <b>{{ reserveSizeUSD }}</b>
                            </f-placeholder>
                        </span>
                    </div>
                    <div class="flendreservestatus_sizerate_box">
                        <span class="light-text-color">Utilisation rate</span>
                        <span class="flendreservestatus_sizerate_box_value">
                            <f-placeholder :content-loaded="loaded" :replacement-num-chars="14">
                                <b>{{ utilisationRate }}</b> %
                            </f-placeholder>
                        </span>
                    </div>
                </div>
            </div>
            <div class="flendreservestatus_boxes gridauto">
                <div class="flendreservestatus_boxes_box">
                    <h3 class="flendreservestatus_boxes_box_label">Deposit</h3>
                    <div class="flendreservestatus_boxes_box_body">
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Deposit APY</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <f-placeholder :content-loaded="loaded" :replacement-num-chars="6">
                                    <b>{{ depositAPY }}</b> %
                                </f-placeholder>
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Past 30D Avg.</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <f-placeholder :content-loaded="loaded" :replacement-num-chars="6">
                                    <b>{{ depositAPY30d }}</b> %
                                </f-placeholder>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flendreservestatus_boxes_box">
                    <h3 class="flendreservestatus_boxes_box_label">Stable borrowing</h3>
                    <div class="flendreservestatus_boxes_box_body">
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Borrow APR</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <f-placeholder :content-loaded="loaded" :replacement-num-chars="6">
                                    <b>{{ stableBorrowAPR }}</b> %
                                </f-placeholder>
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">% over total</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <f-placeholder :content-loaded="loaded" :replacement-num-chars="6">
                                    <b>{{ stableBorrowAPROverTotal }}</b> %
                                </f-placeholder>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flendreservestatus_boxes_box">
                    <h3 class="flendreservestatus_boxes_box_label">Variable borrowing</h3>
                    <div class="flendreservestatus_boxes_box_body">
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Borrow APR</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <f-placeholder :content-loaded="loaded" :replacement-num-chars="6">
                                    <b>{{ variableBorrowAPR }}</b> %
                                </f-placeholder>
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Past 30D Avg.</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <f-placeholder :content-loaded="loaded" :replacement-num-chars="6">
                                    <b>{{ variableBorrowAPR30d }}</b> %
                                </f-placeholder>
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">% over total</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <f-placeholder :content-loaded="loaded" :replacement-num-chars="6">
                                    <b>{{ variableBorrowAPROverTotal }}</b> %
                                </f-placeholder>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flendreservestatus_info gridauto">
                <div class="flendreservestatus_info_box">
                    <div class="light-text-color">Maximum LTV <f-lend-l-t-v-info /></div>
                    <div>
                        <f-placeholder :content-loaded="loaded" :replacement-num-chars="6">
                            <b>{{ maximumLTV }}</b> %
                        </f-placeholder>
                    </div>
                </div>
                <div class="flendreservestatus_info_box">
                    <div class="light-text-color">Liquidation threshold <f-lend-liquidation-treshold-info /></div>
                    <div>
                        <f-placeholder :content-loaded="loaded" :replacement-num-chars="6">
                            <b>{{ liquidationTreshold }}</b> %
                        </f-placeholder>
                    </div>
                </div>
                <div class="flendreservestatus_info_box">
                    <div class="light-text-color">Liquidation penalty <f-lend-liquidation-penalty /></div>
                    <div>
                        <f-placeholder :content-loaded="loaded" :replacement-num-chars="6">
                            <b>{{ liquidationPenalty }} </b> % ??
                        </f-placeholder>
                    </div>
                </div>
                <div class="flendreservestatus_info_box">
                    <div class="light-text-color">Used as collateral</div>
                    <div>
                        <f-placeholder :content-loaded="loaded" :replacement-num-chars="3">
                            <f-yes-no :value="usedAsColllateral" /> ??
                        </f-placeholder>
                    </div>
                </div>
                <div class="flendreservestatus_info_box">
                    <div class="light-text-color">Stable borrowing</div>
                    <div>
                        <f-placeholder :content-loaded="loaded" :replacement-num-chars="3">
                            <f-yes-no :value="stableBorrowing" />
                        </f-placeholder>
                    </div>
                </div>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCircleProgress from '@/components/core/FCircleProgress/FCircleProgress.vue';
import FCard from '@/components/core/FCard/FCard.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
import FYesNo from '@/components/core/FYesNo/FYesNo.vue';
import FLendLTVInfo from '@/components/flend/infos/FLendLTVInfo.vue';
import FLendLiquidationTresholdInfo from '@/components/flend/infos/FLendLiquidationTresholdInfo.vue';
import FLendLiquidationPenalty from '@/components/flend/infos/FLendLiquidationPenalty.vue';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';

export default {
    name: 'FLendReserveStatus',

    components: {
        FPlaceholder,
        FLendLiquidationPenalty,
        FLendLiquidationTresholdInfo,
        FLendLTVInfo,
        FYesNo,
        FCryptoSymbol,
        FCard,
        FCircleProgress,
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
    },

    data() {
        return {
            totalBorrowed: '??',
            totalBorrowedUSD: '??',
            available: '??',
            availableUSD: '??',
            reserveSizeUSD: '??',
            utilisationRate: '??',
            depositAPY: '??',
            depositAPY30d: '??',
            stableBorrowAPR: 0,
            stableBorrowAPROverTotal: '??',
            variableBorrowAPR: 0,
            variableBorrowAPR30d: '??',
            variableBorrowAPROverTotal: '??',
            maximumLTV: 0,
            liquidationTreshold: 0,
            liquidationPenalty: 0,
            usedAsColllateral: true,
            stableBorrowing: false,
        };
    },

    computed: {
        availableLiquidityValue() {
            return 15;
        },

        loaded() {
            return this.reserve.ID !== undefined;
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
            const { reserve } = this;
            const { $flend } = this;

            if (!reserve.ID) {
                return;
            }

            const configuration = $flend.getReserveConfigurationData(reserve.configuration);

            this.stableBorrowing = configuration.stableBorrowRateEnabled;
            this.liquidationTreshold = configuration.liquidationThreshold / 100;
            this.liquidationPenalty = configuration.liquidationBonus / 100 - 100;
            this.stableBorrowAPR = $flend.fromRay(reserve.currentStableBorrowRate).multipliedBy(100).toFixed(2);
            this.variableBorrowAPR = $flend.fromRay(reserve.currentVariableBorrowRate).multipliedBy(100).toFixed(2);
            this.maximumLTV = configuration.ltv / 100;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
