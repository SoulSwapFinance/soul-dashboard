<template>
    <div class="view-gov-home">
        <h1>Governance</h1>

        <gov-proposal-list />
    </div>
</template>

<script>
import GovProposalList from '@/components/data-tables/GovProposalList/GovProposalList.vue';

export default {
    name: 'GovHome',

    components: { GovProposalList },
};
</script>
