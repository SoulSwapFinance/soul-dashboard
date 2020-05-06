<template>
    <div ref="doc" class="stake-ftm" tabindex="0">
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
                    <div class="row no-collapse">
                        <div class="col f-row-label">Validator</div>
                        <div class="col">
                            <div v-if="stakerInfo">
                                <a
                                    v-if="stakerInfo"
                                    :href="`${eplorerUrl}validator/${stakerInfo.stakerAddress}`"
                                    target="_blank"
                                >
                                    {{ stakerInfo.stakerInfo.name }}
                                </a>
                            </div>
                            <template v-else>-</template>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col f-row-label">Validator Id</div>
                        <div class="col">
                            <div v-show="accountInfo">
                                <template v-if="accountInfo">{{ accountInfo.stakerId || '-' }}</template>
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col f-row-label">Delegation Time</div>
                        <div class="col">
                            <div v-show="accountInfo">
                                <template v-if="accountInfo">
                                    {{
                                        accountInfo.createdTime && accountInfo.createdTime !== '0x0'
                                            ? formatDate(timestampToDate(accountInfo.createdTime), false, true)
                                            : '-'
                                    }}
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col align-center form-buttons">
                    <template v-if="stakerInfo">
                        <template v-if="accountInfo && accountInfo.preparedForWithdrawal">
                            <h3 class="align-center">
                                Your {{ toFTM(accountInfo.delegated) }} Opera FTM is available for withdraw in 7 days.
                            </h3>
                        </template>
                        <template v-else>
                            <button class="btn large" disabled @click="claimRewards()">Claim Rewards</button>
                            <button class="btn large" @click="unstake()">Undelegate</button>
                        </template>
                    </template>
                    <template v-else>
                        <button class="btn large" @click="stake()">Delegate</button>
                    </template>
                </div>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import { mapGetters } from 'vuex';
import { toFTM } from '../../utils/transactions.js';
import { formatHexToInt, timestampToDate, formatDate } from '../../filters.js';
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
            accountInfo.createdTime = delegation ? delegation.createdTime : '';

            accountInfo.preparedForWithdrawal =
                delegation &&
                delegation.pendingRewards.amount === '0x0' &&
                delegation.pendingRewards.fromEpoch === '0x0' &&
                delegation.pendingRewards.toEpoch === '0x0';

            return accountInfo;
        },

        async stakerInfo() {
            const { accountInfo } = this;

            return accountInfo && accountInfo.stakerId
                ? await this.$fWallet.getStakerById(accountInfo.stakerIdHex)
                : null;
        },
    },

    mounted() {
        this.$refs.doc.focus();
    },

    methods: {
        stake() {
            this.$emit('change-component', {
                to: 'stake-form',
                from: 'stake-f-t-m',
            });
        },

        async unstake() {
            const accountInfo = await this.accountInfo;
            const stakerInfo = await this.stakerInfo;

            this.$emit('change-component', {
                to: 'unstake-f-t-m',
                from: 'stake-f-t-m',
                data: {
                    accountInfo: {
                        ...accountInfo,
                        stakerInfo,
                    },
                },
            });
        },

        claimRewards() {
            alert('not implemented yet');
        },

        toFTM,
        timestampToDate,
        formatDate,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
