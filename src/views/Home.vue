<template>
    <div class="view-home narrow-container">
        <f-playground />
    </div>
</template>

<script>
    // import FCard from "../components/FCard.vue";

    import FPlayground from "../layouts/FPlayground.vue";
    export default {
        components: {
            FPlayground
            // FCard
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";
</style>
