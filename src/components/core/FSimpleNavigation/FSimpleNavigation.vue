<template>
    <div class="f-navigation">
        <nav>
            <slot>
                <ul v-if="cItems" class="no-markers">
                    <li v-for="item in cItems" :key="item.id">
                        <router-link :to="item.url" :class="{ disabled: item.disabled }" :title="item.linkTitle">
                            <icon
                                v-if="item.icon"
                                :data="item.icon"
                                :width="item.iconSize || '32'"
                                :height="item.iconSize || '32'"
                            />
                            <span class="title">{{ item.title }}</span>
                        </router-link>
                    </li>
                </ul>
            </slot>
        </nav>
    </div>
</template>

<script>
import { helpersMixin } from '../../../mixins/helpers.js';

export default {
    mixins: [helpersMixin],

    props: {
        /**
         * Array of navigation links.
         *
         * @type {{title: string, url: string}[]}
         */
        items: {
            type: Array,
            default() {
                return [];
            },
        },
    },

    computed: {
        cItems() {
            this.setIds(this.items);

            return this.items;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
