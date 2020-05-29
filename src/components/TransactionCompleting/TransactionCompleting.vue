<template>
    <f-card class="transaction-completing f-card-double-padding">
        <h2>{{ title }}</h2>

        <template v-if="success">
            <p>We have added the following transaction to our log for your address:</p>

            <p>
                <b>{{ tokenSwapData.amount }} {{ getFTMCurrencyByBlockchain('OperaToOpera') }} </b>
                from <b class="break-word">{{ tokenSwapData.from_opera_address }}</b>
            </p>

            <p>
                You will receive another
                <b> {{ tokenSwapData.amount }} {{ getFTMCurrencyByBlockchain(tokenSwapData.direction) }}</b> in your
                address
                <b> {{ tokenSwapData.address }}</b>
            </p>

            <!--
            <h3 class="break-word">
                <a :href="`https://explorer.fantom.network/transactions/${tx}`" target="_blank">
                    {{ tokenSwapData.tx | formatHash }}
                </a>
            </h3>
-->

            <div class="success-icon">
                <icon data="@/assets/svg/message/check-circle.svg" width="96" height="96" aria-hidden="true" />
            </div>
        </template>
        <template v-else>
            <pulse-loader color="#1969ff"></pulse-loader>
        </template>
    </f-card>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { BNBridgeExchangeErrorCodes } from '../../plugins/bnbridge-exchange/bnbridge-exchange.js';

export default {
    name: 'TransactionCompleting',

    components: { FCard, PulseLoader },

    props: {
        tokenSwapData: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    data() {
        return {
            title: 'Completing transaction',
            success: false,
        };
    },

    mounted() {
        // TMP!
        // this.transactionCompleted();

        this.finalizeTransaction();
    },

    methods: {
        async finalizeTransaction() {
            console.log('finalize', this.tokenSwapData);

            try {
                await this.$bnb.finalizeSwapToken(this.tokenSwapData);
                this.transactionCompleted();
            } catch (_error) {
                if (_error.code === BNBridgeExchangeErrorCodes.FINALIZE_SWAP_TOKEN_API_ERROR) {
                    setTimeout(() => {
                        this.finalizeTransaction();
                    }, 1000);
                }
            }
        },

        transactionCompleted() {
            this.title = 'Swap request pending';
            this.success = true;
        },

        /**
         * @param {BNBridgeDirection} _sendDirection
         * @return {string}
         */
        getFTMCurrencyByBlockchain(_sendDirection) {
            let currency = 'FTM';

            if (_sendDirection === 'OperaToOpera') {
                currency += '-Opera';
            } else if (_sendDirection === 'OperaToBinance') {
                currency += '-BEP2';
            } else if (_sendDirection === 'OperaToEthereum') {
                currency += '-ERC20';
            }

            return currency;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
