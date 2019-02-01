Vue.component('navbar-items', {
    template: `<ul><navbar-logo></navbar-logo><li v-for="item in items"><navbar-button v-bind:item="item"></navbar-button></li><user-badge v-bind:user="user"></user-badge></ul>`,
    props: ['user'],
    data: () => {
        return {
            items: [
                "Dashboard",
                "Blog",
                "Community"
            ]
        };
    }
});

Vue.component('navbar-button', {
    template: `<button v-on:click="navclick({item})">{{ item }}</button>`,
    props: ['item'],
    methods: {
        navclick: (element) => {
            if (element.item == 'Login') {
                window.location = "api/v1/user/auth?scope=identify+guilds";
            } else {
                console.log("You are going to be redirected to /#" + element.item);
            }
        }
    }
});

Vue.component('user-badge', {
    template: `<li v-if="user.username"><button v-on:click="toggle"><img v-bind:src="'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png'" />{{ user.username }}</button><user-dropdown></user-dropdown></li><li v-else-if="!user.username"><button v-on:click="login">Login</button></li>`,
    props: ['user'],
    methods: {
        login: () => {
            window.location = "api/v1/user/auth?scope=identify+guilds";
        },
        toggle: () => {
            
        }
    }
});

Vue.component('user-dropdown', {
    template: `<ul class="dropdown"><li v-for="item in items">{{ item }}<hr></li></ul>`,
    data: () => {
        return {
            items: [
                "Profile",
                "My Servers",
                "Notifications",
                "Log Out"
            ]
        }
    }
})

Vue.component('navbar-logo', {
    template: `<li><button>Logo</button></li>`
});

var app = new Vue({
    el: 'main',
    data() {
        return {
            user: {},
            title: "GIFTron"
        };
    }
});


var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        // Action to be performed when the document is read;
        app.user = JSON.parse(this.response);
        app.loading = false;
    }
};
xhttp.open("GET", "api/v1/user", true);
xhttp.send();