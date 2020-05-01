<template>
    <transition :enter-active-class="dAnimationIn" :leave-active-class="dAnimationOut">
        <div
            v-if="isVisible"
            class="f-window"
            :class="cssClass"
            :style="style"
            role="dialog"
            :aria-modal="modal"
            :aria-labelledby="_ids.title"
            :aria-describedby="_ids.body"
            @keyup="onKeyup"
            @keydown="onKeydown"
        >
            <div ref="doc" role="document" tabindex="-1" class="doc">
                <header v-if="withHeader">
                    <div :id="_ids.title" class="title">
                        <!-- @slot Default to `title` prop -->
                        <slot name="title">
                            <h2>{{ title }}</h2>
                        </slot>
                    </div>
                    <div class="controls" @click="onControlsClick">
                        <!-- @slot Default to `close-btn` button -->
                        <slot name="controls">
                            <button class="btn close-btn same-size round light" title="Close window">
                                <icon data="@/assets/svg/times.svg" width="20" height="20" />
                            </button>
                        </slot>
                    </div>
                </header>

                <div :id="_ids.body" class="body">
                    <slot></slot>
                </div>

                <footer v-if="withFooter">
                    <slot name="footer"></slot>
                </footer>

                <f-overlay
                    v-if="withOverlay && isVisible"
                    ref="overlay"
                    :z-index="zIndex - 1"
                    @overlay-hide="onOverlayHide"
                />
            </div>
        </div>
    </transition>
</template>

<script>
import { getLengthAndUnit, getComputedStyle } from '../../../utils/css.js';
import { throttle } from '../../../utils/index.js';
import FOverlay from '../FOverlay/FOverlay.vue';
import { focusTrap, isKey, returnFocus, setReceiveFocusFromAttr } from '../../../utils/aria.js';

/**
 * Basic modal window following WAI-ARIA practices.
 */
export default {
    name: 'FWindow',

    components: { FOverlay },

    props: {
        /** Is window visible on initialization? */
        visible: {
            type: Boolean,
            default: false,
        },
        /** Title of window rendered in header. */
        title: {
            type: String,
            default: '',
        },
        /** Animation that starts when the window is just about to show. */
        animationIn: {
            type: String,
            default: 'fade-enter-active',
        },
        /** Animation that starts when the window is just about to hide. */
        animationOut: {
            type: String,
            default: 'fade-leave-active',
        },
        /** Is window a modal? */
        modal: {
            type: Boolean,
            default: false,
        },
        /** `<header>` will be rendered. */
        withHeader: {
            type: Boolean,
            default: true,
        },
        /** `<footer>` will be rendered. */
        withFooter: {
            type: Boolean,
            default: false,
        },
        /** `FOverlay` shows. */
        withOverlay: {
            type: Boolean,
            default: true,
        },
        /** 'fixed' | 'absolute' */
        position: {
            type: String,
            default: 'fixed',
        },
        /** `z-index` of window, if overlay is used, it has `z-index` `zIndex -1`. */
        zIndex: {
            type: Number,
            default: 10,
        },
        /** Center window horizontally. */
        centerHorizontally: {
            type: Boolean,
            default: true,
        },
        /** Center window vertically. */
        centerVertically: {
            type: Boolean,
            default: true,
        },
        /** Hide window when browser window is resized. */
        hideOnWindowResize: {
            type: Boolean,
            default: false,
        },
        /** Hide window when escape key is pressed. */
        hideOnEscapeKey: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            isVisible: false,
            dAnimationIn: this.animationIn,
            dAnimationOut: this.animationOut,
            style: {
                zIndex: this.zIndex,
            },
        };
    },

    computed: {
        cssClass() {
            return {
                'pos-absolute': this.position === 'absolute',
                'pos-fixed': this.position === 'fixed',
            };
        },
    },

    watch: {
        visible(_value) {
            this.isVisible = _value;
        },
    },

    created() {
        /** Initial css values of window. */
        this._windowStyle = {
            top: 0,
            left: 0,
            width: 0,
            maxWidth: 0,
            minWidth: 0,
            height: 0,
            maxHeight: 0,
            minHeight: 0,
            /*
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            */
            _horHalfMarginSet: false, // helper
            _verHalfMarginSet: false, // helper
        };
        /** Various ids. */
        this._ids = {
            comp: `fwin-${this._uid}`,
            title: `fwin-title-${this._uid}`,
            body: `fwin-body-${this._uid}`,
        };
        /** Debounce function used as window resize callback. */
        this._resizeCallback = throttle((_event) => this.onWindowResize(_event), 300, true);
        /** Stores first and last focusable elements in window. */
        this._firstLastFocusables = {
            first: null,
            last: null,
        };
    },

    mounted() {
        document.body.appendChild(this.$el);

        window.addEventListener('resize', this._resizeCallback, false);

        if (this.visible) {
            this.$nextTick(() => {
                this.show();
            });
        }
    },

    beforeDestroy() {
        this._firstLastFocusables = null;

        if (this._resizeCallback) {
            window.removeEventListener('resize', this._resizeCallback);
        }
    },

    destroyed() {
        this.$el.remove();
    },

    methods: {
        show(_animationIn) {
            if (!this.isVisible) {
                if (_animationIn) {
                    this.dAnimationIn = _animationIn;
                } else {
                    this.dAnimationIn = this.animationIn;
                }

                setReceiveFocusFromAttr(this._ids.comp);

                this._firstLastFocusables.first = null;
                this._firstLastFocusables.last = null;

                this.isVisible = true;

                this.$nextTick(() => {
                    getComputedStyle(this.$el, this._windowStyle);

                    this.setPosition();

                    this.focus();
                });
            }
        },

        hide(_animationOut, _byOverlay) {
            if (this.isVisible) {
                if (!_byOverlay) {
                    if (_animationOut) {
                        this.dAnimationOut = _animationOut;
                    } else {
                        this.dAnimationOut = this.animationOut;
                    }
                }

                if (this.withOverlay && !_byOverlay) {
                    this.$refs.overlay.hide();
                } else {
                    this.isVisible = false;
                }

                returnFocus(this._ids.comp);
            }
        },

        toggle() {
            if (!this.isVisible) {
                this.show();
            } else {
                this.hide();
            }
        },

        /**
         * Focus element with `data-focus` attribute or focus `.doc` by default.
         */
        focus() {
            const focusElem = this.$el.querySelector('[data-focus]');
            let inputElem = null;

            if (focusElem) {
                // try to find element with `name` attribute
                inputElem = focusElem.querySelector('[name]');
                if (inputElem) {
                    inputElem.focus();
                } else {
                    focusElem.focus();
                }
            } else {
                this.$refs.doc.focus();
            }
        },

        setPosition() {
            const style = {};

            if (this.isVisible) {
                if (this.position === 'fixed') {
                    if (this.centerHorizontally) {
                        this._setHalfMargin(style);
                        style.left = '50%';
                    }

                    if (this.centerVertically) {
                        this._setHalfMargin(style, true);
                        style.top = '50%';
                    }
                }

                this._updateStyle(style);

                this.$nextTick(() => {
                    this.correctPositionAndSize();
                });

                // defer(() => this.correctPositionAndSize());
            }
        },

        correctPositionAndSize() {
            let rect;
            // let attachMargin;
            // let pos;
            const css = {};
            const windowStyle = this._windowStyle;

            console.log('wtf?');

            if (!this.isVisible) {
                return;
            }

            if (this.position === 'fixed') {
                rect = this.$el.getBoundingClientRect();

                console.log(JSON.stringify(windowStyle));
                console.log(JSON.stringify(rect));
                console.log(JSON.stringify(document.documentElement.clientWidth));

                if (this.centerHorizontally) {
                    if (windowStyle._horHalfMarginSet && rect.left < 0) {
                        css.marginLeft = 0;
                        css.left = 0;

                        windowStyle._horHalfMarginSet = false;
                    } else if (!windowStyle._horHalfMarginSet && rect.width < document.documentElement.clientWidth) {
                        this._setHalfMargin(css);
                        css.left = '50%';
                    }
                }

                if (this.centerVertically) {
                    if (windowStyle._verHalfMarginSet && rect.top <= 0) {
                        css.marginTop = 0;
                        css.top = 0;

                        windowStyle._verHalfMarginSet = false;
                    } else if (!windowStyle._verHalfMarginSet && rect.height < document.documentElement.clientHeight) {
                        this._setHalfMargin(css, true);
                        css.top = '50%';
                    }

                    if (rect.top > 0) {
                        this._setHalfMargin(css, true);
                    }
                }

                this._updateStyle(css);
            }
        },

        _setHalfMargin(_style, _setTopMargin) {
            const margin = this._getHalfMargin(_setTopMargin);
            const windowStyle = this._windowStyle;
            let style;

            if (margin) {
                style = _style || this.$el.style;

                if (_setTopMargin) {
                    style.marginTop = margin;
                    windowStyle._verHalfMarginSet = true;
                } else {
                    style.marginLeft = margin;
                    windowStyle._horHalfMarginSet = true;
                }
            }
        },

        _getHalfMargin(_getTopMargin) {
            const windowStyle = this._windowStyle;
            const { clientHeight } = this.$el;

            if (windowStyle.height === 'auto') {
                windowStyle.height = `${clientHeight}px`;
            }

            const lau = getLengthAndUnit(
                // eslint-disable-next-line no-nested-ternary
                _getTopMargin
                    ? parseInt(windowStyle.height, 10)
                        ? `${clientHeight}px`
                        : windowStyle.maxHeight
                    : parseInt(windowStyle.maxWidth, 10)
                    ? windowStyle.maxWidth
                    : windowStyle.width
            );

            if (lau.len) {
                return -(lau.len / 2) + lau.unit;
            }
            return '';
        },

        _updateStyle(_css) {
            this.style = {
                ...this.style,
                ..._css,
            };
        },

        onWindowResize() {
            if (this.isVisible) {
                if (this.hideOnWindowResize) {
                    this.hide();
                } else {
                    this.correctPositionAndSize();
                }
            }
        },

        onOverlayHide(_hiddenByClick) {
            this.hide('', true, _hiddenByClick);
        },

        onControlsClick(_event) {
            if (_event.target.closest('.close-btn')) {
                this.hide();
            }
        },

        onKeyup(_event) {
            if (this.hideOnEscapeKey) {
                if (isKey('Escape', _event)) {
                    this.hide();
                }
            }
        },

        onKeydown(_event) {
            focusTrap(_event, this.$el, this._firstLastFocusables);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
