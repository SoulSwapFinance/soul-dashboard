<template>
    <div :id="id" class="f-tab" role="tabpanel" tabindex="0" :aria-labelledby="labelledBy" :hidden="!dActive">
        <slot></slot>
    </div>
</template>

<script>
// Tab panel
import { getUniqueId } from '../../../utils';

export default {
    name: 'FTab',

    props: {
        // Tab panel id.
        id: {
            type: String,
            default() {
                return getUniqueId();
            },
        },
        // Title of tab panel shown in tab list.
        title: {
            type: String,
            default: '',
        },
        // Is tab panel active?
        active: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            // Id of tab panel label (tab). This property is set by FTabs component.
            labelledBy: '',
            // Is tab panel active?
            dActive: this.active,
        };
    },
};
</script>
