<template>
    <div class="delegations-info">
        <f-card class="f-card-double-padding f-data-layout">
            <div class="align-center">
                <button class="btn large" type="button" @click="onAddDelegationBtnClick">
                    <icon data="@/assets/svg/plus.svg" width="16" height="16" aria-hidden="true" /> Add delegation
                </button>
            </div>
            Delegation List
        </f-card>
    </div>
</template>

<script>
import FCard from '@/components/core/FCard/FCard.vue';
export default {
    name: 'DelegationsInfo',

    components: { FCard },

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
    },
};
</script>
