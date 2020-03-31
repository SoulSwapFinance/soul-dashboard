<template>
    <header class="f-header">
        <div class="narrow-container">
            <div class="row no-collapse align-items-center">
                <div class="col-2">
                    <router-link to="/" class="logo" :aria-label="$t('view_home.back_to_home')"><img src="fantom-logo.svg" alt="" class="not-fluid"></router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    /**
     * Renderes header and takes care of navigation.
     */
    export default {
        components: {
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-header {
        /*position: -webkit-sticky;*/
        /*position: sticky;*/
        position: fixed;
        top: 0;
        z-index: 10;
        width: 100%;
        height: $f-header-height;
        color: #fff;
        background-color: $theme-color;
        transition: height $transition-length ease;

        .logo {
            > img {
                height: 44px;
                margin-bottom: 0 !important;
                transition: opacity $transition-length ease;
            }
        }
    }

    @include media-max($bp-menu) {
        .f-header {
            .logo {
                position: fixed;
                /*top: 10px;*/
                top: 14px;
                left: 16px;
                z-index: 11;

                > img {
                    max-height: 30px;
                }
            }
        }
    }
</style>
