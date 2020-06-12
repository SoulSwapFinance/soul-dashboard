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
                <div class="col align-center">
                    <div class="form-buttons">
                        <template v-if="stakerInfo">
                            <template v-if="accountInfo && accountInfo.preparedForWithdrawal">
                                <f-message type="info" with-icon>
                                    You will be able to delegate from this address again once all pending undelegations
                                    have been withdrawn.
                                </f-message>
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
                                <button
                                    class="btn large"
                                    :disabled="!canIncreaseDelegation"
                                    @click="increaseDelegation()"
                                >
                                    Increase Delegation
                                </button>
                                <button class="btn large" :disabled="!canUndelegate" @click="undelegate()">
                                    Undelegate
                                </button>

                                <f-message
                                    v-if="accountInfo.claimedRewards !== '0x0'"
                                    type="info"
                                    with-icon
                                    class="align-left"
                                >
                                    Claimed rewards are still locked and cannot be withdrawn or delegated until the 24th
                                    June
                                    <br />
                                </f-message>

                                <f-message v-if="!canIncreaseDelegation" type="info" with-icon class="align-left">
                                    You need to claim all pending rewards before increasing your delegation or
                                    undelegating.
                                    <br />
                                    You can claim rewards for a maximum of 200 epochs at once (use repeatedly if
                                    needed).
                                </f-message>
                            </template>
                        </template>
                        <template v-else>
                            <button class="btn large" @click="stake()">Delegate</button>
                        </template>
                    </div>
                </div>
            </div>
        </f-card>

        <f-card v-if="withdrawRequests.length" class="f-card-double-padding account-main-content-mt">
            <h2>Pending Undelegations</h2>

            <withdraw-request-list :items="withdrawRequests" @withdraw-request-selected="onWithdrawRequestSelected" />
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import { mapGetters } from 'vuex';
import { toFTM, WeiToFtm } from '../../utils/transactions.js';
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

        /**
         * Data for WithdrawRequestList.
         *
         * @return {array} Array of withdraw requests.
         */
        withdrawRequests() {
            const { accountInfo } = this;
            const delegation = accountInfo ? accountInfo.delegation : null;
            const requests = [];
            let amount = '';

            if (delegation) {
                if (accountInfo.preparedForWithdrawal) {
                    amount = delegation.amountDelegated;
                }

                if (delegation.deactivation && delegation.deactivation.length) {
                    delegation.deactivation.forEach((_request) => {
                        _request.amount = amount;
                        _request.final = true;
                        requests.push(_request);
                    });
                } else if (accountInfo.preparedForWithdrawal) {
                    requests.push({
                        amount: amount,
                        final: true,
                        requestBlock: {
                            timestamp: delegation.deactivatedTime,
                        },
                    });
                }

                if (delegation.withdrawRequests && delegation.withdrawRequests.length) {
                    delegation.withdrawRequests.forEach((_request) => {
                        requests.push(_request);
                    });
                }
            }

            return requests;
        },

        /**
         * Sum of amount of withdraw request (not withdrawn yet).
         */
        withdrawRequestsAmount() {
            const { accountInfo } = this;
            const delegation = accountInfo ? accountInfo.delegation : null;
            let amount = 0;

            if (delegation && delegation.withdrawRequests && delegation.withdrawRequests.length) {
                delegation.withdrawRequests.forEach((_request) => {
                    if (!_request.withdrawBlock) {
                        amount += WeiToFtm(_request.amount);
                    }
                });
            }

            return amount;
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
                        withdrawRequestsAmount: this.withdrawRequestsAmount,
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
                    amount: WeiToFtm(_withdrawRequest.amount),
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
