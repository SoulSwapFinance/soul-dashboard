<template>
    <div role="alert" aria-atomic="true" class="not-visible">
        <span v-for="(msg, index) in messages" :key="`faa-${index}`">{{ msg }}</span>
    </div>
</template>

<script>
import { eventBusMixin } from '../../../mixins/event-bus.js';

/**
 * Notifies assistive technologies about important messages - input errors etc.
 * Listens to these events on event bus:
 * 'aria-alert-append', 'aria-alert-replace' and 'aria-alert-clear'
 */
export default {
    mixins: [eventBusMixin],

    data() {
        return {
            // alert messages
            messages: [],
        };
    },

    created() {
        this._eventBus.on('aria-alert-append', this.append);
        this._eventBus.on('aria-alert-replace', this.replace);
        this._eventBus.on('aria-alert-clear', this.clear);
    },

    methods: {
        append(_msg) {
            // console.log('append', _msg);
            this.messages.push(_msg);
        },
        replace(_msg) {
            // console.log('replace', _msg);
            this.messages = [_msg];
        },
        clear() {
            // console.log('clear');
            this.messages = [];
        },
    },
};
</script>
