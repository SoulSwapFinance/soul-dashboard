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
import { stringSort } from '@/utils/array-sorting.js';
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
                    formatter: (_value, _item) => {
                        return formatNumberByLocale(
                            bFromWei(_item._totalDeposited).toNumber(),
                            MAX_TOKEN_DECIMALS_IN_TABLES
                        );
                    },
                },
                {
                    name: 'borrowed',
                    label: 'Total Borrowed',
                    itemProp: '_totalBorrowed',
                    formatter: (_value) => {
                        return _value !== undefined ? _value : '-';
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
            const reserves = await this.$flend.fetchReservesWithERC20Info();

            this.loading = false;
            this.items = reserves;

            let totalBorrowed;

            for (let i = 0, len1 = this.items.length; i < len1; i++) {
                totalBorrowed = await this.$flend.fetchTotalBorrowed(this.items[i]);
                this.$set(this.items[i], '_totalBorrowed', bFromWei(totalBorrowed).toNumber());
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
