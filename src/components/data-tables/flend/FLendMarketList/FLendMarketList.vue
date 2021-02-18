<template>
    <div class="flendmarketlist">
        <f-data-table
            :columns="columns"
            :items="items"
            :loading="loading"
            first-m-v-column-width="6"
            f-card-off
            action-on-row
            class="f-data-table-body-bg-color"
            @row-action="onRowAction"
        >
            <template v-slot:column-asset="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <f-crypto-symbol :token="item.asset" />
                    </div>
                </div>
                <template v-else>
                    <f-crypto-symbol :token="item.asset" />
                </template>
            </template>
        </f-data-table>
    </div>
</template>

<script>
import FDataTable from '@/components/core/FDataTable/FDataTable.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
import { sortByHex, sortByNumber, stringSort } from '@/utils/array-sorting.js';
import { formatNumberByLocale } from '@/filters.js';
import { MAX_TOKEN_DECIMALS_IN_TABLES } from '@/plugins/fantom-web3-wallet.js';
import { bFromWei } from '@/utils/bignumber.js';

export default {
    name: 'FLendMarketList',

    components: { FCryptoSymbol, FDataTable },

    data() {
        return {
            items: [],
            columns: [
                {
                    name: 'asset',
                    label: 'Asset',
                    sortFunc: (_itemProp, _direction = 'asc') => {
                        return (_a, _b) => {
                            const a = _a.asset.symbol;
                            const b = _b.asset.symbol;

                            return (_direction === 'desc' ? -1 : 1) * stringSort(a, b);
                        };
                    },
                    sortDir: 'desc',
                    width: '180px',
                },
                {
                    name: 'marketsize',
                    label: 'Market Size',
                    itemProp: '_totalDeposited',
                    sortFunc: sortByNumber,
                    formatter: (_value) => {
                        return _value !== undefined ? formatNumberByLocale(_value, MAX_TOKEN_DECIMALS_IN_TABLES) : '-';
                    },
                },
                {
                    name: 'borrowed',
                    label: 'Total Borrowed',
                    itemProp: '_totalBorrowed',
                    sortFunc: sortByNumber,
                    formatter: (_value) => {
                        return _value !== undefined ? formatNumberByLocale(_value, MAX_TOKEN_DECIMALS_IN_TABLES) : '-';
                    },
                },
                {
                    name: 'depositapy',
                    label: 'Deposit APY',
                    itemProp: 'currentLiquidityRate',
                    formatter: (_value) => {
                        return (
                            formatNumberByLocale(
                                this.$flend.fromRay(_value).multipliedBy(100).toNumber(),
                                undefined,
                                undefined,
                                true
                            ) + ' % ??'
                        );
                    },
                },
                {
                    name: 'variableapr',
                    label: 'Variable Borrow APR',
                    itemProp: 'currentVariableBorrowRate',
                    sortFunc: sortByHex,
                    formatter: (_value) => {
                        return (
                            formatNumberByLocale(
                                this.$flend.fromRay(_value).multipliedBy(100).toNumber(),
                                undefined,
                                undefined,
                                true
                            ) + ' %'
                        );
                    },
                },
                {
                    name: 'stableapr',
                    label: 'Stable Borrow APR',
                    itemProp: 'currentStableBorrowRate',
                    sortFunc: sortByHex,
                    formatter: (_value) => {
                        return (
                            formatNumberByLocale(
                                this.$flend.fromRay(_value).multipliedBy(100).toNumber(),
                                undefined,
                                undefined,
                                true
                            ) + ' %'
                        );
                    },
                },
            ],
            loading: true,
        };
    },

    created() {
        this.init();
    },

    methods: {
        async init() {
            const reserves = await this.$flend.fetchReservesWithAsset();

            this.loading = false;
            this.items = reserves;

            this.loadMarketSize();
            this.loadTotalBorrowed();
        },

        async loadMarketSize() {
            const { items } = this;
            const { $flend } = this;
            let totalDeposited;

            for (let i = 0, len1 = items.length; i < len1; i++) {
                totalDeposited = await $flend.fetchTotalDeposited(items[i]);
                this.$set(items[i], '_totalDeposited', bFromWei(totalDeposited).toNumber());
            }
        },

        async loadTotalBorrowed() {
            const { items } = this;
            const { $flend } = this;
            let totalBorrowed;

            for (let i = 0, len1 = items.length; i < len1; i++) {
                totalBorrowed = await $flend.fetchTotalBorrowed(items[i]);
                this.$set(items[i], '_totalBorrowed', bFromWei(totalBorrowed).toNumber());
            }
        },

        /**
         * @param {{proposal: GovernanceProposal}} _item
         */
        onRowAction(_item) {
            this.$router.push({
                name: 'f-lend-reserve-detail',
                params: {
                    assetAddress: _item.assetAddress,
                },
            });
        },
    },
};
</script>
