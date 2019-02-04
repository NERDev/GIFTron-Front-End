Vue.component('navbar-items', {
    template: `<ul><navbar-logo></navbar-logo><li v-for="item in items"><navbar-button v-bind:item="item"></navbar-button></li><user-badge v-bind:user="user"></user-badge></ul>`,
    props: ['user'],
    data: function () {
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
    template: `<li><user-loader v-if="loading"></user-loader><button v-if="user.username" v-on:mouseenter="mouse('enter')" v-on:mouseleave="mouse('leave')" v-on:click="mouse('click')" class="menuButton" id="userButton"><img v-bind:src="avatar" />{{ user.username }}</button><user-dropdown v-bind:user="user"></user-dropdown><button v-if="!user.username && !loading" v-on:click="login">Login</button></li>`,
    props: ['user'],
    data() {
        var avatar;
        return {
            loading: true,
            avatar
        }
    },
    methods: {
        login: function () {
            window.location = "api/v1/user/auth?scope=identify+guilds";
        },
        mouse: function (e) {
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
                setTimeout(function () {
                    dropdown.style.maxHeight = '100vh';
                }, 1);
            }
        },
        close: function () {
            var userButton = document.querySelector('#userButton'),
                dropdown = document.querySelector('.dropdown');
            if (userButton && dropdown) {
                userButton.parentElement.classList.remove('hover', 'shadow');
                dropdown.classList.remove('shadow');
                dropdown.style.display = 'none';
                dropdown.style.maxHeight = '';
            }
        }
    },
    mounted: function () {
        var vm = this,
            xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                vm.loading = false;
                if (this.status == 200) {
                    vm.$root.user = JSON.parse(this.response);
                    if (vm.$root.user.avatar) {
                        vm.avatar = 'https://cdn.discordapp.com/avatars/' + vm.$root.user.id + '/' + vm.$root.user.avatar + '.png'
                    } else {
                        vm.avatar = 'https://cdn.discordapp.com/embed/avatars/' + vm.$root.user.discriminator % 5 + '.png'
                    };
                }
            }
        };
        xhttp.open("GET", "api/v1/user", true);
        xhttp.send();

        window.addEventListener('click', (e) => {
            if (!e.target.closest('.menu') && !e.target.closest('.menuButton')) {
                vm.close();
            }
        });
    }
});

Vue.component('user-dropdown', {
    template: `<ul class="dropdown menu"><li if="user.staff"><button v-on:click="click('staff')">Staff</button></li><li v-for="item in items"><hr><button v-on:click="click(item.function)">{{ item.name }}</button></li></ul>`,
    props: ['user'],
    data() {
        //need to handle this part on mounted
        var items = [
            { name: "My Servers", function: "servers" },
            { name: "Notifications", function: "notifications" },
            { name: "Log Out", function: "logout" }
        ];

        return {
            items
        }
    },
    methods: {
        click: function (e) {
            console.log('Clicked ' + e);
            switch (e) {
                case 'staff':

                    break;
                case 'servers':

                    break;
                case 'notifications':

                    break;
                case 'logout':
                    this.$root.user = {};
                    this.$root.delete_cookie('session');
                    this.$parent.close();
                    break;
            }
        }
    }
})

Vue.component('navbar-logo', {
    template: `<li><button><svg width="424.89" height="112.5" version="1.1" viewBox="0 0 112.42 29.77" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <metadata>
    <rdf:RDF>
    <cc:Work rdf:about="">
    <dc:format>image/svg+xml</dc:format>
    <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
    <dc:title/>
    </cc:Work>
    </rdf:RDF>
    </metadata>
    <text transform="translate(-36.84 -134.88)" x="95.78" y="136.93" font-family="Arsenal" font-size="10.58" font-weight="400" letter-spacing="0" stroke-width=".26" text-align="center" text-anchor="middle" word-spacing="0" style="line-height:1.25"/>
    <path d="M1.5 10.32c-.83 0-1.5.67-1.5 1.5v6.13c0 .83.67 1.5 1.5 1.5h6.13c.83 0 1.5-.67 1.5-1.5v-6.13c0-.83-.67-1.5-1.5-1.5zm-.04 1.19h.76l1.45 2.33-.03-.24v-2.1h.45v3.45h-.57L1.9 12.37h-.01l.04.3v2.28h-.46zM11.82 10.32c-.83 0-1.5.67-1.5 1.5v6.13c0 .83.67 1.5 1.5 1.5h6.13c.83 0 1.5-.67 1.5-1.5v-6.13c0-.83-.67-1.5-1.5-1.5zm.3 1.19h2.06v.38h-1.33v1.13h1.17v.37h-1.17v1.18h1.4v.38h-2.13zM22.14 10.32c-.83 0-1.5.67-1.5 1.5v6.13c0 .83.67 1.5 1.5 1.5h6.13c.83 0 1.5-.67 1.5-1.5v-6.13c0-.83-.67-1.5-1.5-1.5zm.15 1.19h1.06c.39 0 .7.1.91.29.22.18.33.45.33.79a1.03 1.03 0 0 1-.6.96l.8 1.4h-.84l-.65-1.25h-.28v1.25h-.73zm.73.34v1.5h.27c.13 0 .23-.02.3-.06a.38.38 0 0 0 .16-.23c.04-.1.05-.25.05-.44 0-.27-.04-.47-.12-.59-.08-.12-.21-.18-.4-.18zM17.11 20.64c-.83 0-1.5.67-1.5 1.5v6.13c0 .83.67 1.5 1.5 1.5h6.13c.83 0 1.5-.67 1.5-1.5v-6.13c0-.83-.67-1.5-1.5-1.5zm-.2 1.19h.77l.82 2.9h.02l.88-2.9h.46l-1.1 3.44h-.82zM8.9 0c-.82 0-1.5.67-1.5 1.5v6.13c0 .83.68 1.5 1.5 1.5h6.14c.83 0 1.5-.67 1.5-1.5V1.5c0-.83-.67-1.5-1.5-1.5zm-.02 1.2h1.17c.54 0 .94.14 1.23.44.29.29.43.72.43 1.28s-.14.98-.42 1.28c-.28.29-.7.43-1.23.43H8.88zm.73.37v2.68h.45c.2 0 .37-.04.49-.12a.75.75 0 0 0 .27-.42c.06-.2.08-.46.08-.79s-.03-.6-.09-.8a.76.76 0 0 0-.26-.42.83.83 0 0 0-.5-.13z" fill="#99aab5"/>
    <path d="M44.03 17.69q1.53 2.19 2.5 3.88h.06q-.13-2.78-.13-4.05v-6.48h2.62v14.3h-2.75l-4.65-6.58q-1.23-1.71-2.54-3.97h-.07q.13 2.63.13 4.07v6.47h-2.62V11.04h2.75zM54.08 23.14h7.02v2.2h-9.64v-14.3h9.26v2.2h-6.64v3.69h5.7v2.19h-5.7zM73.4 15.34q0 1.5-.83 2.54-.82 1.04-2.55 1.54v.04l4.25 5.87h-3.14l-3.89-5.53h-1.8v5.53h-2.6V11.04h4.34q1.08 0 2 .13.94.12 1.6.37 1.26.48 1.94 1.43.68.94.68 2.37zm-6.66 2.27q.9 0 1.52-.07.63-.09 1.05-.25.8-.3 1.1-.81.3-.52.3-1.2 0-.57-.24-1.01-.24-.45-.81-.7-.38-.18-.94-.25-.57-.09-1.4-.09h-1.87v4.38z" fill="#666" font-family="Corbel" font-size="21.87" font-weight="700" letter-spacing="0" word-spacing="0"/>
    <path d="M75.53 25.33V11.04h3.78q.5 0 1.01.04.53.03 1.02.1.49.06.95.15.46.09.84.22 1.15.36 2.02.98.88.62 1.46 1.46.6.85.9 1.9.31 1.03.31 2.25 0 1.15-.26 2.16-.25 1-.77 1.84-.53.83-1.33 1.47-.79.63-1.88 1.04-.9.34-2.06.51-1.15.17-2.6.17zm3.7-2.19q2.29 0 3.58-.63 1.15-.56 1.73-1.64.59-1.08.59-2.76 0-.87-.2-1.58-.18-.7-.55-1.25-.36-.55-.88-.95-.52-.4-1.17-.65-.6-.23-1.35-.34-.75-.1-1.68-.1h-1.15v9.9zM91.64 23.14h7.03v2.2h-9.65v-14.3h9.26v2.2h-6.64v3.69h5.7v2.19h-5.7zM105.7 21.84l.56-1.65.74-2.04 2.65-7.1h2.77l-5.59 14.28h-2.35L98.9 11.04h2.79l2.65 7.1q.56 1.54.73 2.05l.58 1.65z" fill="#99aab5" font-family="Corbel" font-size="21.87" font-weight="700" letter-spacing="0" word-spacing="0"/>
    </svg></button></li>`
});

var app = new Vue({
    el: 'main',
    data() {
        return {
            user: {},
            title: "GIFTron"
        };
    },
    methods: {
        delete_cookie: function (name) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
        }
    },
    mounted: function () {
        var myScrollbar = new GeminiScrollbar({
            element: document.querySelector('#content')
        }).create();
    }
});