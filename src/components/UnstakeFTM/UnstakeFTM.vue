<template>
    <div class="unstake-ftm">
        <f-card class="f-card-double-padding f-data-layout">
            <h2 class="align-left">
                Undelegate FTM <span class="f-steps"><b>1</b> / 2</span>
            </h2>

            <div class="smaller-content">
                <h3>The withdrawal of your delegated tokens will take 7 days</h3>

                <div class="form-buttons align-center">
                    <button class="btn light large" @click="onPreviousBtnClick">Previous</button>
                    <button class="btn large" @click="onUndelegateBtnClick">Ok, undelegate</button>
                </div>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '../core/FCard/FCard.vue';
export default {
    name: 'UnstakeFTM',

    components: { FCard },

    props: {
        /** `accountInfo` object from `StakingInfo` component. */
        accountInfo: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    methods: {
        onPreviousBtnClick() {
            this.$emit('change-component', {
                to: 'staking-info',
                from: 'unstake-f-t-m',
            });
        },

        onUndelegateBtnClick() {
            this.$emit('change-component', {
                to: 'unstake-confirmation',
                from: 'unstake-f-t-m',
                data: {
                    accountInfo: this.accountInfo,
                },
            });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
