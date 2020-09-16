<template>
    <div class="view-defi-flend">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> fLend</h1>

        <h2 class="perex">Earn interest on loans. Borrow tokens to trade.</h2>

        <div class="grid">
            <div>
                <h2>Deposit</h2>
                <div class="df-data-item smaller">
                    <h3 class="label">Total Deposit</h3>
                    <div class="value"><f-token-value :token="fusdToken" :value="totalDeposit" /></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Earnings</h3>
                    <div class="value">
                        -
                        <!--<f-token-value :token="fusdToken" :value="earnings" />-->
                    </div>
                </div>
            </div>
            <div class="limit-col align-center">
                <h2>Debt Limit <debt-limit-f-info /></h2>
                <f-circle-progress
                    show-percentage
                    :stroke-width="6"
                    :animate="false"
                    :colors="colors"
                    :value="debtLimit"
                />
            </div>
            <div class="align-right">
                <h2>Debt</h2>
                <div class="df-data-item smaller">
                    <h3 class="label">Total Borrowed</h3>
                    <div class="value"><f-token-value :token="fusdToken" :value="totalBorrowed" /></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Borrow limit</h3>
                    <div class="value"><f-token-value :token="fusdToken" :value="borrowLimit" /></div>
                </div>
            </div>
            <!--
            <f-message v-if="closeToLiquidation" type="error" role="alert" class="big">
                You're getting close to your liquidation price. <br />
                Please rebalance your collateral.
            </f-message>
            -->
        </div>

        <div class="form-buttons">
            <router-link :to="{ name: 'defi-manage-deposit' }" class="btn large">
                Deposit/Withdraw
            </router-link>
            <router-link :to="{ name: 'defi-manage-borrow' }" class="btn large">
                Borrow/Repay
            </router-link>
        </div>

        <div class="defi-tabs">
            <f-tabs>
                <template #deposit>
                    Deposit to Liquidity
                    <span class="f-records-count">({{ depositRecordsCount }})</span>
                </template>
                <template #borrow>
                    Available to borrow
                    <span class="f-records-count">({{ borrowRecordsCount }})</span>
                </template>
                <template #positions>
                    Open positions
                    <span class="f-records-count">({{ positionsRecordsCount }})</span>
                </template>

                <f-tab title-slot="deposit">
                    <suply-to-liquidity-list
                        :tokens="tokens"
                        :f-mint-account="fMintAccount"
                        @records-count="onDepositRecordsCount"
                    />
                </f-tab>
                <f-tab title-slot="borrow">
                    <available-to-borrow-list
                        :tokens="tokens"
                        :f-mint-account="fMintAccount"
                        @records-count="onBorrowRecordsCount"
                    />
                </f-tab>
                <f-tab title-slot="positions">
                    <open-positions-list
                        :tokens="tokens"
                        :f-mint-account="fMintAccount"
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
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import DebtLimitFInfo from '@/components/DebLimitFInfo/DebtLimitFInfo.vue';

export default {
    name: 'DefiFLend',

    components: {
        DebtLimitFInfo,
        FTokenValue,
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
            /** @type {FMintAccount} */
            fMintAccount: {
                collateral: [],
                debt: [],
            },
            /** @type {DefiToken} */
            fusdToken: {},
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
            return this.$defi.getOverallCollateral(this.fMintAccount);
        },

        earnings() {
            return 0;
        },

        totalBorrowed() {
            return this.$defi.getOverallDebt(this.fMintAccount);
        },

        borrowLimit() {
            return this.$defi.getBorrowLimit(this.fMintAccount) + this.totalBorrowed;
        },

        debtLimit() {
            return this.$defi.getDebtLimit(this.fMintAccount);
        },

        colors() {
            return this.$defi.getDebtLimitColors();
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
                $defi.fetchFMintAccount(this.currentAccount.address),
                $defi.fetchTokens(this.currentAccount.address),
                $defi.init(),
            ]);

            this.fMintAccount = result[0];
            this.tokens = result[1];
            this.fusdToken = this.tokens.find((_item) => _item.symbol === 'FUSD');
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
