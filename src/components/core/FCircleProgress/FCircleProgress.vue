<template>
    <div class="f-circle-progress" :class="classes">
        <svg viewBox="-50 -50 100 100">
            <circle :r="r" cx="0" cy="0" fill="none" :stroke-width="strokeWidth" class="bg-circle" />
            <circle
                ref="circle"
                :r="r"
                cx="0"
                cy="0"
                fill="none"
                :stroke-width="strokeWidth"
                stroke-dasharray="1"
                :stroke-dashoffset="dashoffset"
                transform="rotate(-90 0 0)"
                pathLength="1"
                class="circle"
            />
            <text text-anchor="middle" dominant-baseline="central" class="text">
                <slot :value="cValue" :percentage="percentage" :showPercentage="showPercentage">
                    <template v-if="showPercentage">
                        <tspan>{{ percentage }}</tspan>
                        <tspan dominant-baseline="auto" class="text-percentage" dx="3">%</tspan>
                    </template>
                    <template v-else>
                        {{ cValue }}
                    </template>
                </slot>
            </text>
        </svg>
    </div>
</template>

<script>
/**
 *
 */
export default {
    name: 'FCircleProgress',

    props: {
        /** Current value. */
        value: {
            type: Number,
            default: 10,
        },
        /** Minimal value. */
        from: {
            type: Number,
            default: 0,
        },
        /** Maximal value. */
        to: {
            type: Number,
            default: 100,
        },
        /**
         * Colors of circle stroke by value.
         * If current value is equal or bigger than value from array, color from array will be used.
         * @type {{color: string, value: number}[]}
         */
        colors: {
            type: Array,
            default() {
                return [];
            },
        },
        /** Width of circle stroke. */
        strokeWidth: {
            type: Number,
            default: 5,
        },
        /** Animate progress circle. */
        animate: {
            type: Boolean,
            default: true,
        },
        /** Show percentage rather than value. */
        showPercentage: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            r: 50 - this.strokeWidth / 2,
        };
    },

    computed: {
        cValue() {
            let value = this.value;

            // Clamp value
            if (isNaN(value) || value < this.from) {
                value = this.from;
            } else if (value > this.to) {
                value = this.to;
            }

            this.setCircleStrokeColor(value);

            return value;
        },

        percentage() {
            return Math.round(((this.cValue - this.from) / (this.to - this.from)) * 100);
        },

        dashoffset() {
            return 1 - this.percentage / 100;
        },

        classes() {
            return {
                animate: this.animate,
            };
        },
    },

    created() {
        if (this.to < this.from) {
            throw new Error("'to' must be bigger than 'from'");
        }
    },

    mounted() {
        this.setCircleStrokeColor(this.cValue);
    },

    methods: {
        /**
         * Set circle stroke color according to current value and `this.colors` array.
         *
         * @param {number} _value
         */
        setCircleStrokeColor(_value) {
            const { colors } = this;

            if (colors.length > 0 && this.$el) {
                let color = 'default';

                for (let i = colors.length - 1; i >= 0; i--) {
                    if (_value >= colors[i].value) {
                        color = colors[i].color;
                        break;
                    }
                }

                if (color !== 'default') {
                    this.$el.style.setProperty('--f-circle-progress-circle-color', color);
                } else {
                    this.$el.style.setProperty('--f-circle-progress-circle-color', '');
                }
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
