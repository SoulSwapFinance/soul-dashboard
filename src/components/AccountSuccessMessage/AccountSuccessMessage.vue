<template>
    <div class="account-success-message">
        <f-card>
            <h2 class="align-center">You're all set!</h2>
            <p>You have successfully created your wallet.</p>
            <router-link
                :to="{
                    name: 'account',
                    params: { address: this.address },
                }"
                class="btn large secondary"
            >
                Access your wallet
            </router-link>
        </f-card>
    </div>
</template>

<script>
import FCard from '../../components/core/FCard/FCard.vue';

export default {
    components: { FCard },

    props: {
        address: {
            type: String,
            default: '',
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
