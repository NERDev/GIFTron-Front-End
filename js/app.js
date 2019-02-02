Vue.component('navbar-items', {
    template: `<ul><navbar-logo></navbar-logo><li v-for="item in items"><navbar-button v-bind:item="item"></navbar-button></li><user-badge v-bind:user="user" v-bind:loading="loading"></user-badge></ul>`,
    props: ['user', 'loading'],
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
                //console.log("You are going to be redirected to /#" + element.item);
            }
        }
    }
});

Vue.component('user-badge', {
    template: `<li v-if="loading"><div class="lds-ellipsis"><div v-for="index in 4"></div></div></li><li v-else-if="user.username"><button v-on:mouseenter="mouse('enter')" v-on:mouseleave="mouse('leave')" v-on:click="mouse('click')" class="menuButton" id="userButton"><img v-bind:src="'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png'" />{{ user.username }}</button><user-dropdown></user-dropdown></li><li v-else-if="!user.username"><button v-on:click="login">Login</button></li>`,
    props: ['user', 'loading'],
    methods: {
        login: () => {
            window.location = "api/v1/user/auth?scope=identify+guilds";
        },
        toggle: () => {
            /*
            var dropdown = document.querySelector('.dropdown'),
                state = dropdown.style.display;
            dropdown.style.display = state ? '' : 'none';
            */
        },
        mouse: (e) => {
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
                setTimeout(() => {
                    dropdown.style.maxHeight = '100vh';                    
                }, 1);
            }
        }
    }
});

Vue.component('user-dropdown', {
    template: `<ul class="dropdown menu"><li v-for="item in items"><hr><button>{{ item }}</button></li></ul>`,
    data: () => {
        var items = [
            "My Servers",
            "Notifications",
            "Log Out"
        ];
        
        if (app.user.staff)
        {
            items.splice(0, 0, "Staff");
        };

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
            title: "GIFTron",
            loading: true
        };
    },
    mounted: () => {
        window.addEventListener('click', (e) => {
            if (!e.target.classList['menu']) {
                //console.log('closing menus');
                closeMenus(e.target);
            }
        });
    }
});

function closeMenus(element) {
    if (!element.closest('.menu') && !element.closest('.menuButton'))
    {
        var userButton = document.querySelector('#userButton'),
            dropdown = document.querySelector('.dropdown');
        userButton.parentElement.classList.remove('hover', 'shadow');
        dropdown.classList.remove('shadow');
        dropdown.style.display = 'none';
        dropdown.style.maxHeight = '';
    }
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
        if (this.status == 200) {
            app.user = JSON.parse(this.response);
        }
        app.loading = false;
    }
};
xhttp.open("GET", "api/v1/user", true);
xhttp.send();