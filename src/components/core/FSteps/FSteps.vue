<template>
    <div class="f-steps">
        <div class="f-steps__cont no-markers">
            <div
                v-for="(step, index) in steps"
                :key="step.id"
                class="f-steps__step"
                :class="{ 'f-steps__step--active': index < cActive }"
            ></div>
        </div>
    </div>
</template>

<script>
import { getUniqueId } from '../../utils';

export default {
    name: 'FSteps',

    props: {
        /** Count of steps */
        count: {
            type: Number,
            default: 0,
            required: true,
        },
        /** Active step (`<1, count>`) */
        active: {
            type: Number,
            default: 1,
        },
    },

    data() {
        return {
            /** */
            steps: [],
        };
    },

    computed: {
        /**
         * @return {number}
         */
        cActive() {
            if (this.active < 1) {
                return 1;
            } else if (this.active > this.count) {
                return this.count;
            } else {
                return this.active;
            }
        },
    },

    created() {
        this.prepareSteps();
    },

    methods: {
        prepareSteps() {
            this.steps = [];

            for (let i = 0; i < this.count; i++) {
                this.steps.push({
                    id: getUniqueId(),
                    active: false,
                });
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
