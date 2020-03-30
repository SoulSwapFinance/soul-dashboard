<template>
    <div class="f-playground">
        <div class="narrow-container">
            <div class="row"><div class="col"><h1>Playground</h1></div></div>

            <div class="row"><div class="col"><h2>Cards</h2></div></div>
            <div class="row">
                <div class="col">
                    <h3>Default card</h3>
                    <f-card>
                        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos minima numquam.
                            Accusamus asperiores eaque magni nisi, perspiciatis quam repellat! Ab beatae consectetur
                            cumque dignissimos, fuga provident quod vel? Quos?
                        </div>
                    </f-card>
                </div>
                <div class="col">
                    <h3>Card with title</h3>
                    <f-card title="Title">
                        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos minima numquam.
                            Accusamus asperiores eaque magni nisi, perspiciatis quam repellat! Ab beatae consectetur
                            cumque dignissimos, fuga provident quod vel? Quos?
                        </div>
                    </f-card>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <h3>Card with title and url</h3>
                    <f-card title="Title" url="https://fantom.foundation">
                        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos minima numquam.
                            Accusamus asperiores eaque magni nisi, perspiciatis quam repellat! Ab beatae consectetur
                            cumque dignissimos, fuga provident quod vel? Quos?
                        </div>
                    </f-card>
                </div>
                <div class="col">
                    <h3>Card with title and routeUrl</h3>
                    <f-card title="Title" :routeUrl="{name: 'home'}">
                        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos minima numquam.
                            Accusamus asperiores eaque magni nisi, perspiciatis quam repellat! Ab beatae consectetur
                            cumque dignissimos, fuga provident quod vel? Quos?
                        </div>
                    </f-card>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <h3>Card with custom title slot</h3>
                    <f-card>
                        <h4 slot="title">Custom <i>title slot</i></h4>
                        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos minima numquam.
                            Accusamus asperiores eaque magni nisi, perspiciatis quam repellat! Ab beatae consectetur
                            cumque dignissimos, fuga provident quod vel? Quos?
                        </div>
                    </f-card>
                </div>
            </div>

            <div class="row"><div class="col"><h2>Buttons</h2></div></div>
            <div class="row double-col-padding">
                <div class="col">
                    <f-card>
                        <div>
                            <button>E</button>
                        </div>

                        <div>
                            <label for="sel1">test select</label>
                            <select name="bla" id="sel1">
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                            </select>
                        </div>
                    </f-card>
                </div>
                <div class="col">
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import FCard from "../components/FCard.vue";
    export default {
        components: {
            FCard
        },

        methods: {
            clickMe: function () {
                alert('jo')
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";
</style>
