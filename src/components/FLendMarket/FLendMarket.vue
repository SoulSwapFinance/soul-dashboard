<template>
    <div class="flendmarket">
        FLendMarket
    </div>
</template>

<script>
export default {
    name: 'FLendMarket',

    created() {
        this.init();
    },

    methods: {
        async init() {
            const info = await this.$flend.fetchReserves();

            console.log(info);
        },
    },
};
</script>
