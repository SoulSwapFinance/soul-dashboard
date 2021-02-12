<template>
    <div class="flendreservestatus">
        <f-card>
            <div class="flendreservestatus_top">
                <div class="flendreservestatus_reserve">
                    <div class="flendreservestatus_reserve_borrowed">
                        <div class="light-text-color">Total Borrowed</div>
                        <div class="flendreservestatus_reserve_value">{{ totalBorrowed }}</div>
                        <div class="light-text-color">{{ totalBorrowedUSD }}</div>
                    </div>
                    <div class="flendreservestatus_reserve_circle">
                        <div class="flendreservestatus_reserve_circle_wrap">
                            <f-circle-progress :value="availableLiquidityValue" :show-value="false" />
                            <f-crypto-symbol :token="reserve.erc20Info" no-symbol />
                        </div>
                    </div>
                    <div class="flendreservestatus_reserve_liquidity">
                        <div class="light-text-color">Available Liquidity</div>
                        <div class="flendreservestatus_reserve_value">{{ available }}</div>
                        <div class="light-text-color">{{ availableUSD }}</div>
                    </div>
                </div>
                <div class="flendreservestatus_sizerate">
                    <div class="flendreservestatus_sizerate_box">
                        <span class="light-text-color">Reserve size</span>
                        <span class="flendreservestatus_sizerate_box_value">
                            <b>{{ reserveSizeUSD }}</b>
                        </span>
                    </div>
                    <div class="flendreservestatus_sizerate_box">
                        <span class="light-text-color">Utilisation rate</span>
                        <span class="flendreservestatus_sizerate_box_value">
                            <b>{{ utilisationRate }}</b> %
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
                                <b>{{ depositAPY }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Past 30D Avg.</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <b>{{ depositAPY30d }}</b> %
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
                                <b>{{ stableBorrowAPR }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">% over total</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <b>{{ stableBorrowAPROverTotal }}</b> %
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
                                <b>{{ variableBorrowAPR }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Past 30D Avg.</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <b>{{ variableBorrowAPR30d }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">% over total</div>
                            <div class="col flendreservestatus_boxes_box_value">
                                <b>{{ variableBorrowAPROverTotal }}</b> %
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flendreservestatus_info gridauto">
                <div class="flendreservestatus_info_box">
                    <div class="light-text-color">
                        Maximum LTV
                        <f-info
                            window-closeable
                            window-class="light"
                            window-style="max-width: 500px;"
                            window-title="Loan to Value (LTV) Ratio"
                            icon-size="16"
                            class="debt-limit-f-info"
                        >
                            <p>
                                The Maximum Loan-to-Value ratio represents the maximum borrowing power of a specific
                                collateral. For example, if a collateral has a LTV of 75%, the user can borrow up to
                                0.75 worth of ETH in the principal currency for every 1 ETH worth of collateral.
                            </p>
                        </f-info>
                    </div>
                    <div>
                        <b>{{ maximumLTV }}</b> %
                    </div>
                </div>
                <div class="flendreservestatus_info_box">
                    <div class="light-text-color">
                        Liquidation threshold
                        <f-info
                            window-closeable
                            window-class="light"
                            window-style="max-width: 500px;"
                            window-title="Liquidation threshold"
                            icon-size="16"
                            class="debt-limit-f-info"
                        >
                            <p>
                                This represents the threshold at which a borrow position will be considered
                                undercollateralized and subject to liquidation for each collateral. For example, if a
                                collateral has a liquidation threshold of 80%, it means that the loan will be liquidated
                                when the debt value is worth 80% of the collateral value.
                            </p>
                        </f-info>
                    </div>
                    <div>
                        <b>{{ liquidationTreshold }}</b> %
                    </div>
                </div>
                <div class="flendreservestatus_info_box">
                    <div class="light-text-color">
                        Liquidation penalty
                        <f-info
                            window-closeable
                            window-class="light"
                            window-style="max-width: 500px;"
                            window-title="Liquidation penalty"
                            icon-size="16"
                            class="debt-limit-f-info"
                        >
                            <p>
                                When a liquidation occurs, liquidators repay part or all of the outstanding borrowed
                                amount on behalf of the borrower. In return, they can buy the collateral at a discount
                                and keep the difference as a bonus!
                            </p>
                        </f-info>
                    </div>
                    <div>
                        <b>{{ liquidationPenalty }}</b> %
                    </div>
                </div>
                <div class="flendreservestatus_info_box">
                    <div class="light-text-color">Used as collateral</div>
                    <div><f-yes-no :value="usedAsColllateral" /></div>
                </div>
                <div class="flendreservestatus_info_box">
                    <div class="light-text-color">Stable borrowing</div>
                    <div><f-yes-no :value="stableBorrowing" /></div>
                </div>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCircleProgress from '@/components/core/FCircleProgress/FCircleProgress.vue';
import FCard from '@/components/core/FCard/FCard.vue';
import FInfo from '@/components/core/FInfo/FInfo.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
import FYesNo from '@/components/core/FYesNo/FYesNo.vue';

export default {
    name: 'FLendReserveStatus',

    components: { FYesNo, FCryptoSymbol, FInfo, FCard, FCircleProgress },

    props: {
        /** @type {FLendReserve} */
        reserve: {
            type: Object,
            default() {
                return {
                    erc20Info: {},
                };
            },
        },
    },

    data() {
        return {
            totalBorrowed: 123123,
            totalBorrowedUSD: '$1,783,695.65',
            available: 123,
            availableUSD: '$783,695.65',
            reserveSizeUSD: '$1,809,258.81',
            utilisationRate: 98.59,
            depositAPY: 14.97,
            depositAPY30d: 9.87,
            stableBorrowAPR: 30.35,
            stableBorrowAPROverTotal: 49.79,
            variableBorrowAPR: 25.35,
            variableBorrowAPR30d: 14.96,
            variableBorrowAPROverTotal: 50.21,
            maximumLTV: 80,
            liquidationTreshold: 82.5,
            liquidationPenalty: 5,
            usedAsColllateral: true,
            stableBorrowing: false,
        };
    },

    computed: {
        availableLiquidityValue() {
            return 15;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
