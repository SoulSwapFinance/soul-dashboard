<template>
    <div class="ledger-account-picker">
        Dummy data
        <ul v-if="accounts" class="no-markers ledger-accounts-list">
            <li v-for="account in accounts" :key="account.address">
                <router-link
                    :to="{
                        name: 'account-dashboard',
                        params: { address: account.address },
                    }"
                    class="break-word fs-big"
                    aria-label="Address"
                >
                    {{ account.address }}
                </router-link>
            </li>
        </ul>
        <div v-if="$asyncComputed.accounts.updating">
            Loading...
        </div>
        <f-message v-if="$asyncComputed.accounts.error" type="error" with-icon>
            An error
        </f-message>
    </div>
</template>

<script>
import FMessage from '../core/FMessage/FMessage.vue';

export default {
    components: { FMessage },

    asyncComputed: {
        accounts() {
            // TMP!
            return new Promise((_resolve) => {
                setTimeout(() => {
                    _resolve([
                        {
                            address: '0x76AE07E6D236c1aE3F5C3112F387ad82c69A2471',
                        },
                    ]);
                }, 1000);
            });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
