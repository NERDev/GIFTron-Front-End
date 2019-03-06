Vue.component('navbar-loader', {
    template: `<div class="loader" v-show="loading" v-bind:style="{width: status + '%'}"></div>`,
    data() {
        return {
            status: 0,
            loading: false
        }
    },
    methods: {
        update: function () {
            if (this.$root.$refs[this.$root.page]) {
                this.status = this.$root.$refs[this.$root.page].status;
                this.loading = this.$root.$refs[this.$root.page].loading;
            } else {
                this.status = 0;
                this.loading = false;
            }
        }
    }
});