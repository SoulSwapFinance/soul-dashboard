<template>
    <div class="view-defi-mint">
        DeFi Mint

        <f-circle-progress show-percentage :animate="false" :colors="circleColor" :value="progress" />
    </div>
</template>

<script>
import FCircleProgress from '../../components/core/FCircleProgress/FCircleProgress.vue';

export default {
    name: 'DefiMint',

    components: { FCircleProgress },

    data() {
        return {
            tmp: '25',
            progress: 0,
            circleColor: [
                {
                    value: 30,
                    color: 'green',
                },
                {
                    value: 75,
                    color: 'red',
                },
            ],
        };
    },

    created() {
        this.progress = parseFloat(this.tmp);
    },

    methods: {
        onDefiPriceInputChange(_data) {
            this.progress = parseFloat(_data);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
