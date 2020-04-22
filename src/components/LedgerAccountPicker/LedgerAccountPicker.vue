<template>
    <div class="ledger-account-picker">
        <ul v-if="accounts" class="no-markers ledger-accounts-list">
            <li v-for="address in accounts" :key="address">
                <router-link
                    :to="{
                        name: 'account-dashboard',
                        params: { address },
                    }"
                    class="break-word fs-big"
                    aria-label="Address"
                >
                    {{ address }}
                </router-link>
            </li>
        </ul>
        <div v-if="$asyncComputed.accounts.updating">
            Loading...
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

const tmpAddr = ['0x76AE07E6D236c1aE3F5C3112F387ad82c69A2471', '0x1994e627454649c95ea55885c285343092c1473d'];

export default {
    components: { FMessage },

    data() {
        return {
            tmpError: '',
        };
    },

    asyncComputed: {
        async accounts() {
            let accounts = [];

            try {
                // accounts = await this.getTestAccounts2();
                accounts = await this.$fNano.getLedgerAccounts();
            } catch (e) {
                this.tmpError = e;
            }

            return accounts;
        },
    },

    mounted() {
        // this.tmpTest();
    },

    methods: {
        async getTestAccounts() {
            return new Promise((_resolve) => {
                setTimeout(() => {
                    _resolve(['0x76AE07E6D236c1aE3F5C3112F387ad82c69A2471']);
                }, 1000);
            });
        },

        async getTestAccounts2() {
            let accounts = [];

            //
            accounts = await Promise.all(
                [...Array(2)].map(
                    (_val, _idx) =>
                        new Promise((_resolve) => {
                            setTimeout(() => {
                                _resolve(tmpAddr[_idx]);
                            }, (_idx + 1) * 1000);
                        })
                )
            );

            return accounts;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
