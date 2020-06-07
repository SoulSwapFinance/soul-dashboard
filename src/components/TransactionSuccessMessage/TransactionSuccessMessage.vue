<template>
    <f-card class="transaction-success-message f-card-double-padding">
        <h2>{{ title }}</h2>

        <h3 class="break-word">
            <a :href="`https://explorer.fantom.network/transactions/${tx}`" target="_blank">{{ tx | formatHash }}</a>
        </h3>

        <div class="success-icon">
            <icon data="@/assets/svg/message/check-circle.svg" width="96" height="96" aria-hidden="true" />
        </div>

        <div v-if="continueTo">
            <br />
            <button class="btn large" @click="onContinueBtnClick">Continue</button>
        </div>
    </f-card>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';

export default {
    components: { FCard },

    props: {
        /** Transaction hash */
        tx: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: 'Transaction sent!',
        },
        /** Name of component/route used in 'continue' button. */
        continueTo: {
            type: String,
            default: '',
        },
    },

    methods: {
        onContinueBtnClick() {
            if (this.continueTo === 'account-history') {
                this.$router.replace({ name: this.continueTo });
            } else {
                this.$emit('change-component', {
                    to: this.continueTo,
                    from: 'transaction-success-message',
                });
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
