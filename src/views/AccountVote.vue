<template>
    <div class="view-account-vote account-main-content-mt">
        <h1 class="not-visible">Vote</h1>

        <component
            :is="currentComponent"
            v-bind="currentComponentProperties"
            @change-component="onChangeComponent"
            @ballot-selected="onBallotSelected"
            @f-form-submit="onBallotFormSubmit"
        ></component>
    </div>
</template>

<script>
import BallotList from '../components/data-tables/BallotList/BallotList.vue';
import BallotForm from '../components/forms/BallotForm/BallotForm.vue';
import BallotConfirmation from '../components/BallotConfirmation/BallotConfirmation.vue';
import TransactionSuccessMessage from '../components/TransactionSuccessMessage/TransactionSuccessMessage.vue';
import { eventBusMixin } from '../mixins/event-bus.js';

const DEFAULT_COMPONENT = 'ballot-list';

export default {
    name: 'AccountVote',

    components: {
        BallotList,
        BallotForm,
        BallotConfirmation,
        TransactionSuccessMessage,
    },

    mixins: [eventBusMixin],

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
                case 'ballot-confirmation':
                    return this._data_;
                case 'transaction-success-message':
                    return this._data_;
                default:
                    return null;
            }
        },
    },

    created() {
        // temporary data
        this._data_ = null;

        this._eventBus.on('account-picked', this.onAccountPicked);
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

        onBallotFormSubmit(_event) {
            this.currentComponent = 'ballot-confirmation';

            this._data_ = _event.detail.data;

            this.$nextTick(() => {
                this._data_ = null;
            });
        },

        onAccountPicked() {
            if (this.currentComponent !== DEFAULT_COMPONENT) {
                this.currentComponent = DEFAULT_COMPONENT;
            } else {
                // to reset send-transaction-form properly
                this.currentComponent = '';
                this.$nextTick(() => {
                    this.currentComponent = DEFAULT_COMPONENT;
                });
            }
        },
    },
};
</script>
