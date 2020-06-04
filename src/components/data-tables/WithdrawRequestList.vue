<template>
    <div class="withdraw-request-list-dt" @click="onClick">
        <template v-if="!withdrawRequestListError">
            <f-data-table :columns="columns" :items="dItems" first-m-v-column-width="6" fixed-header f-card-off>
                <template v-slot:column-withdrawal="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-6 f-row-label">{{ column.label }}</div>
                        <div class="col break-word">
                            <template v-if="value">{{ value }}</template>
                            <template v-else>neni :(</template>
                        </div>
                    </div>
                    <template v-else>
                        <template v-if="value">{{ formatDate(timestampToDate(value), false, true) }}</template>
                        <template v-else>
                            <button
                                :disabled="item.requestBlock.timestamp"
                                class="btn withdraw-btn"
                                :data-validator-id="value"
                            >
                                {{ withdrawBtnLabel(item.requestBlock.timestamp) }}
                            </button>
                        </template>
                    </template>
                </template>
            </f-data-table>
        </template>
        <template v-else>
            <div class="query-error">{{ withdrawRequestListError }}</div>
        </template>
    </div>
</template>

<script>
import { formatDate, formatNumberByLocale, prepareTimestamp, timestampToDate } from '../../filters.js';
import { WEIToFTM } from '../../utils/transactions.js';
import FDataTable from '../core/FDataTable/FDataTable.vue';
import dayjs from 'dayjs';

export default {
    name: 'WithdrawRequestList',

    components: { FDataTable },

    props: {
        /**
         * Data and action.
         * Actions:
         * '' - replace items
         * 'append' - append new items
         */
        items: {
            type: Array,
            default() {
                return [];
            },
        },
    },

    data() {
        return {
            dItems: [],
            withdrawRequestListError: '',
            columns: [
                {
                    name: 'amount',
                    label: 'Amount (FTM)',
                    formatter: (_value) => {
                        return formatNumberByLocale(WEIToFTM(_value));
                    },
                    width: '234px',
                },
                {
                    name: 'undelegation_time',
                    label: 'Undelegation Time',
                    itemProp: 'requestBlock.timestamp',
                    formatter: (_value) => {
                        return formatDate(timestampToDate(_value), false, true);
                    },
                },
                {
                    name: 'withdrawal',
                    label: 'Withdrawal',
                    itemProp: 'withdrawBlock.timestamp',
                },
            ],
        };
    },

    created() {
        if (this.items.length > 0) {
            this.dItems = this.items;
        }
    },

    methods: {
        /**
         * Get label for withdraw button.
         *
         * @param {string} _timestamp
         * @return {string}
         */
        withdrawBtnLabel(_timestamp) {
            return this.canNotWithdraw(_timestamp) || 'Withdraw';
        },

        /**
         * Check if amount is available to withdraw.
         *
         * @param {string} _timestamp
         * @return {string}
         */
        canNotWithdraw(_timestamp) {
            const start = dayjs(this.prepareTimestamp(_timestamp));
            const end = start.add(7, 'days');

            if (start.diff(end) < 0) {
                return end.from(start);
            } else {
                return '';
            }
        },

        onClick(_event) {
            const eWithdrawBtn = _event.target.closest('.withdraw-btn');

            if (eWithdrawBtn) {
                alert('not implemented yet');
            }
        },

        formatDate,
        timestampToDate,
        prepareTimestamp,
    },
};
</script>
