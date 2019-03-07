Vue.component('user-badge', {
    template: `<li><user-loader v-if="loading"></user-loader><button v-if="user.username" v-on:mouseenter="mouse('enter')" v-on:mouseleave="mouse('leave')" v-on:click="mouse('click')" class="menuButton userButton" id="userButton"><img v-bind:src="avatar" />{{ user.username }}<i class="fas fa-lock" v-show="user.mfa_enabled" title="2FA Enabled"></i></button><user-dropdown v-bind:user="user"></user-dropdown><button v-if="!user.username && !loading" v-on:click="login">Login</button></li>`,
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
                    button.parentElement.classList.add('shadow');
                    anime({
                        targets: '.userButton',
                        translateY: -2
                    });
                    //console.log('enter');
                }
            }
            if (e == 'leave') {
                if (dropdown.style.display != 'list-item') {
                    button.parentElement.classList.remove('shadow');
                    anime({
                        targets: '.userButton',
                        translateY: 0
                    });
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
            if (!!userButton && !!dropdown) {
                userButton.parentElement.classList.remove('shadow');
                anime({
                    targets: '.userButton',
                    translateY: 0
                });
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
        xhttp.open("GET", "api/v1/user/", true);
        xhttp.send();

        window.addEventListener('click', (e) => {
            if (!e.target.closest('.menu') && !e.target.closest('.menuButton')) {
                vm.close();
            }
        });
    }
});