<template>
    <div class="defi-home-tabs account-main-content-mt">
        <div v-if="showTabs" class="defi-tabs">
            <f-tabs>
                <template #assets>
                    Assets
                    <span class="f-records-count">({{ assetsRecordsCount }})</span>
                </template>
                <template #positions>
                    Positions
                    <span class="f-records-count">({{ positionsRecordsCount }})</span>
                </template>

                <f-tab title-slot="assets">
                    <assets-list
                        defi-assets-list
                        :tokens="tokens"
                        :f-mint-account="fMintAccount"
                        @records-count="onAssetsRecordsCount"
                    />
                </f-tab>
                <f-tab title-slot="positions">
                    <positions-list
                        :tokens="tokens"
                        :f-mint-account="fMintAccount"
                        deposit-route-name="defi-lock-unlock"
                        borrow-route-name="defi-mint-repay"
                        @records-count="onPositionsRecordsCount"
                    />
                </f-tab>
            </f-tabs>
        </div>
    </div>
</template>

<script>
import FTabs from '@/components/core/FTabs/FTabs.vue';
import FTab from '@/components/core/FTabs/FTab.vue';
import { eventBusMixin } from '@/mixins/event-bus.js';
import { mapGetters } from 'vuex';
import AssetsList from '@/components/data-tables/AssetsList/AssetsList.vue';
import PositionsList from '@/components/data-tables/PositionsList/PositionsList.vue';

export default {
    name: 'DefiHomeTabs',

    components: { PositionsList, AssetsList, FTab, FTabs },

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
            assetsRecordsCount: 0,
            positionsRecordsCount: 0,
            showTabs: true,
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

        onAssetsRecordsCount(_count) {
            this.assetsRecordsCount = _count;
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
