<template>
    <div class="f-navigation">
        <nav>
            <slot>
                <ul v-if="cItems" class="no-markers">
                    <li v-for="item in cItems" :key="item.id">
                        <router-link :to="item.url">{{ item.title }}</router-link>
                    </li>
                </ul>
            </slot>
        </nav>
    </div>
</template>

<script>
import helpers from '../mixins/helpers.js';

export default {
    mixins: [helpers],

    props: {
        /**
         * Array of navigation links.
         *
         * One item is an object with keys:
         * `url` - link url
         * `title` - link title
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
