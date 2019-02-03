Vue.component('navbar-items', {
    template: `<ul><navbar-logo></navbar-logo><li v-for="item in items"><navbar-button v-bind:item="item"></navbar-button></li><user-badge v-bind:user="user"></user-badge></ul>`,
    props: ['user'],
    data: function() {
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
                //console.log("You are going to be redirected to /#" + element.item);
            }
        }
    }
});

Vue.component('user-loader', {
    template: `<div class="lds-ellipsis"><div v-for="index in 4"></div></div>`
})

Vue.component('user-badge', {
    template: `<li><user-loader v-if="loading"></user-loader><button v-if="user.username" v-on:mouseenter="mouse('enter')" v-on:mouseleave="mouse('leave')" v-on:click="mouse('click')" class="menuButton" id="userButton"><img v-if="user.avatar" v-bind:src="'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png'" />{{ user.username }}</button><user-dropdown v-bind:user="user"></user-dropdown><button v-if="!user.username && !loading" v-on:click="login">Login</button></li>`,
    props: ['user'],
    data () {
        return {
            loading: true
        }
    },
    methods: {
        login: function() {
            window.location = "api/v1/user/auth?scope=identify+guilds";
        },
        mouse: function(e) {
            var button = document.getElementById('userButton'),
                dropdown = document.querySelector('.dropdown');
            if (e == 'enter') {
                if (dropdown.style.display != 'list-item') {
                    button.parentElement.classList.add('hover', 'shadow');
                    //console.log('enter');
                }
            }
            if (e == 'leave') {
                if (dropdown.style.display != 'list-item') {
                    button.parentElement.classList.remove('hover', 'shadow');
                    //console.log('leave');
                }
            }
            if (e == 'click') {
                button.parentElement.classList.remove('shadow');
                dropdown.classList.add('shadow');
                dropdown.style.display = 'list-item';
                setTimeout(function() {
                    dropdown.style.maxHeight = '100vh';                    
                }, 1);
            }
        }
    },
    mounted: function() {
        var vm = this,
            xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                vm.loading = false;
                if (this.status == 200) {
                    app.user = JSON.parse(this.response);
                }
            }
        };
        xhttp.open("GET", "api/v1/user", true);
        xhttp.send();
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.menu') && !e.target.closest('.menuButton')) {
                var userButton = document.querySelector('#userButton'),
                    dropdown = document.querySelector('.dropdown');
                if (userButton && dropdown) {
                    userButton.parentElement.classList.remove('hover', 'shadow');
                    dropdown.classList.remove('shadow');
                    dropdown.style.display = 'none';
                    dropdown.style.maxHeight = '';
                }
            }
        });
    }
});

Vue.component('user-dropdown', {
    template: `<ul class="dropdown menu"><li if="user.staff"><button>Staff</button></li><li v-for="item in items"><hr><button>{{ item }}</button></li></ul>`,
    props: ['user'],
    data () {
        var items = [
            "My Servers",
            "Notifications",
            "Log Out"
        ];

        return {
            items
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