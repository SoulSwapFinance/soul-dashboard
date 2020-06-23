<template>
    <div class="view-account-vote account-main-content-mt">
        <h1 class="not-visible">Vote</h1>

        <component
            :is="currentComponent"
            v-bind="currentComponentProperties"
            @change-component="onChangeComponent"
            @ballot-selected="onBallotSelected"
        ></component>
    </div>
</template>

<script>
import BallotList from '../components/data-tables/BallotList/BallotList.vue';
import BallotForm from '../components/forms/BallotForm/BallotForm.vue';

const DEFAULT_COMPONENT = 'ballot-list';

export default {
    name: 'AccountVote',

    components: {
        BallotList,
        BallotForm,
    },

    data() {
        return {
            currentComponent: DEFAULT_COMPONENT,
            // keepAliveExclude: 'BlockchainPicker',
        };
    },

    computed: {
        currentComponentProperties() {
            switch (this.currentComponent) {
                case 'ballot-form':
                    return {
                        ballot: this._data_,
                    };
                default:
                    return null;
            }
        },
    },

    created() {
        // temporary data
        this._data_ = null;
    },

    methods: {
        /**
         * @param {Object} _data
         */
        onChangeComponent(_data) {
            this._data_ = _data.data;

            this.currentComponent = _data.to;

            this.$nextTick(() => {
                this._data_ = null;
            });
        },

        onBallotSelected(_ballot) {
            this.currentComponent = 'ballot-form';

            this._data_ = _ballot;

            this.$nextTick(() => {
                this._data_ = null;
            });
        },
    },
};
</script>
