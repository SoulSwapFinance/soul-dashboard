<template>
    <div class="view-defi-flend">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> fLend</h1>

        <h2 class="perex">Earn interest on loans. Borrow tokens to trade.</h2>

        <div class="grid">
            <div>
                <h2>
                    <router-link :to="{ name: 'defi-manage-deposit' }" class="btn secondary large btn-large-font">
                        Deposit
                    </router-link>
                </h2>
                <div class="df-data-item smaller">
                    <h3 class="label">Total Deposit</h3>
                    <div class="value">{{ totalDeposit.toFixed(2) }} <span class="currency">fUSD</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Earnings</h3>
                    <div class="value">{{ earnings }} <span class="currency">fUSD</span></div>
                </div>
            </div>
            <div class="limit-col align-center">
                <h2>
                    Debt Limit
                    <!--
                    <f-info window-closeable window-class="light">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    </f-info>
                    -->
                </h2>
                <f-circle-progress
                    show-percentage
                    :stroke-width="6"
                    :animate="false"
                    :colors="colors"
                    :value="debtLimit"
                />
            </div>
            <div class="align-right">
                <h2>
                    <router-link :to="{ name: 'defi-manage-borrow' }" class="btn secondary large btn-large-font">
                        Borrow
                    </router-link>
                </h2>
                <div class="df-data-item smaller">
                    <h3 class="label">Total Borrowed</h3>
                    <div class="value">{{ totalBorrowed.toFixed(2) }} <span class="currency">fUSD</span></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Borrow limit</h3>
                    <div class="value">{{ borrowLimit.toFixed(2) }} <span class="currency">fUSD</span></div>
                </div>
            </div>
            <!--
            <f-message v-if="closeToLiquidation" type="error" role="alert" class="big">
                You're getting close to your liquidation price. <br />
                Please rebalance your collateral.
            </f-message>
            -->
        </div>

        <!--
        <div class="tmp">
            <div>Overall debt: {{ $defi.getOverallDebt(defiAccount) }}</div>
            <div>Overall collateral: {{ $defi.getOverallCollateral(defiAccount) }}</div>
            <div>
                Overall collateral / debt:
                {{ $defi.getOverallCollateral(defiAccount) / $defi.getOverallDebt(defiAccount) }}
            </div>
            <div>Borrow limit: {{ $defi.getBorrowLimit(defiAccount) }}</div>
        </div>
-->

        <div class="defi-tabs">
            <f-tabs>
                <template #deposit>
                    <b>
                        Deposit to Liquidity
                        <span class="f-records-count">({{ depositRecordsCount }})</span>
                    </b>
                </template>
                <template #borrow>
                    <b>
                        Available to borrow
                        <span class="f-records-count">({{ borrowRecordsCount }})</span>
                    </b>
                </template>
                <template #positions>
                    <b>
                        Open positions
                        <span class="f-records-count">({{ positionsRecordsCount }})</span>
                    </b>
                </template>

                <f-tab title-slot="deposit">
                    <suply-to-liquidity-list
                        :tokens="tokens"
                        :defi-account="defiAccount"
                        @records-count="onDepositRecordsCount"
                    />
                </f-tab>
                <f-tab title-slot="borrow">
                    <available-to-borrow-list
                        :tokens="tokens"
                        :defi-account="defiAccount"
                        @records-count="onBorrowRecordsCount"
                    />
                </f-tab>
                <f-tab title-slot="positions">
                    <open-positions-list
                        :tokens="tokens"
                        :defi-account="defiAccount"
                        @records-count="onPositionsRecordsCount"
                    />
                </f-tab>
            </f-tabs>
        </div>
    </div>
</template>

<script>
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import FCircleProgress from '../../components/core/FCircleProgress/FCircleProgress.vue';
import { getUniqueId } from '../../utils';
import { mapGetters } from 'vuex';
import { eventBusMixin } from '../../mixins/event-bus.js';
import FTabs from '../../components/core/FTabs/FTabs.vue';
import FTab from '../../components/core/FTabs/FTab.vue';
import SuplyToLiquidityList from '@/components/data-tables/SuplyToLiquidity/SuplyToLiquidityList.vue';
import AvailableToBorrowList from '@/components/data-tables/AvailableToBorrowList/AvailableToBorrowList.vue';
import OpenPositionsList from '@/components/data-tables/OpenPositionsList/OpenPositionsList.vue';

export default {
    name: 'DefiFLend',

    components: {
        OpenPositionsList,
        AvailableToBorrowList,
        SuplyToLiquidityList,
        FTab,
        FTabs,
        FCircleProgress,
        FBackButton,
    },

    mixins: [eventBusMixin],

    data() {
        return {
            /** @type {DefiAccount} */
            defiAccount: {
                collateral: [],
                debt: [],
            },
            /** @type {DefiToken[]} */
            tokens: [],
            depositRecordsCount: 0,
            borrowRecordsCount: 0,
            positionsRecordsCount: 0,
            id: getUniqueId(),
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        totalDeposit() {
            return this.$defi.getOverallCollateral(this.defiAccount);
        },

        earnings() {
            return '-';
        },

        totalBorrowed() {
            return this.$defi.getOverallDebt(this.defiAccount);
        },

        borrowLimit() {
            return this.$defi.getBorrowLimit(this.defiAccount) + this.totalBorrowed;
        },

        debtLimit() {
            return this.$defi.getDebtLimit(this.defiAccount);
        },

        colors() {
            return this.$defi.getColors();
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-flend');

            return parentNode ? parentNode.route : '';
        },
    },

    created() {
        this.init();

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        async init() {
            const { $defi } = this;
            const result = await Promise.all([
                $defi.fetchDefiAccount(this.currentAccount.address),
                $defi.fetchTokens(this.currentAccount.address),
                $defi.init(),
            ]);

            this.defiAccount = result[0];
            this.tokens = result[1];
        },

        onDepositRecordsCount(_count) {
            this.depositRecordsCount = _count;
        },

        onBorrowRecordsCount(_count) {
            this.borrowRecordsCount = _count;
        },

        onPositionsRecordsCount(_count) {
            this.positionsRecordsCount = _count;
        },

        onAccountPicked() {
            this.init();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
