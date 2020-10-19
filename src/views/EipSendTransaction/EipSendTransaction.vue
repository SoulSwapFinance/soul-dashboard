<template>
    <div>
        <h2>EIP Send Transaction</h2>
        <p>From: {{ from }}</p>
        <p>To: {{ to }}</p>
        <p>Value: {{ value }}</p>
        <button v-on:click="confirm">Confirm</button>
    </div>
</template>

<script>
/* global chrome */
export default {
    name: 'EipSendTransaction',

    components: {},

    data() {
        return {
            from: '',
            to: '',
            value: '',
        };
    },

    computed: {},

    methods: {
        init(request) {
            this.from = request.params[0].from;
            this.to = request.params[0].to;
            this.value = request.params[0].value;
        },

        confirm() {
            alert('ok');
        },
    },

    created() {
        chrome.runtime.sendMessage({ method: 'wallet_sendTransaction_ready' }, this.init);
    },
};
</script>
