<template>
    <div class="ratio-info" :class="{ 'collateral-ratio': displayCollateralRatio }">
        <template v-if="displayCollateralRatio">
            <template v-if="displayCircle">
                <slot name="ratio-info-title">
                    <h3>C-Ratio</h3>
                </slot>
                <f-circle-progress
                    can-exceed
                    :stroke-width="6"
                    :animate="false"
                    :from="minValue"
                    :to="1000"
                    :colors="collateralRatioColors"
                    :value="parseInt(value)"
                >
                    <template #value>
                        <tspan>
                            <template v-if="value > maxPercentage"
                                ><tspan style="font-size: 50%;">&gt;</tspan> {{ maxPercentage }}</template
                            >
                            <template v-else>{{ parseInt(value) }}</template>
                        </tspan>
                    </template>
                </f-circle-progress>
            </template>
            <template v-else>
                <slot name="ratio-info-title">
                    <h3 class="label">C-Ratio</h3>
                </slot>
                <div class="value">
                    <f-placeholder :content-loaded="contentLoaded" replacement-text="99%">
                        <f-colored-number-range
                            show-percentage
                            :from="minValue"
                            :to="1000"
                            :colors="collateralRatioColors"
                            :value="parseInt(value)"
                        >
                            <template>
                                <template v-if="value > maxPercentage">
                                    <span style="font-size: 50%; position: relative; top: -4px;">&gt;</span>
                                    {{ maxPercentage }}%
                                </template>
                                <template v-else>{{ parseInt(value) }}%</template>
                            </template>
                        </f-colored-number-range>
                    </f-placeholder>
                </div>
            </template>
        </template>
        <template v-else>
            <template v-if="displayCircle">
                <slot name="ratio-info-title">
                    <h3>Debt Limit <debt-limit-f-info /></h3>
                </slot>
                <f-circle-progress
                    show-percentage
                    can-exceed
                    :stroke-width="6"
                    :animate="false"
                    :from="minValue"
                    :to="maxValue"
                    :colors="debtLimitColors"
                    :value="value"
                />
            </template>
            <template v-else>
                <slot name="ratio-info-title">
                    <h3 class="label">Debt Limit <debt-limit-f-info /></h3>
                </slot>
                <div class="value">
                    <f-placeholder :content-loaded="contentLoaded" replacement-text="99%">
                        <f-colored-number-range
                            show-percentage
                            :from="minValue"
                            :to="maxValue"
                            :colors="debtLimitColors"
                            :value="value"
                        />
                    </f-placeholder>
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import DebtLimitFInfo from '@/components/DebLimitFInfo/DebtLimitFInfo.vue';
import FCircleProgress from '@/components/core/FCircleProgress/FCircleProgress.vue';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import FColoredNumberRange from '@/components/core/FColoredNumberRange/FColoredNumberRange.vue';
/**
 * Displays info about collateral ratio or debt limit.
 */
export default {
    name: 'RatioInfo',

    components: { FColoredNumberRange, FPlaceholder, FCircleProgress, DebtLimitFInfo },

    props: {
        /** Current value. */
        value: {
            type: Number,
            default: 0,
        },
        /** Minimal value. */
        minValue: {
            type: Number,
            default: 0,
        },
        /** Maximal value. */
        maxValue: {
            type: Number,
            default: 100,
        },
        /** If value of this property is `false`, display debt limit. */
        displayCollateralRatio: {
            type: Boolean,
            default: true,
        },
        /** If value of this property is `false`, display just colored number. */
        displayCircle: {
            type: Boolean,
            default: true,
        },
        /** */
        contentLoaded: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            maxPercentage: 5000,
        };
    },

    computed: {
        debtLimitColors() {
            return this.$defi.getDebtLimitColors();
        },

        collateralRatioColors() {
            return this.$defi.getCollateralRatioColors();
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
