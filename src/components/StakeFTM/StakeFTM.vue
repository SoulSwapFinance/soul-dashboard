<template>
    <div class="stake-ftm">
        <f-card class="f-card-double-padding f-data-layout">
            <h2>Staking</h2>

            <div class="row no-vert-col-padding collapse-md">
                <div class="col">
                    <div class="row no-collapse">
                        <div class="col f-row-label">Delegated</div>
                        <div class="col">
                            <div v-show="accountInfo">
                                <template v-if="accountInfo">{{ toFTM(accountInfo.delegated) }} FTM</template>
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col f-row-label">Pending Rewards</div>
                        <div class="col">
                            <div v-show="accountInfo">
                                <template v-if="accountInfo">{{ toFTM(accountInfo.pendingRewards) }} FTM</template>
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col f-row-label">Claimed Rewards</div>
                        <div class="col">
                            <div v-show="accountInfo">
                                <template v-if="accountInfo">{{ toFTM(accountInfo.claimedRewards) }} FTM</template>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div v-show="stakerInfo" class="row no-collapse">
                        <div class="col f-row-label">Staker Name</div>
                        <div class="col">
                            <div v-show="stakerInfo">
                                <a
                                    v-if="stakerInfo"
                                    :href="`${eplorerUrl}validator/${stakerInfo.stakerAddress}`"
                                    target="_blank"
                                    >{{ stakerInfo.stakerInfo.name }}</a
                                >
                            </div>
                        </div>
                    </div>
                    <div v-show="accountInfo && accountInfo.stakerId" class="row no-collapse">
                        <div class="col f-row-label">Staker Id</div>
                        <div class="col">
                            <div v-show="accountInfo">
                                <template v-if="accountInfo">{{ accountInfo.stakerId }}</template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import { mapGetters } from 'vuex';
import { toFTM } from '../../utils/transactions.js';
import { formatHexToInt } from '../../filters.js';
import appConfig from '../../../app.config.js';

export default {
    name: 'StakeFTM',

    components: { FCard },

    data() {
        return {
            eplorerUrl: appConfig.explorerUrl,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    asyncComputed: {
        async accountInfo() {
            const accountInfo = await this.$fWallet.getBalance(this.currentAccount.address, true);
            const { delegation } = accountInfo;

            accountInfo.delegated = delegation ? delegation.amount : 0;
            accountInfo.pendingRewards = delegation ? delegation.pendingRewards.amount : 0;
            accountInfo.claimedRewards = delegation ? delegation.claimedReward : 0;

            accountInfo.stakerId = delegation ? formatHexToInt(delegation.toStakerId) : 0;
            accountInfo.stakerIdHex = delegation ? delegation.toStakerId : '0x0';

            return accountInfo;
        },

        async stakerInfo() {
            const { accountInfo } = this;

            return accountInfo && accountInfo.stakerId
                ? await this.$fWallet.getStakerById(accountInfo.stakerIdHex)
                : null;
        },
    },

    methods: {
        toFTM,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
