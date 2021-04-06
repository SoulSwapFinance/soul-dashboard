<template>
    <div class="view-gov-home">
        <h1>Governance</h1>

        <gov-proposal-list />

        <br />
        <ballot-list />
    </div>
</template>

<script>
import GovProposalList from '@/components/data-tables/GovProposalList/GovProposalList.vue';
import BallotList from '@/components/data-tables/BallotList/BallotList.vue';

export default {
    name: 'GovHome',

    components: { BallotList, GovProposalList },
};
</script>
