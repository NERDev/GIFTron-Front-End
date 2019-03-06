Vue.component('checkbox-slider', {
    template: `<div class="container"><p v-if="off" style="left: -25px">{{ off }}</p><label class="switch" v-bind:for="id"><input type="checkbox" v-bind:id="id" v-on:click="click" /><div class="slider round"></div></label><p v-if="on" style="right: -65px;">{{ on }}</p></div>`,
    props: ['id', 'on', 'off'],
    methods: {
        getState: function () {
            var state = document.getElementById(this.id).checked;
            if (state) {
                document.getElementById(this.id).parentElement.nextSibling.classList.add('active');
                document.getElementById(this.id).parentElement.previousSibling.classList.remove('active');
            } else {
                document.getElementById(this.id).parentElement.previousSibling.classList.add('active');
                document.getElementById(this.id).parentElement.nextSibling.classList.remove('active');
            }
        },
        click: function () {
            this.getState();
            if (this.$parent[this.id]) {
                this.$parent[this.id]();
            }
        }
    },
    mounted: function () {
        this.getState();
    }
});