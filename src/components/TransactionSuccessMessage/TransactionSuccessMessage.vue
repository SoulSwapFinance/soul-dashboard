<template>
    <f-card class="transaction-success-message f-card-double-padding" :off="cardOff">
        <h2>{{ title }}</h2>

        <h3 class="break-word">
            <a :href="`${explorerUrl}transactions/${tx}`" target="_blank">
                <f-ellipsis :text="tx" overflow="middle" />
            </a>
        </h3>

        <div class="success-icon">
            <icon data="@/assets/svg/message/check-circle.svg" width="96" height="96" aria-hidden="true" />
        </div>

        <div v-if="continueTo">
            <button class="btn large" @click="onContinueBtnClick">Continue</button>
        </div>
    </f-card>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
import appConfig from '../../../app.config.js';
import FEllipsis from '../core/FEllipsis/FEllipsis.vue';

export default {
    components: { FEllipsis, FCard },

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
        /** `continueTo` is name of route. */
        continueToIsRoute: {
            type: Boolean,
            default: false,
        },
        /** Don't render card */
        cardOff: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            explorerUrl: appConfig.explorerUrl,
        };
    },

    methods: {
        onContinueBtnClick() {
            if (this.continueTo === 'account-history' || this.continueToIsRoute) {
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
