<template>
    <div class="flendreserveoverview">
        <f-card>
            <div class="flendreserveoverview_label">
                <f-crypto-symbol :token="reserve.erc20Info" img-width="16px" img-height="16px" /> Reserve Overview
            </div>
            <div class="flendreserveoverview_body gridauto">
                <template v-if="!borrow">
                    <div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">Utilization rate</div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ utilisationRate }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-5 light-text-color fs-80">Available liquidity</div>
                            <div class="col-7 flendreserveoverview_value"><b>6,834,233.97004</b> {{ tokenSymbol }}</div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">Deposit APY</div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ depositAPY }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">Can be used as collateral</div>
                            <div class="col-4 flendreserveoverview_value"><f-yes-no :value="usedAsColllateral" /></div>
                        </div>
                    </div>
                    <div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-5 light-text-color fs-80">Asset price</div>
                            <div class="col-7 flendreserveoverview_value">
                                <b>{{ assetPrice }}</b> USD
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">
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
                                        The Maximum Loan-to-Value ratio represents the maximum borrowing power of a
                                        specific collateral. For example, if a collateral has a LTV of 75%, the user can
                                        borrow up to 0.75 worth of ETH in the principal currency for every 1 ETH worth
                                        of collateral.
                                    </p>
                                </f-info>
                            </div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ maximumLTV }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">
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
                                        undercollateralized and subject to liquidation for each collateral. For example,
                                        if a collateral has a liquidation threshold of 80%, it means that the loan will
                                        be liquidated when the debt value is worth 80% of the collateral value.
                                    </p>
                                </f-info>
                            </div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ liquidationTreshold }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">
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
                                        When a liquidation occurs, liquidators repay part or all of the outstanding
                                        borrowed amount on behalf of the borrower. In return, they can buy the
                                        collateral at a discount and keep the difference as a bonus!
                                    </p>
                                </f-info>
                            </div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ liquidationPenalty }}</b> %
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-8 light-text-color fs-80">Utilization rate</div>
                            <div class="col-4 flendreserveoverview_value">
                                <b>{{ utilisationRate }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-5 light-text-color fs-80">Available liquidity</div>
                            <div class="col-7 flendreserveoverview_value"><b>6,834,233.97004</b> {{ tokenSymbol }}</div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col-5 light-text-color fs-80">Asset price</div>
                            <div class="col-7 flendreserveoverview_value">
                                <b>{{ assetPrice }}</b> USD
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Stable borrow APR</div>
                            <div class="col flendreserveoverview_value">
                                <b>{{ stableBorrowAPR }}</b> %
                            </div>
                        </div>
                        <div class="row no-collapse align-items-center">
                            <div class="col light-text-color fs-80">Variable borrow APR</div>
                            <div class="col flendreserveoverview_value">
                                <b>{{ variableBorrowAPR }}</b> %
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
import FInfo from '@/components/core/FInfo/FInfo.vue';
import FYesNo from '@/components/core/FYesNo/FYesNo.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';

export default {
    name: 'FLendReserveOverview',

    components: { FCryptoSymbol, FYesNo, FInfo, FCard },

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
        /** Specifies if show reserve borrow info */
        borrow: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            utilisationRate: 98.59,
            depositAPY: 14.97,
            depositAPY30d: 9.87,
            assetPrice: '$1',
            maximumLTV: 80,
            liquidationTreshold: 82.5,
            liquidationPenalty: 5,
            usedAsColllateral: true,
            stableBorrowAPR: 30.35,
            variableBorrowAPR: 25.35,
            variableBorrowAPR30d: 14.96,
        };
    },

    computed: {
        tokenSymbol() {
            return this.$defi.getTokenSymbol(this.reserve.erc20Info);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
