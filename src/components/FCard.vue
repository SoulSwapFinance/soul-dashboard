<template>
    <div class="f-card" :class="cssClass">
        <slot name="title">
            <h2 class="title" v-if="title">
                <template v-if="routeUrl">
                    <router-link :to="routeUrl">{{ title }}</router-link>
                </template>
                <template v-else-if="url">
                    <a :href="url" target="_blank" rel="nofollow">{{ title }}</a>
                </template>
                <template v-else>
                    {{ title }}
                </template>
            </h2>
        </slot>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            // Card title
            title: {
                type: String,
                default: ''
            },
            // Url of card's title link
            url: {
                type: String,
                default: ''
            },
            // Url of card's title <route-link>
            routeUrl: {
                type: Object,
                default() {
                    return null
                }
            },
            // No card style.
            off: {
                type: Boolean,
                default: false
            },
            // Use hover animation.
            hover: {
                type: Boolean,
                default: false
            },
            // Use zoom animation.
            zoomHover: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                pHover: this.hover
            }
        },

        computed: {
            cssClass() {
                return {
                    'off': this.off,
                    'f-card-hover': this.pHover,
                    'zoom': this.zoomHover
                }
            }
        },

/*
        render(_h) {
            return _h(
                'div', {
                    class: {
                        'f-card': true
                    },
                    scopedSlots: {
                        // default: props => createElement('span', props.text)
                        title: (props) => {
                            console.log(props);
                            return _h('h2', {
                                attrs: {
                                    class: 'title'
                                }
                            }, props.title);
                        }
                    }
                },
                [
                    this.$slots.default
                ]
            );
        }
*/
    }
</script>

<style lang="scss">
    .f-card:not(.off) {
        position: relative;
        padding: $f-card-padding;
        /*border: 1px solid #f8f8f8;*/
        border-radius: 20px;
        background-color: #fff;
        /*box-shadow: 0 0 40px 0 rgba(0,0,0,.06);*/
        box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.06);
        transition: box-shadow $transition-length ease, transform $transition-length ease;

        &.f-card-hover:hover {
            box-shadow: $elev6-shadow;
        }

        &.f-card-hover.zoom:hover {
            transform: scale(1.04);
        }

        .title {
            a {
                color: inherit;
                text-decoration: none;

                &::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 20px;
                    transition: box-shadow $transition-length ease;
                }

                &:hover::after, &:focus::after {
                    box-shadow: $elev6-shadow;
                    /*outline: 2px solid red;*/
                }
            }
        }

        .label {
            color: rgba(43,57,84,.5);
            display: block;
            padding-bottom: 8px;
        }
/*
        &[hover]:hover {
            box-shadow: $elev6-shadow;
        }
*/
    }
</style>
