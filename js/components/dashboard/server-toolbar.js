Vue.component('server-toolbar', {
    template: `<div id="serverToolbar" style="transform: translateY(-200px);"><h1>Select a Server</h1><checkbox-slider v-bind:id="'serverFilter'" v-bind:on="'Manage'" v-bind:off="'All'"></checkbox-slider></div>`,
    methods: {
        serverFilter: function () {
            this.$parent.filter = document.getElementById('serverFilter').checked;
        }
    }
});