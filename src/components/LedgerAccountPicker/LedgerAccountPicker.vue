<template>
    <div class="ledger-account-picker">
        <div v-if="$asyncComputed.accounts.updating" class="loader">
            <pulse-loader color="#1969ff"></pulse-loader>
        </div>
        <div v-if="accounts && accounts.length > 0">
            <ul class="no-markers ledger-accounts-list">
                <li v-for="account in accounts" :key="account.address">
                    <div class="row no-collapse">
                        <h3 class="col-10 break-word">
                            <router-link
                                :to="{
                                    name: 'account-dashboard',
                                    params: account,
                                }"
                                class="break-word"
                                aria-label="Address"
                            >
                                {{ account.address }}
                            </router-link>
                        </h3>
                        <div class="col">{{ toFTM(account.balance) }} FTM</div>
                    </div>
                </li>
            </ul>

            <div class="button-footer">
                <button class="btn secondary large" @click="onLoadNextBtnClick">Load Next</button>
            </div>
        </div>
        <f-message v-if="$asyncComputed.accounts.error" type="error" with-icon>
            An error
        </f-message>
        <f-message v-if="tmpError" type="error" with-icon>
            {{ tmpError }}
        </f-message>
    </div>
</template>

<script>
import FMessage from '../core/FMessage/FMessage.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { formatNumberByLocale, numToFixed } from '../../filters.js';
import { WEIToFTM } from '../../utils/transactions.js';

export default {
    components: { FMessage, PulseLoader },

    data() {
        return {
            tmpError: '',
        };
    },

    asyncComputed: {
        async accounts() {
            let accounts = [];

            try {
                accounts = await this.$fNano.getLedgerAccounts();
            } catch (e) {
                this.tmpError = e.toString();
                throw e;
            }

            return accounts || [];
        },
    },

    mounted() {
        // this.tmpTest();
    },

    methods: {
        /**
         * Convert value to FTM.
         *
         * @param {string|number} _value
         * @return {string}
         */
        toFTM(_value) {
            return formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2);
        },

        onLoadNextBtnClick() {
            alert('not implemented yet');
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
