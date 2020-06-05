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
                                    :href="`${explorerUrl}validator/${stakerInfo.stakerAddress}`"
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
                            <!--
                            <h3 class="align-center">
                                Your {{ toFTM(accountInfo.delegated) }} Opera FTM is available for withdraw in 7 days.
                            </h3>
                            -->
                        </template>
                        <template v-else>
                            <button class="btn large" :disabled="canIncreaseDelegation" @click="claimRewards()">
                                Claim Rewards
                            </button>
                            <button class="btn large" :disabled="!canIncreaseDelegation" @click="increaseDelegation()">
                                Increase Delegation
                            </button>
                            <button class="btn large" :disabled="!canUndelegate" @click="undelegate()">
                                Undelegate
                            </button>

                            <f-message v-if="!canIncreaseDelegation" type="info" with-icon class="align-left">
                                You can claim rewards for a maximum of 200 epochs. <br />
                                If you have more than 200 epochs of pending rewards, please use the claim function
                                repeatedly.
                            </f-message>
                        </template>
                    </template>
                    <template v-else>
                        <button class="btn large" @click="stake()">Delegate</button>
                    </template>
                </div>
            </div>
        </f-card>

        <f-card v-if="withdrawRequests.length" class="f-card-double-padding account-main-content-mt">
            <h2>Undelegations History</h2>

            <withdraw-request-list :items="withdrawRequests" @withdraw-request-selected="onWithdrawRequestSelected" />
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import { mapGetters } from 'vuex';
import { toFTM } from '../../utils/transactions.js';
import { formatHexToInt, timestampToDate, formatDate } from '../../filters.js';
import appConfig from '../../../app.config.js';
import WithdrawRequestList from '../data-tables/WithdrawRequestList.vue';
import FMessage from '../core/FMessage/FMessage.vue';

export default {
    name: 'StakingInfo',

    components: { FMessage, WithdrawRequestList, FCard },

    data() {
        return {
            explorerUrl: appConfig.explorerUrl,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        canIncreaseDelegation() {
            const { accountInfo } = this;

            return accountInfo && accountInfo.pendingRewards && accountInfo.pendingRewards === '0x0';
        },

        canUndelegate() {
            const { accountInfo } = this;

            return accountInfo && accountInfo.pendingRewards && accountInfo.pendingRewards === '0x0';
        },

        withdrawRequests() {
            const { accountInfo } = this;
            const requests = [];

            if (accountInfo) {
                if (accountInfo.preparedForWithdrawal) {
                    requests.push({
                        amount: accountInfo.delegation.amount,
                        requestBlock: {
                            timestamp: accountInfo.delegation.deactivatedTime,
                        },
                    });
                }

                if (
                    accountInfo.delegation &&
                    accountInfo.delegation.withdrawRequests &&
                    accountInfo.delegation.withdrawRequests.length
                ) {
                    accountInfo.delegation.withdrawRequests.forEach((_request) => {
                        requests.push(_request);
                    });
                }
            }

            return requests;
        },
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

            accountInfo.fromEpoch = delegation ? formatHexToInt(delegation.pendingRewards.fromEpoch) : 0;
            accountInfo.toEpoch = delegation ? formatHexToInt(delegation.pendingRewards.toEpoch) : 0;

            return accountInfo;
        },

        async stakerInfo() {
            const { accountInfo } = this;
            const stakerInfo =
                accountInfo && accountInfo.stakerId ? await this.$fWallet.getStakerById(accountInfo.stakerIdHex) : null;

            if (stakerInfo && !stakerInfo.stakerInfo) {
                stakerInfo.stakerInfo = {
                    name: 'Unknown',
                };
            }

            return stakerInfo;
        },
    },

    mounted() {
        this.$refs.doc.focus();
    },

    methods: {
        /**
         * @param {boolean} [_increaseDelegation]
         */
        async stake(_increaseDelegation) {
            const stakerInfo = await this.stakerInfo;

            this.$emit('change-component', {
                to: 'stake-form',
                from: 'staking-info',
                data: {
                    increaseDelegation: !!_increaseDelegation,
                    stakerInfo,
                },
            });
        },

        async undelegate() {
            if (!this.canUndelegate) {
                return;
            }

            const accountInfo = await this.accountInfo;
            const stakerInfo = await this.stakerInfo;

            this.$emit('change-component', {
                to: 'unstake-f-t-m',
                from: 'staking-info',
                data: {
                    accountInfo: {
                        ...accountInfo,
                        stakerInfo,
                    },
                },
            });
        },

        increaseDelegation() {
            if (this.canIncreaseDelegation) {
                this.stake(true);
            }
        },

        async claimRewards() {
            const accountInfo = await this.accountInfo;
            const stakerInfo = await this.stakerInfo;

            if (accountInfo.pendingRewards > 0 && !this.canIncreaseDelegation) {
                this.$emit('change-component', {
                    to: 'claim-rewards-confirmation',
                    from: 'staking-info',
                    data: {
                        accountInfo: {
                            ...accountInfo,
                            stakerInfo,
                        },
                    },
                });
            }
        },

        /**
         * @param {object} _withdrawRequest
         */
        async onWithdrawRequestSelected(_withdrawRequest) {
            const accountInfo = await this.accountInfo;
            const stakerInfo = await this.stakerInfo;

            this.$emit('change-component', {
                to: 'withdraw-f-t-m-confirmation',
                from: 'staking-info',
                data: {
                    accountInfo: {
                        ...accountInfo,
                        stakerInfo,
                    },
                    amount: parseFloat(this.toFTM(_withdrawRequest.amount)),
                    withdraw: true,
                    withdrawRequest: _withdrawRequest,
                },
            });
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
