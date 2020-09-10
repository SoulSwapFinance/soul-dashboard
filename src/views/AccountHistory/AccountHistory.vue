<template>
    <div class="view-account-history account-main-content-mt">
        <f-tabs>
            <template #transactions>
                Transactions
                <span class="f-records-count">({{ transactionsRecordsCount }})</span>
            </template>
            <template #assets>
                Assets
                <span class="f-records-count">({{ assetsRecordsCount }})</span>
            </template>

            <f-tab title-slot="transactions">
                <account-transaction-list
                    :key="currentAccount.address"
                    :address="currentAccount.address"
                    @records-count="onTransactionsRecordsCount"
                />
            </f-tab>
            <f-tab title-slot="assets">
                <f-card>
                    <assets-list
                        :tokens="tokens"
                        :f-mint-account="fMintAccount"
                        @records-count="onAssetsRecordsCount"
                    />
                </f-card>
            </f-tab>
        </f-tabs>
    </div>
</template>

<script>
import AccountTransactionList from '@/components/data-tables/AccountTransactionList.vue';
import { mapGetters } from 'vuex';
import FTabs from '@/components/core/FTabs/FTabs.vue';
import FTab from '@/components/core/FTabs/FTab.vue';
import AssetsList from '@/components/data-tables/AssetsList/AssetsList.vue';
import FCard from '@/components/core/FCard/FCard.vue';
import { eventBusMixin } from '@/mixins/event-bus.js';

export default {
    name: 'AccountHistory',

    components: { FCard, AssetsList, FTab, FTabs, AccountTransactionList },

    mixins: [eventBusMixin],

    data() {
        return {
            /** @type {FMintAccount} */
            fMintAccount: {
                collateral: [],
                debt: [],
            },
            /** @type {DefiToken[]} */
            tokens: [],
            transactionsRecordsCount: 0,
            assetsRecordsCount: 0,
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
            const { $defi } = this;
            const result = await Promise.all([
                $defi.fetchFMintAccount(this.currentAccount.address),
                $defi.fetchTokens(this.currentAccount.address),
                $defi.init(),
            ]);

            this.fMintAccount = result[0];
            this.tokens = result[1];
        },

        onTransactionsRecordsCount(_count) {
            this.transactionsRecordsCount = _count;
        },

        onAssetsRecordsCount(_count) {
            this.assetsRecordsCount = _count;
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
