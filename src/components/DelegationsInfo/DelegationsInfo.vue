<template>
    <div class="delegations-info">
        <f-card class="f-card-double-padding f-data-layout">
            <staking-overview />
        </f-card>

        <f-card class="f-data-layout account-main-content-mt">
            <delegation-list :account-address="currentAccount.address" @row-action="onRowAction" />
            <div class="add-delegation-cont">
                <button class="btn large" type="button" @click="onAddDelegationBtnClick">
                    <icon data="@/assets/svg/plus.svg" width="16" height="16" aria-hidden="true" /> Add delegation
                </button>
            </div>
        </f-card>
    </div>
</template>

<script>
import FCard from '@/components/core/FCard/FCard.vue';
import DelegationList from '@/components/data-tables/DelegationList/DelegationList.vue';
import { mapGetters } from 'vuex';
import StakingOverview from '@/components/StakingOverview/StakingOverview.vue';

export default {
    name: 'DelegationsInfo',

    components: { StakingOverview, DelegationList, FCard },

    computed: {
        ...mapGetters(['currentAccount']),
    },

    methods: {
        onAddDelegationBtnClick() {
            this.$emit('change-component', {
                to: 'stake-form',
                from: 'delegations-info',
                data: {
                    increaseDelegation: false,
                    stakerInfo: {
                        stakerInfo: {
                            name: 'Unknown',
                        },
                    },
                    previousComponent: 'delegations-info',
                },
            });
        },

        /**
         * @param {object} _item
         */
        onRowAction(_item) {
            this.$emit('change-component', {
                to: 'staking-info',
                from: 'delegations-info',
                data: {
                    stakerId: _item.delegation.toStakerId,
                },
            });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
