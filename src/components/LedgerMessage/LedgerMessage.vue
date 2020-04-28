<template>
    <f-message v-if="message" :type="messageType" with-icon class="ledger-message">
        {{ message }}
    </f-message>
</template>

<script>
import FMessage from '../core/FMessage/FMessage.vue';
import { U2FStatus } from '../../plugins/fantom-nano.js';

/**
 * Displayes ledger device status messages by given error object.
 */
export default {
    name: 'LedgerMessage',

    components: { FMessage },

    props: {
        /** Error object. */
        error: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    data() {
        return {
            messageType: 'info',
        };
    },

    computed: {
        message() {
            return this.getMessage(this.error);
        },
    },

    methods: {
        getMessage(_error) {
            let message = '';

            console.log('???', _error);

            if (_error) {
                if (_error.statusCode === U2FStatus.DEVICE_LOCKED) {
                    message = 'Please unlock the device';
                    this.messageType = 'info';
                } else if (
                    _error.originalError &&
                    _error.originalError.metaData &&
                    _error.originalError.metaData.type === 'DEVICE_INELIGIBLE'
                ) {
                    message = 'Device ineligible';
                    this.messageType = 'info';
                } else {
                    message = _error.toString();
                    this.messageType = 'error';
                    console.error(_error);
                }
            }

            return message;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
