<template>
    <div class="flendborrowlist">
        <f-data-table
            :columns="columns"
            :items="items"
            :loading="loading"
            first-m-v-column-width="6"
            f-card-off
            class="f-data-table-body-bg-color"
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

            <template v-slot:column-actions="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <router-link
                            :to="{ name: 'f-lend-borrow-detail', params: { assetAddress: item.assetAddress } }"
                        >
                            Borrow
                        </router-link>
                        ,
                        <router-link
                            v-if="canRepay(item)"
                            :to="{ name: 'f-lend-repay-detail', params: { assetAddress: item.assetAddress } }"
                        >
                            Repay
                        </router-link>
                    </div>
                </div>
                <template v-else>
                    <router-link :to="{ name: 'f-lend-borrow-detail', params: { assetAddress: item.assetAddress } }">
                        Borrow
                    </router-link>
                    <router-link
                        v-if="canRepay(item)"
                        :to="{ name: 'f-lend-repay-detail', params: { assetAddress: item.assetAddress } }"
                    >
                        Repay
                    </router-link>
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
import { eventBusMixin } from '@/mixins/event-bus.js';

export default {
    name: 'FLendBorrowList',

    components: { FCryptoSymbol, FDataTable },

    mixins: [eventBusMixin],

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
                {
                    name: 'actions',
                    label: 'Actions',
                    width: '120px',
                    css: { textAlign: 'right' },
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

        this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        async init() {
            const reserves = await this.$flend.fetchReservesWithAsset(
                this.currentAccount ? this.currentAccount.address : ''
            );

            this.loading = false;
            this.items = reserves;
        },

        /**
         * @param {FLendReserve} _reserve
         * @return {boolean}
         */
        canRepay(_reserve) {
            console.log(_reserve);
            return false;
        },

        onAccountPicked() {
            this.init();
        },
    },
};
</script>
