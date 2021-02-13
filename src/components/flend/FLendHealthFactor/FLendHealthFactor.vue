<template>
    <div class="flendhealthfactor">
        <h3>Health factor</h3>
        <template v-if="displayCircle">
            <f-circle-progress
                show-percentage
                can-exceed
                :stroke-width="6"
                :animate="false"
                :from="minValue"
                :to="maxValue"
                :colors="colors"
                :value="value"
            />
        </template>
        <template v-else>
            <f-placeholder :content-loaded="contentLoaded" replacement-text="99%">
                <f-colored-number-range
                    show-percentage
                    :from="minValue"
                    :to="maxValue"
                    :colors="colors"
                    :value="value"
                />
            </f-placeholder>
        </template>
    </div>
</template>

<script>
import FCircleProgress from '@/components/core/FCircleProgress/FCircleProgress.vue';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';
import FColoredNumberRange from '@/components/core/FColoredNumberRange/FColoredNumberRange.vue';

export default {
    name: 'FLendHealthFactor',

    components: { FColoredNumberRange, FPlaceholder, FCircleProgress },

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
            colors: [],
        };
    },
};
</script>
