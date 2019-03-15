Vue.component('server-card', {
    template: `<li style="transform: scale(0)" v-bind:class="'serverCard ' + 'serverCard-' + id" v-if="info" v-show="(manage - filter >= 0) && (!hidden)">
                    <i v-bind:class="visibility('class')" v-on:click="visibility('toggle',$event)"></i>
                    <button v-bind:id="'serverButton-' + id" v-on:mouseenter="mouse('enter')" v-on:mouseleave="mouse('leave')" v-on:click="mouse('click')">
                        <img v-if="icon" v-bind:src="icon">
                        <h1 v-if="!icon" v-bind:style="'font-size: ' + sizeFont(short(info.name).length) + 'em; padding-top: ' + (1 / short(info.name).length) * .25 + 'em;'">{{ short(info.name) }}</h1>
                        <h3>{{ info.name }}</h3>
                    </button>
                </li>`,
    props: ['id', 'manage', 'filter'],
    data: function () {
        return {
            info: null,
            stillLoading: true,
            icon: null,
            hidden: false
        }
    },
    methods: {
        visibility: function (f, e) {
            var vm = this;
            var states = [
                'fa-times',
                'fa-eye-slash'
            ];

            if (f == 'class') {
                if (typeof (Storage) !== 'undefined') {
                    var state = localStorage.getItem(vm.id) == 'true';
                    console.log('state', state, +state, states, states[+state]);
                    if (typeof state === 'undefined') {
                        localStorage.setItem(vm.id, false);
                        return states[0];
                    } else {
                        return 'fas ' + states[+state];
                    }
                }
            } else if (f == 'toggle') {
                if (typeof vm.hidden == 'string') {
                    vm.hidden = !(vm.hidden == 'true');
                } else if (typeof vm.hidden == 'boolean') {
                    vm.hidden = !vm.hidden;
                } else if (!vm.hidden) {
                    vm.hidden = true;
                }
                console.log(vm.$data);
                if (typeof (Storage) !== 'undefined') {
                    localStorage.setItem(vm.id, vm.hidden.toString());
                    e.target.classList = [];
                    e.target.classList.add('fas', states[+vm.hidden]);
                }
            }



        },
        short: function (n) {
            return n.split(' ').map(x => x.substring(0, 1)).join('')
        },
        sizeFont: function (x) {
            //console.log('called', x);
            var answer = (12.931759423927547 + -1.6706753766351716 * x + 0.12208718718312236 * Math.pow(x, 2) + -0.0035893955437599147 * Math.pow(x, 3) + 0.00002917557278795848 * Math.pow(x, 4));
            //console.log(answer | ((answer < 1) & 1));
            return answer | ((answer < 1) & 1);
        },
        mouse: function (e) {
            var button = document.getElementById('serverButton-' + this.id);
            if (!this.stillLoading) {
                if (e == 'enter') {
                    button.parentElement.classList.add('hover', 'shadow');
                    anime({
                        targets: '.serverCard-' + this.id,
                        translateY: -2
                    });
                }

                if (e == 'leave') {
                    button.parentElement.classList.remove('hover', 'shadow');
                    if (!window.location.hash.includes('?')) {
                        anime({
                            targets: '.serverCard-' + this.id,
                            translateY: 0
                        });
                    }
                }

                if (e == 'click') {
                    if (this.info.unavailable) {
                        this.$root.snackbar({
                            type: 'warning',
                            message: 'GIFTron was removed from this server.'
                        });
                    } else {
                        window.location.hash = '#dashboard?' + this.id;
                    }
                }
            }
        }
    },
    mounted: function () {
        var vm = this;
        function handleGotData() {
            vm.info = vm.$root.guilds[vm.id];
            if (vm.info.icon) {
                vm.icon = 'https://cdn.discordapp.com/icons/' + vm.id + '/' + vm.info.icon + '.png?size=1024'
            } else {
                //vm.avatar = 'https://cdn.discordapp.com/embed/avatars/' + vm.$root.user.discriminator % 5 + '.png'
            };
            //console.log(vm.info);
        }

        function handleFinishedLoading() {
            //console.log(vm.id);
            vm.$parent.status = Math.floor(((vm.$parent.index + 1) / Object.keys(vm.$parent.guildlist).length) * 100);
            console.log(vm.$parent.status);
            //console.log('.serverCard-' + vm.id);
            setTimeout(function () {
                if (vm.$parent.loading) {
                    if (vm.info) {
                        if (vm.info.unavailable) {
                            var button = document.getElementById('serverButton-' + vm.id);
                            button.parentElement.style.opacity = '.5';
                            button.style.cursor = 'not-allowed';
                        }
                        anime({
                            targets: ('.serverCard-' + vm.id.toString()),
                            scale: 1
                        });
                    }
                }
                setTimeout(() => {
                    vm.stillLoading = false;
                }, 500);
            }, 10);
            //this.status = vm.$parent.index / Object.keys(vm.$parent.guildlist).length;
            //console.log(vm.$parent.index, Object.keys(vm.$parent.guildlist).length);
            if ((vm.$parent.index + 1) == (Object.keys(vm.$parent.guildlist).length)) {
                console.log('done!');
                setTimeout(function () {
                    vm.$parent.loading = false;
                    vm.$parent.status = 0;
                    vm.$parent.initialized = true;
                    vm.$root.$refs.navbarLoader.update();
                }, 150);
            }

            if (vm.$parent.loading) {
                vm.$parent.index++;
            }
            vm.$root.$refs.navbarLoader.update();
        }
        var interval = setInterval(() => {
            //console.log(Object.keys(vm.$parent.guildlist).indexOf(vm.id), Object.keys(vm.$parent.guildlist));
            if (vm.$parent.index == Object.keys(vm.$parent.guildlist).indexOf(vm.id)) {
                //console.log('my turn', vm.id);
                clearInterval(interval);

                if (!vm.$root.guilds[vm.id]) {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            if (String(this.status).charAt(0) == 2) {
                                if (this.status == 200) {
                                    vm.$root.guilds[vm.id] = JSON.parse(this.response);
                                    handleGotData();
                                }
                            } else if (String(this.status).charAt(0) == 5) {
                                var message = JSON.parse(this.response);
                                if (!message) {
                                    message = 'Our server responded with an unknown 5XX error. We\'re looking into it.';
                                }
                                vm.$root.snackbar({
                                    type: 'error',
                                    message: message
                                });
                            } else if (String(this.status).charAt(0) == 4) {
                                var message = JSON.parse(this.response);
                                if (!message) {
                                    message = 'Our server responded with an unknown 4XX error. We\'re looking into it.';
                                }
                                vm.$root.snackbar({
                                    type: 'error',
                                    message: message
                                });
                            }
                            handleFinishedLoading();
                        }
                    };
                    xhttp.open("GET", "api/v1/guild/?guild_id=" + vm.id, true);
                    xhttp.send();
                } else {
                    console.log('skipping ' + vm.id);
                    handleGotData();
                    handleFinishedLoading();
                }
            }
        }, 0);

        if (typeof (Storage) !== 'undefined') {
            vm.hidden = localStorage.getItem(vm.id);
        }
    }
});