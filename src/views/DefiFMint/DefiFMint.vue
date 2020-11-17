<template>
    <div class="view-defi-fmint">
        <h1 class="with-back-btn"><f-back-button :route-name="backButtonRoute" /> fMint</h1>

        <h2 class="perex">Manage your collateral and minted fUSD</h2>

        <div class="grid">
            <div>
                <h2>Collateral</h2>
                <div class="df-data-item smaller">
                    <h3 class="label">
                        <router-link :to="{ name: 'defi-ftrade' }"> Available {{ wftmTokenSymbol }} </router-link>
                        <template v-if="sftmToken.address">+ {{ sftmTokenSymbol }}</template>
                    </h3>
                    <div class="value">
                        <f-token-value :token="wftmToken" :value="availableWFTM + availableSFTM" no-currency />
                    </div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">
                        Locked {{ wftmTokenSymbol }}
                        <template v-if="sftmToken.address"> + {{ sftmTokenSymbol }}</template>
                    </h3>
                    <div class="value"><f-token-value :token="wftmToken" :value="collateral" no-currency /></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Current {{ wftmTokenSymbol }} price</h3>
                    <div class="value">
                        <f-placeholder :content-loaded="!!tokenPrice" replacement-text="$0.00000">
                            {{ currentPrice }}
                        </f-placeholder>
                    </div>
                </div>
            </div>
            <div class="limit-col align-center">
                <ratio-info :value="collateralRatio">
                    <template #ratio-info-title>
                        <h2>C-Ratio <c-ratio-info /></h2>
                    </template>
                </ratio-info>
            </div>
            <div class="align-right">
                <h2>fUSD</h2>
                <div class="df-data-item smaller">
                    <h3 class="label">Max mintable</h3>
                    <div class="value"><f-token-value :token="fusdToken" :value="maxMintable" /></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Minted fUSD</h3>
                    <div class="value"><f-token-value :token="fusdToken" :value="debtFUSD" /></div>
                </div>
                <div class="df-data-item smaller">
                    <h3 class="label">Est. Pending / Stashed Rewards</h3>
                    <div class="value">
                        <f-placeholder
                            :content-loaded="!!wftmToken.symbol && 'rewardsEarned' in rewards"
                            replacement-text="999 / 999 wFTM"
                        >
                            <f-token-value
                                no-currency
                                :use-placeholder="false"
                                :token="wftmToken"
                                :value="pendingRewardsWFTM - stashedRewardsWFTM"
                            />
                            <span class="currency-light">
                                /
                                <f-token-value
                                    :use-placeholder="false"
                                    :token="wftmToken"
                                    :value="stashedRewardsWFTM"
                                />
                            </span>
                        </f-placeholder>
                    </div>
                </div>
                <!--
                <div class="df-data-item smaller">
                    <h3 class="label">Liquidation price</h3>
                    <div class="value">{{ liquidationPrice }}</div>
                </div>
                -->
            </div>
            <f-message v-if="closeToLiquidation" type="error" role="alert" class="big">
                You're getting close to your liquidation price. <br />
                Please rebalance your collateral.
            </f-message>
        </div>

        <div class="form-buttons">
            <div class="row">
                <div class="col align-left align-center-md">
                    <router-link :to="{ name: 'defi-lock', params: { token: { ...wftmToken } } }" class="btn large">
                        Lock Collateral
                    </router-link>
                    <br />
                    <router-link
                        :to="{ name: 'defi-unlock', params: { token: { ...wftmToken } } }"
                        class="btn large secondary"
                    >
                        Unlock Collateral
                    </router-link>
                </div>
                <div class="col">
                    <router-link
                        v-if="canClaimRewards"
                        :to="{
                            name: 'defi-fmint-claim-rewards-confirmation',
                            params: { pendingRewards: pendingRewardsWFTM, token: { ...wftmToken } },
                        }"
                        class="btn large"
                    >
                        Claim Rewards
                    </router-link>
                    <template v-else>
                        <button type="button" class="btn large" disabled>Claim Rewards</button>
                    </template>
                    <router-link
                        v-if="canPushRewards"
                        :to="{
                            name: 'defi-fmint-push-rewards-confirmation',
                            params: { token: { ...wftmToken } },
                        }"
                        class="btn large secondary"
                    >
                        Push Rewards
                    </router-link>
                    <template v-else>
                        <button type="button" class="btn large secondary" disabled>Push Rewards</button>
                    </template>
                </div>
                <div class="col align-right align-center-md">
                    <router-link :to="{ name: 'defi-mint' }" class="btn large">Mint fUSD</router-link>
                    <br />
                    <router-link :to="{ name: 'defi-repay' }" class="btn large secondary">Repay fUSD</router-link>
                </div>
            </div>
            <!--
            <router-link
                :to="{ name: $defi.tmpWFTM ? 'defi-lock-unlock' : 'defi-manage-collateral' }"
                class="btn large"
            >
                Lock/Unlock {{ wftmTokenSymbol }}
            </router-link>
            <router-link :to="{ name: $defi.tmpWFTM ? 'defi-mint-repay' : 'defi-borrow-fusd' }" class="btn large">
                Mint/Repay fUSD
            </router-link>
            -->
        </div>

        <!--
        <defi-menu v-else>
            <li class="col-4">
                <div class="menu-item disabled">
                    <h2>Manage collateral</h2>
                    <div class="icon">
                        <icon data="@/assets/svg/defi/mint.svg" width="96" height="96" />
                    </div>
                    <p class="description">Lock FTM to use it as collateral and mint fUSD</p>
                    <div class="title">Coming Soon</div>
                </div>
            </li>
            <li class="col-4">
                <div class="menu-item" tabindex="0">
                    <h2>Mint</h2>
                    <div class="icon">
                        <icon data="@/assets/svg/defi/mint.svg" width="96" height="96" />
                    </div>
                    <p class="description">Mint fUSD by locking your FTM</p>
                    <router-link :to="{ name: 'defi-borrow-fusd' }" class="clickable title">
                        Mint fUSD
                    </router-link>
                </div>
            </li>
            <li class="col-4">
                <div class="menu-item disabled" tabindex="0">
                    <h2>Repay</h2>
                    <div class="icon">
                        <icon data="@/assets/svg/defi/repay.svg" width="96" height="96" />
                    </div>
                    <p class="description">Repay the fUSD you minted and unlock your FTM</p>
                    <div class="title">Coming Soon</div>
                </div>
            </li>
        </defi-menu>
        -->
    </div>
</template>

<script>
import { formatNumberByLocale } from '../../filters.js';
import { mapGetters } from 'vuex';
import FMessage from '../../components/core/FMessage/FMessage.vue';
import { getUniqueId } from '../../utils';
import FBackButton from '../../components/core/FBackButton/FBackButton.vue';
import { getAppParentNode } from '../../app-structure.js';
import { eventBusMixin } from '../../mixins/event-bus.js';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import RatioInfo from '@/components/RatioInfo/RatioInfo.vue';
import CRatioInfo from '@/components/CRatioInfo/CRatioInfo.vue';
import appConfig from '../../../app.config.js';

export default {
    name: 'DefiFMint',

    components: { CRatioInfo, RatioInfo, FPlaceholder, FTokenValue, FBackButton, FMessage },

    mixins: [eventBusMixin],

    data() {
        return {
            tokenPrice: 0,
            /** @type {FMintAccount} */
            fMintAccount: {
                collateral: [],
                debt: [],
            },
            /** @type {FMintAccount} */
            rewards: {},
            /** @type {DefiToken} */
            wftmToken: {},
            /** @type {DefiToken} */
            sftmToken: {},
            /** @type {DefiToken} */
            fusdToken: {},
            /** @type {DefiToken[]} */
            tokens: [],
            id: getUniqueId(),
        };
    },

    computed: {
        ...mapGetters(['currentAccount', 'defiSlippageReserve']),

        debt() {
            // overall debt
            return this.$defi.fromTokenValue(this.fMintAccount.debtValue, this.fusdToken);
        },

        debtFUSD() {
            /** @type {FMintTokenBalance} */
            const tokenBalance = this.$defi.getFMintAccountDebt(this.fMintAccount, this.fusdToken);

            return this.$defi.fromTokenValue(tokenBalance.balance, this.fusdToken) || 0;
        },

        collateral() {
            /** @type {FMintTokenBalance} */
            const wFTMtokenBalance = this.$defi.getFMintAccountCollateral(this.fMintAccount, this.wftmToken);
            /** @type {FMintTokenBalance} */
            const sFTMtokenBalance = this.$defi.getFMintAccountCollateral(this.fMintAccount, this.sftmToken);
            const wFTMtokenBalanceValue = this.$defi.fromTokenValue(wFTMtokenBalance.balance, this.wftmToken) || 0;
            const sFTMtokenBalanceValue = this.$defi.fromTokenValue(sFTMtokenBalance.balance, this.sftmToken) || 0;

            return wFTMtokenBalanceValue + sFTMtokenBalanceValue;
        },

        availableWFTM() {
            return this.wftmToken ? this.$defi.fromTokenValue(this.wftmToken.availableBalance, this.wftmToken) || 0 : 0;
        },

        availableSFTM() {
            return this.sftmToken ? this.$defi.fromTokenValue(this.sftmToken.availableBalance, this.sftmToken) || 0 : 0;
        },

        currentPrice() {
            return formatNumberByLocale(this.tokenPrice, 5, 'USD');
        },

        pendingRewards() {
            return this.$defi.fromTokenValue(this.rewards.rewardsEarned, this.fusdToken) || 0;
        },

        pendingRewardsWFTM() {
            return this.$defi.fromTokenValue(this.rewards.rewardsEarned, this.wftmToken) || 0;
            // return this.$defi.convertTokenValue(this.pendingRewards, this.fusdToken, this.wftmToken);
        },

        stashedRewards() {
            return this.$defi.fromTokenValue(this.rewards.rewardsStashed, this.fusdToken) || 0;
        },

        stashedRewardsWFTM() {
            return this.$defi.fromTokenValue(this.rewards.rewardsStashed, this.wftmToken) || 0;
            // return this.$defi.convertTokenValue(this.stashedRewards, this.fusdToken, this.wftmToken);
        },

        canClaimRewards() {
            const { rewards } = this;

            return rewards.canClaimRewards && (rewards.rewardsEarned !== '0x0' || rewards.rewardsStashed !== '0x0');
        },

        canPushRewards() {
            return this.rewards.canPushNewRewards;
            // return true;
        },

        liquidationPrice() {
            return '-';
            /*
            const liqPrice = this.$defi.getLiquidationPrice(this.debt, this.collateral);

            return liqPrice > 0 ? formatNumberByLocale(liqPrice, 5, 'USD') : '-';
            */
        },

        availableBalance() {
            return this.wftmToken ? this.$defi.fromTokenValue(this.wftmToken.availableBalance, this.wftmToken) || 0 : 0;
        },

        maxMintable() {
            const borrowLimit = this.$defi.getBorrowLimit(this.fMintAccount);

            return this.debtFUSD + borrowLimit - borrowLimit * this.defiSlippageReserve;
            /*
            return (
                this.debtFUSD +
                Math.min(
                    this.availableBalance * this.tokenPrice,
                    this.$defi.getBorrowLimit(this.fMintAccount) / this.tokenPrice
                )
            );
            */
            // return this.$defi.getMaxDebt(this.collateral, this.tokenPrice).toFixed(2);
        },

        debtLimit() {
            return this.$defi.getDebtLimit(this.fMintAccount);
        },

        collateralRatio() {
            return this.$defi.getCollateralRatio(this.fMintAccount);
        },

        closeToLiquidation() {
            return false;
            /*
            const { $defi } = this;

            return this.debtLimit > ($defi.warningCollateralRatio / $defi.minCollateralRatio) * 100;
            */
        },

        wftmTokenSymbol() {
            return this.$defi.getTokenSymbol(this.wftmToken);
        },

        sftmTokenSymbol() {
            return this.$defi.getTokenSymbol(this.sftmToken);
        },

        backButtonRoute() {
            const parentNode = getAppParentNode('defi-fmint');

            return parentNode ? parentNode.route : '';
        },

        /**
         * Property is set to `true`, if 'small' breakpoint is reached.
         *
         * @return {Boolean}
         */
        /*
        smallView() {
            const breakpoint = this.$store.state.breakpoints['small'];

            return breakpoint && breakpoint.matches;
        },
        */
    },

    created() {
        this._eventBus.on('account-picked', this.onAccountPicked);

        this.init();
    },

    methods: {
        async init() {
            const { $defi } = this;
            const { address } = this.currentAccount;
            const result = await Promise.all([
                $defi.fetchFMintAccount(address, true),
                $defi.fetchTokens(address),
                $defi.init(),
            ]);

            this.fMintAccount = result[0];
            this.tokens = result[1];
            this.wftmToken = this.tokens.find((_item) => _item.symbol === 'WFTM') || {};

            if (!appConfig.disableSFTM) {
                this.sftmToken = this.tokens.find((_item) => _item.symbol === 'SFTM') || {};
            }

            this.fusdToken = this.tokens.find((_item) => _item.symbol === 'FUSD') || {};
            this.tokenPrice = $defi.getTokenPrice(this.wftmToken);

            this.rewards = await $defi.fetchFMintAccountRewards(address);
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
