<template>
    <div class="flendborrowlist">
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
                        <f-crypto-symbol :token="item.erc20Info" />
                    </div>
                </div>
                <template v-else>
                    <f-crypto-symbol :token="item.erc20Info" />
                </template>
            </template>
        </f-data-table>
    </div>
</template>

<script>
import FDataTable from '@/components/core/FDataTable/FDataTable.vue';
import FCryptoSymbol from '@/components/core/FCryptoSymbol/FCryptoSymbol.vue';
import { stringSort } from '@/utils/array-sorting.js';
import { mapGetters } from 'vuex';

export default {
    name: 'FLendBorrowList',

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
                            const a = _a.erc20Info.symbol;
                            const b = _b.erc20Info.symbol;

                            return (_direction === 'desc' ? -1 : 1) * stringSort(a, b);
                        };
                    },
                    sortDir: 'desc',
                    width: '180px',
                },
                {
                    name: 'balance',
                    label: 'Available to borrow',
                    formatter: () => {
                        return '-';
                    },
                },
                {
                    name: 'borrows',
                    label: 'Your borrows',
                    formatter: () => {
                        return '-';
                    },
                },
                {
                    name: 'variableapr',
                    label: 'Variable APR',
                    formatter: () => {
                        return '-';
                    },
                },
                {
                    name: 'stableapr',
                    label: 'Stable APR',
                    formatter: () => {
                        return '-';
                    },
                },
            ],
            loading: true,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    created() {
        this.init();
    },

    methods: {
        async init() {
            const reserves = await this.$flend.fetchReservesWithERC20Info(
                this.currentAccount ? this.currentAccount.address : ''
            );

            this.loading = false;
            this.items = reserves;
        },

        /**
         * @param {{proposal: GovernanceProposal}} _item
         */
        onRowAction(_item) {
            this.$router.push({
                name: 'f-lend-borrow-detail',
                params: {
                    assetAddress: _item.assetAddress,
                },
            });
        },
    },
};
</script>
