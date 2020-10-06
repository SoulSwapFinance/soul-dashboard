<template>
    <div class="funiswap-liquidity funiswap">
        <f-card>
            <div class="funiswap__box">
                <div class="funiswap__token__balance">
                    <span>Input</span>
                    <span class="balance">
                        Balance:
                        <f-token-value
                            :token="fromToken"
                            :value="fromTokenBalance"
                            :use-placeholder="false"
                            no-currency
                        />
                    </span>
                </div>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '@/components/core/FCard/FCard.vue';
import { getUniqueId } from '@/utils';
import { mapGetters } from 'vuex';
import FTokenValue from '@/components/core/FTokenValue/FTokenValue.vue';
export default {
    name: 'FUniswapLiquidity',

    components: { FTokenValue, FCard },

    data() {
        return {
            /** @type {FMintAccount} */
            fMintAccount: {
                collateral: [],
                debt: [],
            },
            fromValue: '',
            toValue: '',
            perPrice: 0,
            /** Per price direction. true - from -> to, false - to -> from */
            perPriceDirF2T: true,
            submitBtnDisabled: true,
            showPriceInfo: false,
            /** @type {DefiToken} */
            fromToken: {},
            /** @type {DefiToken} */
            toToken: {},
            /** @type {DefiToken[]} */
            tokens: [],
            sliderLabels: ['0%', '25%', '50%', '75%', '100%'],
            id: getUniqueId(),
            liquidityProviderFee: 0.003,
            submitLabel: 'Enter an amount',
            // minimumReceived: 0,
        };
    },

    computed: {
        ...mapGetters(['currentAccount', 'defiSlippageReserve']),

        /**
         * @return {{fromToken: DefiToken, toToken: DefiToken}}
         */
        params() {
            const { $route } = this;

            return $route && $route.params ? $route.params : {};
        },

        fromTokenBalance() {
            const { fromToken } = this;
            let balance =
                this.$defi.fromTokenValue(fromToken.availableBalance, fromToken) - (fromToken.symbol === 'FTM' ? 2 : 0);

            if (balance < 0) {
                balance = 0;
            }

            return balance;
        },

        toTokenBalance() {
            return this.$defi.fromTokenValue(this.toToken.availableBalance, this.toToken);
        },
    },

    created() {
        this.init();

        // this._fromValueChanged = false;
        //
        // this._eventBus.on('account-picked', this.onAccountPicked);
    },

    methods: {
        async init() {
            const { $defi } = this;
            const { params } = this;
            const result = await Promise.all([
                $defi.fetchFMintAccount(this.currentAccount.address),
                $defi.fetchTokens(this.currentAccount.address),
                $defi.init(),
            ]);

            this.fMintAccount = result[0];

            this.tokens = result[1];

            // if (params.fromToken && params.toToken) {
            if (params.fromToken) {
                this.fromToken = this.tokens.find((_item) => _item.symbol === params.fromToken.symbol);
                // this.toToken = this.tokens.find((_item) => _item.symbol === params.toToken.symbol);
            } else if (this.tokens.length >= 2) {
                this.fromToken = this.tokens[0];
                // this.toToken = this.tokens[1];
            }

            // this.setPerPrice();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
