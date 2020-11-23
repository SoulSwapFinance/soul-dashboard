<template>
    <div ref="doc" class="stake-ftm" tabindex="0">
        <f-card class="f-card-double-padding f-data-layout">
            <h2 class="cont-with-back-btn">
                <span>Staking</span>
                <template v-if="stakerId">
                    <a
                        href="#"
                        class="btn light break-word"
                        style="max-width: 100%;"
                        aria-label="Go to previous form"
                        @click.prevent="onPreviousBtnClick"
                    >
                        Back
                    </a>
                </template>
            </h2>

            <div class="row no-vert-col-padding collapse-md">
                <div class="col">
                    <div class="row no-collapse">
                        <div class="col f-row-label">Delegated</div>
                        <div class="col">
                            <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                                <template v-if="accountInfo">{{ toFTM(accountInfo.delegated) }} FTM</template>
                            </f-placeholder>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col f-row-label">Pending Rewards</div>
                        <div class="col">
                            <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                                <template v-if="accountInfo">{{ toFTM(accountInfo.pendingRewards) }} FTM</template>
                            </f-placeholder>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col f-row-label">Stashed Rewards</div>
                        <div class="col">
                            <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                                <template v-if="accountInfo">{{ toFTM(accountInfo.stashed) }} FTM</template>
                            </f-placeholder>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col f-row-label">Claimed Rewards</div>
                        <div class="col">
                            <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                                <template v-if="accountInfo">
                                    -
                                    <!--{{ toFTM(accountInfo.claimedRewards) }} FTM-->
                                </template>
                            </f-placeholder>
                        </div>
                    </div>
                    <div v-if="!disableSFTM" class="row no-collapse">
                        <div class="col f-row-label">Minted sFTM</div>
                        <div class="col">
                            <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                                <template v-if="accountInfo">{{ outstandingSFTM.toFixed(2) }} sFTM</template>
                            </f-placeholder>
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
                            <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                                <template v-if="accountInfo">{{ accountInfo.stakerId || '-' }}</template>
                            </f-placeholder>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col f-row-label">Delegation Time</div>
                        <div class="col">
                            <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                                <template v-if="accountInfo">
                                    {{
                                        accountInfo.createdTime && accountInfo.createdTime !== '0x0'
                                            ? formatDate(timestampToDate(accountInfo.createdTime), false, true)
                                            : '-'
                                    }}
                                </template>
                            </f-placeholder>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col f-row-label">Unlock Date</div>
                        <div class="col">
                            <f-placeholder :content-loaded="!!accountInfo" block :replacement-num-chars="10">
                                <template v-if="accountInfo">
                                    <f-message
                                        v-if="lockedUntil !== '0x0'"
                                        :type="lockedUntilMessageType"
                                        style="margin-top: 0; padding-top: 0;"
                                    >
                                        {{ formatDate(timestampToDate(lockedUntil), false, true) }}
                                    </f-message>
                                    <template v-else>-</template>
                                </template>
                            </f-placeholder>
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
                                <button v-if="accountInfo.canUnStash" class="btn large" @click="unstash()">
                                    Unstash Rewards
                                </button>
                                <button
                                    v-show="canClaimRewards"
                                    class="btn large"
                                    :disabled="!canClaimRewards"
                                    @click="claimRewards()"
                                >
                                    Claim Rewards
                                </button>
                                <button
                                    v-show="canClaimRewards"
                                    class="btn large"
                                    :disabled="!canClaimRewards"
                                    @click="claimRewardsAndReStake()"
                                >
                                    Claim & Restake
                                </button>
                                <!--
                                <button
                                    v-show="canIncreaseDelegation"
                                    class="btn large"
                                    :disabled="!canIncreaseDelegation"
                                    @click="increaseDelegation()"
                                >
                                    Increase Delegation
                                </button>
                                -->
                                <button
                                    v-show="canUndelegate"
                                    class="btn large"
                                    :class="{ 'orange-btn': orangeBtn }"
                                    :disabled="!canUndelegate"
                                    @click="undelegate()"
                                >
                                    Undelegate
                                </button>
                                <button
                                    v-show="canLockDelegation"
                                    class="btn large"
                                    :disabled="!canLockDelegation"
                                    @click="lockDelegation()"
                                >
                                    Lock Delegation
                                </button>
                                <button
                                    v-show="canMintSFTM"
                                    class="btn large"
                                    :disabled="!canMintSFTM"
                                    @click="mintSFTM()"
                                >
                                    Mint sFTM
                                </button>
                                <button
                                    v-show="canRepaySFTM"
                                    class="btn large"
                                    :disabled="!canRepaySFTM"
                                    @click="repaySFTM()"
                                >
                                    Repay sFTM
                                </button>

                                <f-message v-if="!canIncreaseDelegation" type="info" with-icon class="align-left">
                                    You need to claim all pending rewards before
                                    <!--increasing your delegation or-->
                                    undelegating.
                                    <br />
                                    You can claim rewards for a maximum of {{ claimMaxEpochs }} epochs at once (use
                                    repeatedly if needed).
                                </f-message>
                                <f-message v-if="showRepaySFTMMessage" type="info" with-icon class="align-left">
                                    Can't repay sFTM, not enough unlocked sFTM
                                </f-message>
                                <f-message v-if="showUndelegateMessage" type="info" with-icon class="align-left">
                                    Can't undelegate, repay sFTM first please
                                </f-message>
                            </template>
                        </template>
                        <template v-else>
                            <button v-show="accountInfo" class="btn large" :disabled="!accountInfo" @click="stake()">
                                Delegate
                            </button>
                        </template>

                        <f-message v-if="!!accountInfo && !isFluidStakingActive" type="warning">
                            To participate in Fluid Staking, please claim your outstanding rewards. <br />
                            Even if your pending rewards balance shows 0, go ahead and claim anyway and you’ll receive
                            the correct amount.
                        </f-message>
                    </div>
                </div>
            </div>
        </f-card>

        <f-card v-if="withdrawRequests.length" class="f-card-double-padding account-main-content-mt">
            <h2>Undelegation History</h2>

            <withdraw-request-list :items="withdrawRequests" @withdraw-request-selected="onWithdrawRequestSelected" />
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import { mapGetters } from 'vuex';
import { toFTM, WeiToFtm } from '../../utils/transactions.js';
import { formatHexToInt, timestampToDate, formatDate, prepareTimestamp } from '../../filters.js';
import appConfig from '../../../app.config.js';
import WithdrawRequestList from '../data-tables/WithdrawRequestList.vue';
import FMessage from '../core/FMessage/FMessage.vue';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import gql from 'graphql-tag';
import { SFC_CLAIM_MAX_EPOCHS } from '@/plugins/fantom-web3-wallet.js';

export default {
    name: 'StakingInfo',

    components: { FPlaceholder, FMessage, WithdrawRequestList, FCard },

    props: {
        /***/
        stakerId: {
            type: String,
            default: '',
        },
        /** Name of previous component. */
        previousComponent: {
            type: String,
            default: 'delegations-info',
        },
    },

    data() {
        return {
            isFluidStakingActive: false,
            lockedUntil: '',
            explorerUrl: appConfig.explorerUrl,
            claimMaxEpochs: SFC_CLAIM_MAX_EPOCHS,
            /** @type {DefiToken} */
            sftmToken: {},
            disableSFTM: appConfig.disableSFTM,
        };
    },

    computed: {
        ...mapGetters(['currentAccount']),

        canClaimRewards() {
            const { accountInfo } = this;

            if (!this.isFluidStakingActive) {
                return accountInfo.delegation
                    ? accountInfo.delegation.amountDelegated !== accountInfo.delegation.amountInWithdraw
                    : true;
            } else {
                return (
                    accountInfo &&
                    accountInfo.pendingRewards &&
                    accountInfo.pendingRewards !== '0x0' &&
                    accountInfo.stashed === '0x0' &&
                    (accountInfo.delegation
                        ? accountInfo.delegation.amountDelegated !== accountInfo.delegation.amountInWithdraw
                        : true)
                );
            }
        },

        canIncreaseDelegation() {
            const { accountInfo } = this;

            if (!this.isFluidStakingActive) {
                return accountInfo.delegation
                    ? accountInfo.delegation.amountDelegated === accountInfo.delegation.amountInWithdraw
                    : false;
            } else {
                return (
                    accountInfo &&
                    accountInfo.pendingRewards &&
                    accountInfo.pendingRewards === '0x0' &&
                    accountInfo.stashed === '0x0' &&
                    (accountInfo.delegation
                        ? accountInfo.delegation.amountDelegated !== accountInfo.delegation.amountInWithdraw
                        : true)
                );
            }
        },

        canUndelegate() {
            const { accountInfo } = this;

            if (!this.isFluidStakingActive) {
                return accountInfo && accountInfo.delegation
                    ? accountInfo.delegation.amountDelegated !== accountInfo.delegation.amountInWithdraw
                    : false;
            } else {
                return (
                    this._delegation &&
                    this._delegation.tokenizerAllowedToWithdraw &&
                    accountInfo &&
                    accountInfo.pendingRewards &&
                    accountInfo.pendingRewards === '0x0' &&
                    accountInfo.stashed === '0x0' &&
                    (accountInfo.delegation
                        ? accountInfo.delegation.amountDelegated !== accountInfo.delegation.amountInWithdraw
                        : true)
                );
            }
        },

        showUndelegateMessage() {
            const { accountInfo } = this;

            if (!this.isFluidStakingActive) {
                return false;
            } else {
                return (
                    !appConfig.disableSFTM &&
                    accountInfo &&
                    accountInfo.pendingRewards &&
                    accountInfo.pendingRewards === '0x0' &&
                    accountInfo.stashed === '0x0' &&
                    (accountInfo.delegation
                        ? accountInfo.delegation.amountDelegated !== accountInfo.delegation.amountInWithdraw
                        : true) &&
                    this._delegation &&
                    !this._delegation.tokenizerAllowedToWithdraw
                );
                // return !this.canUndelegate;
            }
        },

        canLockDelegation() {
            return (
                this.canUndelegate &&
                this.lockedUntil &&
                (this.lockedUntil === '0x0' || prepareTimestamp(this.lockedUntil) < this.now())
            );
        },

        canMintSFTM() {
            return (
                !appConfig.disableSFTM &&
                // this.canUndelegate &&
                this.lockedUntil &&
                this.lockedUntil !== '0x0' &&
                prepareTimestamp(this.lockedUntil) > this.now() &&
                this._delegation &&
                this._delegation.tokenizerAllowedToWithdraw
            );
        },

        canRepaySFTM() {
            return (
                !appConfig.disableSFTM &&
                // this.canUndelegate &&
                this.lockedUntil &&
                this.lockedUntil !== '0x0' &&
                this._delegation &&
                this._delegation.outstandingSFTM !== '0x0' &&
                this.outstandingSFTM <= this.availableSFTM
            );
        },

        showRepaySFTMMessage() {
            return (
                !appConfig.disableSFTM &&
                this.lockedUntil &&
                this.lockedUntil !== '0x0' &&
                this._delegation &&
                this._delegation.outstandingSFTM !== '0x0' &&
                this.outstandingSFTM > this.availableSFTM
            );
        },

        availableSFTM() {
            return this.sftmToken ? this.$defi.fromTokenValue(this.sftmToken.availableBalance, this.sftmToken) || 0 : 0;
        },

        outstandingSFTM() {
            return this.sftmToken && this._delegation
                ? this.$defi.fromTokenValue(this._delegation.outstandingSFTM, this.sftmToken) || 0
                : 0;
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
                        if (delegation.toStakerId === _request.stakerID) {
                            requests.push(_request);
                        }
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
                    if (!_request.withdrawBlock && delegation.toStakerId === _request.stakerID) {
                        amount += WeiToFtm(_request.amount);
                    }
                });
            }

            return amount;
        },

        /**
         * @return {string}
         */
        lockedUntilMessageType() {
            return this.isLocked ? 'warning' : 'success';
        },

        /**
         * Color of 'Undelegate' button.
         *
         * @return {boolean}
         */
        orangeBtn() {
            return this.isLocked;
        },

        /**
         * Returns `true` if delegetion is still locked.
         *
         * @return {boolean}
         */
        isLocked() {
            const lockedUntilTS = parseInt(this.lockedUntil, 16);
            const now = new Date().getTime() / 1000;

            return lockedUntilTS > now;
        },
    },

    asyncComputed: {
        async accountInfo() {
            let accountInfo = this._accountInfo;
            let delegation = this._delegation;

            if (!accountInfo) {
                accountInfo = await this.fetchAccountInfo();
                this._accountInfo = accountInfo;
            }

            if (!delegation) {
                delegation = await this.fetchDelegation(this.stakerId);
                this._delegation = delegation;
                this.isFluidStakingActive = delegation.isFluidStakingActive;
                this.lockedUntil = delegation.lockedUntil;
            }

            accountInfo.delegation = delegation;

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

    created() {
        this._accountInfo = null;
        this._delegation = null;
    },

    mounted() {
        this.$refs.doc.focus();

        this.init();
    },

    methods: {
        async init() {
            const { $defi } = this;
            const { address } = this.currentAccount;
            const result = await Promise.all([$defi.fetchTokens(address), $defi.init()]);

            this.sftmToken = result[0].find((_item) => _item.symbol === 'SFTM') || {};
        },

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
                    stakerId: this.stakerId,
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
                    stakerId: this.stakerId,
                },
            });
        },

        lockDelegation() {
            if (!this.canLockDelegation) {
                return;
            }

            this.$emit('change-component', {
                to: 'delegation-lock',
                from: 'staking-info',
                data: {
                    stakerId: this.stakerId,
                },
            });
        },

        mintSFTM() {
            if (!this.canMintSFTM) {
                return;
            }

            // const stakerInfo = await this.stakerInfo;

            this.$emit('change-component', {
                to: 'defi-mint-s-f-t-m-confirmation',
                from: 'staking-info',
                data: {
                    stakerId: this.stakerId,
                    amountDelegated: this._delegation.amountDelegated,
                    // stakerAddress: stakerInfo ? stakerInfo.stakerAddress : '',
                },
            });
        },

        repaySFTM() {
            if (!this.canRepaySFTM) {
                return;
            }

            this.$emit('change-component', {
                to: 'defi-repay-s-f-t-m-confirmation',
                from: 'staking-info',
                data: {
                    stakerId: this.stakerId,
                    outstandingSFTM: this._delegation.outstandingSFTM,
                    // stakerAddress: stakerInfo ? stakerInfo.stakerAddress : '',
                },
            });
        },

        increaseDelegation() {
            if (this.canIncreaseDelegation) {
                this.stake(true);
            }
        },

        now() {
            return new Date().getTime();
        },

        async claimRewards() {
            const accountInfo = await this.accountInfo;
            const stakerInfo = await this.stakerInfo;

            // if (accountInfo.pendingRewards > 0 && !this.canIncreaseDelegation) {
            this.$emit('change-component', {
                to: 'claim-rewards-confirmation',
                from: 'staking-info',
                data: {
                    accountInfo: {
                        ...accountInfo,
                        stakerInfo,
                    },
                    stakerId: this.stakerId,
                },
            });
            // }
        },

        async claimRewardsAndReStake() {
            const accountInfo = await this.accountInfo;
            const stakerInfo = await this.stakerInfo;

            // if (accountInfo.pendingRewards > 0 && !this.canIncreaseDelegation) {
            this.$emit('change-component', {
                to: 'claim-rewards-confirmation',
                from: 'staking-info',
                data: {
                    accountInfo: {
                        ...accountInfo,
                        stakerInfo,
                    },
                    stakerId: this.stakerId,
                    reStake: true,
                },
            });
            // }
        },

        async unstash() {
            const accountInfo = await this.accountInfo;
            const stakerInfo = await this.stakerInfo;

            if (accountInfo.canUnStash) {
                this.$emit('change-component', {
                    to: 'unstash-confirmation',
                    from: 'staking-info',
                    data: {
                        accountInfo: {
                            ...accountInfo,
                            stakerInfo,
                        },
                        stakerId: this.stakerId,
                    },
                });
            }
        },

        /**
         * Fetch account info by current account address.
         */
        async fetchAccountInfo() {
            const data = await this.$apollo.query({
                query: gql`
                    query AccountByAddress($address: Address!) {
                        account(address: $address) {
                            address
                            balance
                            stashed
                            canUnStash
                        }
                    }
                `,
                variables: {
                    address: this.currentAccount.address,
                },
                fetchPolicy: 'network-only',
            });

            return data.data.account;
        },

        /**
         * Fetch delegation by staker id and current account address.
         *
         * @param {string} _stakerId
         */
        async fetchDelegation(_stakerId) {
            const data = await this.$apollo.query({
                query: gql`
                    query Delegation($address: Address!, $staker: Long!) {
                        delegation(address: $address, staker: $staker) {
                            toStakerId
                            createdEpoch
                            createdTime
                            deactivatedEpoch
                            deactivatedTime
                            amount
                            amountDelegated
                            amountInWithdraw
                            claimedReward
                            outstandingSFTM
                            tokenizerAllowedToWithdraw
                            paidUntilEpoch
                            isFluidStakingActive
                            isDelegationLocked
                            lockedUntil
                            pendingRewards {
                                amount
                                fromEpoch
                                toEpoch
                            }
                            withdrawRequests {
                                address
                                receiver
                                account {
                                    address
                                }
                                stakerID
                                withdrawRequestID
                                isDelegation
                                amount
                                withdrawPenalty
                                requestBlock {
                                    number
                                    timestamp
                                }
                                withdrawBlock {
                                    number
                                    timestamp
                                }
                            }
                            deactivation {
                                address
                                requestBlock {
                                    number
                                    timestamp
                                }
                                withdrawBlock {
                                    number
                                    timestamp
                                }
                            }
                        }
                    }
                `,
                variables: {
                    address: this.currentAccount.address,
                    staker: _stakerId,
                },
                fetchPolicy: 'network-only',
            });

            return data.data.delegation;
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
                    stakerId: this.stakerId,
                },
            });
        },

        onPreviousBtnClick() {
            this.$emit('change-component', {
                to: this.previousComponent,
                from: 'stake-form',
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
