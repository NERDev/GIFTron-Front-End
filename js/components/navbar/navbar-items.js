Vue.component('navbar-items', {
    template: `<ul><navbar-logo></navbar-logo><li v-for="item in items"><navbar-button v-bind:item="item"></navbar-button></li><user-badge v-bind:user="user"></user-badge></ul>`,
    props: ['user'],
    data: function () {
        return {
            items: [
                { name: "Home", function: "home" },
                { name: "Dashboard", function: "dashboard" },
                { name: "Blog", function: "blog" },
                { name: "Community", function: "community" }
            ]
        };
    }
});