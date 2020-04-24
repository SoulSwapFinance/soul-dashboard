<template>
    <div class="f-tabs">
        <ul role="tablist" class="no-markers" @click="onTabListClick" @keyup="onTabListKeyup">
            <li
                v-for="(tabPanel, idx) in dTabPanels"
                :id="ids[idx]"
                :key="`${ids[idx]}`"
                :tabindex="tabPanel.dActive ? 0 : -1"
                :aria-controls="tabPanel.id"
                :aria-selected="tabPanel.dActive"
                role="tab"
                :data-index="idx"
            >
                {{ tabPanel.title }}
            </li>
        </ul>
        <div class="f-tabs-panels">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { helpersMixin } from '../../../mixins/helpers.js';
import { getUniqueId } from '../../../utils';

export default {
    name: 'FTabs',

    mixins: [helpersMixin],

    data() {
        return {
            // Tab ids
            ids: [],
            // Array of FTab instances
            dTabPanels: [],
        };
    },

    mounted() {
        this.prepareTabs();
    },

    methods: {
        prepareTabs() {
            const tabPanels = this.getTabPanels();
            const ids = [];
            let tabPanel;
            let activePanelExists = false;

            for (let i = 0, len1 = tabPanels.length, id = ''; i < len1; i++) {
                id = getUniqueId();
                tabPanel = tabPanels[i];

                tabPanel.labelledBy = id;
                if (tabPanel.active) {
                    activePanelExists = true;
                }

                ids.push(id);
            }

            this.ids = ids;
            this.dTabPanels = tabPanels;

            if (!activePanelExists) {
                this.setActiveTabByIndex(0);
            }
        },

        getTabPanels() {
            return this.findChildrenByName('f-tab');
        },

        deactivateActivePanel() {
            const { dTabPanels } = this;

            for (let i = 0, len1 = dTabPanels.length; i < len1; i++) {
                if (dTabPanels[i].dActive) {
                    dTabPanels[i].dActive = false;
                    break;
                }
            }
        },

        /**
         * @param {int} _index
         */
        setActiveTabByIndex(_index) {
            const tabPanel = this.dTabPanels[_index];

            this.deactivateActivePanel();

            tabPanel.dActive = true;
        },

        /**
         * @param {MouseEvent} _event
         */
        onTabListClick(_event) {
            const eLi = _event.target.closest('li');
            const tabIndex = eLi ? parseInt(eLi.getAttribute('data-index')) : -1;

            if (tabIndex > -1) {
                this.setActiveTabByIndex(tabIndex);
            }
        },

        onTabListKeyup() {
            console.log('onTabListKeyup');
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
