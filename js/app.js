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

Vue.component('navbar-button', {
    template: `<button v-on:click="click(item.function)">{{ item.name }}</button>`,
    props: ['item'],
    methods: {
        click: function (e) {
            console.log('Clicked ' + e);
            switch (e) {
                case 'dashboard':
                    window.location.hash = '#dashboard';
                    break;
                case 'home':
                    window.location.hash = '';
                    break;
                case 'blog':
                    //code
                    break;
                case 'community':
                    //code
                    break;
            }
        }
    }
});

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

Vue.component('user-loader', {
    template: `<div class="lds-ellipsis"><div v-for="index in 4"></div></div>`
})

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
            if (userButton && dropdown) {
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
    template: `<ul class="dropdown menu"><li v-if="user.staff"><button v-on:click="click('staff')">Staff</button></li><li v-for="item in items"><hr><button v-on:click="click(item.function)">{{ item.name }}</button></li></ul>`,
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
                case 'servers':
                case 'notifications':
                    window.location.hash = '#' + e;
                    this.$parent.close();
                    break;
                case 'logout':
                    this.$root.user = {};
                    this.$root.delete_cookie('session');
                    this.$parent.close();
                    window.location.hash = '';
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

Vue.component('giftron-dashboard', {
    template: `<div id="dashboard" v-if="user.id"><server-toolbar></server-toolbar><ul class="serverList"><server-card v-for="(value, guild) in guildlist" v-bind:id="guild" v-bind:manage="value" v-bind:filter="filter"></server-card></ul><dashboard-panel v-bind:guild="guildQuery"></dashboard-panel><setup-panel v-if="guildQuery.setup" v-bind:guild="guildQuery"></setup-panel></div>`,
    props: ['user'],
    data: function () {
        return {
            guildlist: {},
            index: 0,
            status: 0,
            active: true,
            initialized: false,
            filter: false,
            pageTitle: 'Dashboard',
            guildQuery: {}
        }
    },
    methods: {
        initialize: function () {
            var vm = this;

            //console.log('mounted');
            if (!vm.initialized) {
                console.log('loader 1 started');
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            vm.$root.guildlist = JSON.parse(this.response);
                            vm.guildlist = vm.$root.guildlist;
                            console.log('loader 2 started');
                            vm.loading = true;
                            //console.log(vm.$root.guildlist);
                        } else if (this.status == 401) {
                            window.location = "api/v1/user/auth/?scope=identify+guilds";
                        }
                    }
                };
                xhttp.open("GET", "api/v1/user/guilds", true);
                xhttp.send();
            } else {
                vm.guildlist = vm.$root.guildlist;
            }
        }
    },
    mounted: function () {
        var vm = this,
            query,
            storedQuery = null;

        function getQuery() {
            query = window.location.hash.split('?', 2)[1];
        }

        function dashboardOrSetup(newQuery) {
            if (vm.$root.guilds[newQuery]) {
                vm.guildQuery = vm.$root.guilds[newQuery];
                vm.guildQuery.id = newQuery;
                if (vm.$root.guilds[newQuery].setup) {
                    console.log("this guild needs to be setup!");
                    console.log(vm.$root.guilds[newQuery].setup);
                    setTimeout(() => {
                        anime({
                            targets: '#setupPanel',
                            translateY: 0
                        });
                    }, 500);
                } else {
                    console.log('animating in the dashboard for ' + newQuery);
                    setTimeout(() => {
                        anime({
                            targets: '#dashboardPanel',
                            translateY: 0
                        });
                    }, 500);
                }
            }
        }

        function switchQuery(newQuery) {
            if (newQuery != storedQuery) {
                var screenheight = document.body.clientHeight,
                    serverList = document.querySelector('.serverList'),
                    listheight = 0,
                    index;
                if (serverList) {
                    listheight = document.querySelector('.serverList').clientHeight;
                    var childNodes = [];
                    document.querySelector('.serverList').childNodes.forEach((n) => {
                        if (n.nodeType == 1) {
                            childNodes.push(n);
                        }
                    });
                    index = Array.prototype.indexOf.call(childNodes, document.querySelector('.serverCard-' + newQuery));
                }
                if (storedQuery === null && vm.initialized) {
                    console.log('animating to ' + newQuery);
                    anime({
                        targets: '.serverCard',
                        translateY: -(listheight + (screenheight / 2)),
                        scale: 1,
                        delay: anime.stagger(100, { from: index })
                    });
                    anime({
                        targets: '#serverToolbar',
                        translateY: -200
                    });
                } else {
                    if (vm.loading) {
                        console.log('cancelling loading and animating to ' + newQuery);
                        vm.loading = false;
                        anime({
                            targets: '.serverCard',
                            translateY: -(listheight + (screenheight / 2)),
                            scale: 1,
                            delay: anime.stagger(100, { from: index })
                        });
                        anime({
                            targets: '#serverToolbar',
                            translateY: -200
                        });
                    } else {
                        console.log('direct to ' + newQuery);
                    }
                }
                if (!vm.$root.guilds[newQuery]) {
                    //document.querySelector('#serverToolbar').style.transform = 'translateY(-200px)';
                    console.log('going and getting the info for this guild');
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            if (this.status == 200) {
                                vm.$root.guilds[newQuery] = JSON.parse(this.response);
                                if (!vm.$root.guilds[newQuery].unavailable) {
                                    console.log('got info');
                                    dashboardOrSetup(newQuery);
                                } else {
                                    console.log('this guild is unavailable');
                                }
                            } else {
                                console.log('no guild');
                            }
                        }
                    };
                    xhttp.open("GET", "api/v1/guild/?guild_id=" + newQuery, true);
                    xhttp.send();
                } else {
                    dashboardOrSetup(newQuery);
                }
                storedQuery = newQuery;
            }
        }

        var initialize = setInterval(() => {
            getQuery();
            if (vm.$root.page == '#dashboard') {
                if (query) {
                    switchQuery(query);
                } else {
                    vm.guildQuery = {};
                    vm.initialize();
                    clearTimeout(initialize);
                    console.log('moving toolbar');
                    setTimeout(() => {
                        anime({
                            targets: '#serverToolbar',
                            translateY: 0
                        });
                        document.querySelectorAll('.panel').forEach((p) => {
                            console.log(p.id);
                            if (p.style.transform == 'translateY(0vh)') {
                                anime({
                                    targets: '#' + p.id,
                                    translateY: -(document.getElementById('dashboard').clientHeight) + 'px'
                                });
                            }
                        });
                    }, 100);
                    storedQuery = null;
                    var watch = setInterval(() => {
                        if (vm.$root.page == '#dashboard') {
                            getQuery();
                            if (query) {
                                switchQuery(query);
                            } else {
                                vm.guildQuery = {};
                                if (storedQuery !== null && storedQuery != query) {
                                    storedQuery = null;
                                    if (!vm.initialized && (vm.$parent.index + 1) != (Object.keys(vm.$parent.guildlist).length)) {
                                        console.log('resuming load');
                                        vm.loading = true;
                                        vm.index++
                                    } else {
                                        console.log('loading finished before this');
                                    }
                                    anime({
                                        targets: '.serverCard',
                                        translateY: 0,
                                        scale: 1,
                                        delay: anime.stagger(100)
                                    });
                                    anime({
                                        targets: '#serverToolbar',
                                        translateY: 0
                                    });
                                    anime({
                                        targets: '.panel',
                                        translateY: -(document.getElementById('dashboard').clientHeight) + 'px'
                                    });
                                }
                            }
                        }
                    }, 0);
                }
            }
        }, 0);
    }
});

Vue.component('server-toolbar', {
    template: `<div id="serverToolbar" style="transform: translateY(-200px);"><h1>Select a Server</h1><checkbox-slider v-bind:id="'serverFilter'" v-bind:on="'Manage'" v-bind:off="'All'"></checkbox-slider></div>`,
    methods: {
        serverFilter: function () {
            this.$parent.filter = document.getElementById('serverFilter').checked;
        }
    }
});

Vue.component('checkbox-slider', {
    template: `<div class="container"><p v-if="off" style="left: -25px">{{ off }}</p><label class="switch" v-bind:for="id"><input type="checkbox" v-bind:id="id" v-on:click="click" /><div class="slider round"></div></label><p v-if="on" style="right: -65px;">{{ on }}</p></div>`,
    props: ['id', 'on', 'off'],
    methods: {
        click: function () {
            if (this.$parent[this.id]) {
                this.$parent[this.id]();
            }
        }
    }
});

Vue.component('server-card', {
    template: `<li style="transform: scale(0)" v-bind:class="'serverCard ' + 'serverCard-' + id" v-if="info" v-show="manage - filter >= 0">
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
            icon: null
        }
    },
    methods: {
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
                    window.location.hash = '#dashboard?' + this.id;
                    /*
                    anime({
                        targets: '.serverCard',
                        translateY: -screenheight,
                        delay: anime.stagger(100, {order: 'reverse'}),
                        duration: 3000
                    });
                    */
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
                    if (vm.info && vm.info.unavailable) {
                        var button = document.getElementById('serverButton-' + vm.id);
                        button.disabled = true;
                        button.parentElement.style.opacity = '.5';
                        button.style.cursor = 'not-allowed';
                    }
                    anime({
                        targets: ('.serverCard-' + vm.id.toString()),
                        scale: 1
                    });
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
                            if (this.status == 200) {
                                vm.$root.guilds[vm.id] = JSON.parse(this.response);
                                handleGotData();
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
    }
});

Vue.component('dashboard-panel', {
    template: `<div class="panel" id="dashboardPanel" style="transform: translateY(-100vh);"><dashboard-menu v-bind:guild="guild"></dashboard-menu><dashboard-scheduler v-bind:guild="guild"></dashboard-scheduler></div>`,
    props: ['guild']
});

Vue.component('dashboard-menu', {
    template: `<div id="dashboardMenu"><dashboard-guild-profile v-bind:guild="guild"></dashboard-guild-profile></div>`,
    props: ['guild']
});

Vue.component('dashboard-guild-profile', {
    template: `<div class="profile">
                    <img v-if="guild.icon" v-bind:src="'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png?size=1024'">
                    <h1>{{ guild.name }}</h1>
                    <h3 v-if="typeof guild.wallet !== 'undefined'">\${{ guild.wallet.toFixed(2) }}</h3>
                    <button class="main" v-if="guild.wallet !== 'undefined'">Add Funds</button>
               </div>`,
    props: ['guild']
});

Vue.component('dashboard-scheduler', {
    template: `<div id="dashboardScheduler">
                    <h1>{{ [calendar.monthnames[calendar.visibleDate.getMonth()], calendar.visibleDate.getFullYear()].join(' ') }}</h1>
                    <div id="calendarContainer">
                        <table>
                            <calendar-week v-for="(week, id) in calendar.weeks" v-bind:week="week" v-bind:id="id"></calendar-week>
                        </table>
                    </div>
               </div>`,
    props: ['guild'],
    data: function () {
        return {
            calendar: {
                weeks: {},
                topweeks: [],
                bottomweeks: [],
                visibleweeks: [],
                monthnames: ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ],
                visibleDate: new Date()
            }
        }
    },
    mounted: function () {
        function getVisibleDate() {
            vm.calendar.visibleDate = new Date(+Object.keys(vm.calendar.visibleweeks)[3]);
        }

        function buildWeek(start) {
            var week = {};
            week[+start] = start;

            for (let index = 1; index < 7; index++) {
                var tomorrow = new Date(start);
                tomorrow.setDate(tomorrow.getDate() + index);
                week[+tomorrow] = tomorrow;
            }
            return week;
            //vm.calendar.weeks[sunday] = week;
        }

        function generate(number, reference) {
            if (number > 0) {
                for (let index = 0; index < number; index++) {
                    var tomorrow = new Date(reference);
                    var weekstart = new Date(tomorrow.setDate(tomorrow.getDate() + index * 7));
                    Vue.set(vm.calendar.weeks, +weekstart, buildWeek(weekstart));
                }
            } else {
                number = Math.abs(number);
                for (let index = number; index > 0; index--) {
                    var tomorrow = new Date(reference);
                    var weekstart = new Date(tomorrow.setDate(tomorrow.getDate() - index * 7));
                    Vue.set(vm.calendar.weeks, +weekstart, buildWeek(weekstart));
                }
            }
        }

        var vm = this,
            today = new Date(new Date().setHours(0, 0, 0, 0)),
            sunday = new Date((new Date(today).setDate(new Date(today).getDate() - new Date(today).getDay()))),
            first = new Date([today.getMonth() + 1, today.getDate(), today.getFullYear()].join(' '));

        generate(-10, sunday);
        generate(10, sunday);

        console.log(today, sunday, vm.calendar.weeks, Object.keys(vm.calendar.weeks).length);
        setTimeout(() => {
            console.log(today.getMonth());
            document.querySelector('#calendarContainer').scrollTop = document.getElementById(+new Date((new Date(first).setDate(new Date(first).getDate() - new Date(first).getDay())))).offsetTop;
            setTimeout(() => {
                getVisibleDate();
            }, 1000);
        }, 100);

        //determine if visible or not

        document.querySelector('#calendarContainer').addEventListener('scroll', () => {
            if (Object.keys(vm.calendar.bottomweeks).length < 4) {
                console.log('getting close, loading more on the bottom');
                var date = Object.keys(vm.calendar.bottomweeks).pop();
                console.log(vm.calendar.bottomweeks);
                if (!isFinite(date)) {
                    date = Object.keys(vm.calendar.visibleweeks).pop();
                }

                if (date) {
                    console.log(date, new Date(+date));
                    generate(10, new Date(+date));
                }
                //console.log(new Date(Math.min(...Object.keys(vm.calendar.bottomweeks))));
                //generate(10, new Date(Math.min(...Object.keys(vm.calendar.bottomweeks))));
            }
            if (Object.keys(vm.calendar.topweeks).length < 4) {
                console.log('getting close, loading more on the top');
                var date = Object.keys(vm.calendar.topweeks)[0];
                if (!isFinite(date)) {
                    date = Object.keys(vm.calendar.visibleweeks)[0];
                }

                if (date) {
                    console.log(date, new Date(+date));
                    //generate(-10, new Date(+date));
                }
            }
            getVisibleDate();
            //console.log('top', vm.calendar.topweeks);
            //console.log('visible', vm.calendar.visibleweeks);
            //console.log('bottom', vm.calendar.bottomweeks);
        })
        //vm.calendar.weeks[sunday] = week;
    }
});

Vue.component('calendar-week', {
    template: `<tr v-bind:id="id"><td v-for="day in week"><div v-bind:class="getDayColor(day)"><h3 v-bind:class="getDayColor(day)">{{ day.getDate() }}</h3></div></td></tr>`,
    props: ['week', 'id'],
    methods: {
        getDayColor: function (day) {
            var classes = [];

            if (+day ==  +new Date().setHours(0,0,0,0)) {
                classes.push('today');
            }
            
            if ((day.getMonth() == this.$parent.calendar.visibleDate.getMonth()) && (day.getFullYear() == this.$parent.calendar.visibleDate.getFullYear())) {
                classes.push('active');
            }

            return classes.join(' ');
        }
    },
    mounted: function () {
        function position () {
            var rect = thisweek.getBoundingClientRect();
            var rect2 = container.getBoundingClientRect();
            if (rect.bottom < rect2.top) {
                delete vm.$parent.calendar.bottomweeks[vm.id];
                delete vm.$parent.calendar.visibleweeks[vm.id];
                vm.$parent.calendar.topweeks[vm.id] = thisweek;
            } else if (rect.top > rect2.bottom) {
                delete vm.$parent.calendar.topweeks[vm.id];
                delete vm.$parent.calendar.visibleweeks[vm.id];
                vm.$parent.calendar.bottomweeks[vm.id] = thisweek;
            } else {
                delete vm.$parent.calendar.topweeks[vm.id];
                delete vm.$parent.calendar.bottomweeks[vm.id];
                vm.$parent.calendar.visibleweeks[vm.id] = thisweek;
            }
        }
        var vm = this,
            thisweek = document.getElementById(vm.id),
            container = document.getElementById('calendarContainer');
        position();
        container.addEventListener('scroll', position);
    }
});

Vue.component('setup-panel', {
    template: `<div class="panel" id="setupPanel" style="transform: translateY(-100vh);">
                    <div id="setupContainer"><h1>{{ top }}</h1><h2>{{ greeting }}</h2>
                        <div v-show="!loading && finished && success"><svg style="fill: limegreen;" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg></div>
                        <div class="innerLoader" v-show="loading && !finished"><div class="lds-roller"><div v-for="index in 7"></div></div></div>
                        <div class="inner" v-show="!loading && !success">
                            <hr>
                            <p v-show="step == scopes.indexOf('access_role')">{{ access_roleCopy }}
                            <br>
                            <br>
                            </p>
                            <img v-if="missingImage" v-bind:src="'?img/permissions/' + missingImage" class="shadow">
                            <p v-bind:class="stepClass">{{ copy }}</p>
                            <ul class="fixList" v-if="Object.keys(fix).length"><li v-for="(channel, id) in fix">#{{ channel }}</li></ul>
                            <setup-options v-bind:step="1" v-bind:prefix="'#'" v-bind:setup="guild.setup.channels"></setup-options>
                            <setup-options v-bind:step="2" v-bind:prefix="''" v-bind:setup="guild.setup.access_roles"></setup-options>
                            <hr style="display: none;">
                        </div>
                        <setup-buttons v-bind:step="step" v-show="!loading && !success"></setup-buttons>
                    </div>
               </div>`,
    props: ['guild'],
    data: function () {
        return {
            loading: false,
            finished: false,
            success: false,
            setup: {},
            step: 0,
            scopes: [
                'guild_perm',
                'channel',
                'access_role'
            ],
            missing: [],
            missingImage: "",
            stepClass: "permissions",
            fix: {},
            copy: "",
            top: "",
            greeting: "",
            guild_permCopy: "",
            guild_permCopy0: "The Manage Roles permission isn't necessary for GIFTron to operate, but it allows GIFTron to be able to automatically fix its channels if permissions are messed with.",
            guild_permCopy1: "GIFTron operates on the principle of being able to send and recieve messages on a Discord server. Without these, we will not be able to function.",
            channelCopy0: "We didn't detect any giveaway channels on your server. Would you like to create one now, or use an existing channel? This can be changed in the future!",
            channelCopy1: "We've detected that you have a Giveaway channel on your server! Would you like us to use it? If not, select a different channel! This can be changed in the future!",
            channelCopy2: "We've detected multiple Giveaway channels on your server! Would you like us to use them? If not, add or remove channels as you see fit. This can be changed in the future!",
            access_roleCopy: "By default, access to this Dashboard will be limited to the Server Owner, and users with the Manage Server permission. By setting up Access Roles, you can give certain users permission to edit this dashboard regardless of their Discord permissions.",
            access_roleCopy0: "",
            access_roleCopy1: "We have detected one that you might want to use.",
            access_roleCopy2: "We have detected some that you might want to use.",
            onemorethingCopy0: "GIFTron has detected that it's not allowed to post in this channel. At some point, please make sure to give it permission.",
            onemorethingCopy1: "GIFTron has detected that it's not allowed to post in these channels. At some point, please make sure to give it permission.",
            onemorethingCopy2: "GIFTron has detected that it's not allowed to post in any of the channels you picked. At some point, please make sure to give it permission."
        }
    },
    mounted: function () {
        var vm = this,
            scope = this.scopes[this.step];
        //vm.greeting = "Welcome, " + this.guild.name + ", to GIFTron!";
        vm.top = "One Moment";
        vm.greeting = "Checking Permissions...";
        vm.guild.setup[scope + 's'] = {};
        vm.loading = true;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                vm.loading = false;
                if (this.status == 200) {
                    var currentPerms = JSON.parse(this.response);
                    if (!currentPerms) {
                        currentPerms = [];
                    }
                    console.log(currentPerms);
                    var desiredPerms = [
                        'generalManageRoles',
                        'textReadMessages',
                        'textSendMessages'
                    ];
                    desiredPerms.forEach(function (p) {
                        if (!currentPerms.includes(p)) {
                            vm.missing.push(p);
                        }
                    });

                    if (vm.missing.length) {
                        vm.top = "Pardon Us";
                        if (vm.missing.includes(desiredPerms[0])) {
                            vm.guild_permCopy += vm.guild_permCopy0;
                            if (vm.missing.length > 1) {
                                vm.guild_permCopy += " However, ";
                            }
                        }
                        vm.greeting = "But did you mean to click ";
                        if (vm.missing.length == 1) {
                            vm.greeting += "this?";
                        } else {
                            vm.greeting += "these?";
                        }
                        if (vm.missing.includes(desiredPerms[1]) || vm.missing.includes(desiredPerms[2])) {
                            vm.guild_permCopy += vm.guild_permCopy1;
                        }

                        vm.guild_permCopy += " You may want to go back and re-add GIFTron to fix this."
                        vm.missingImage = vm.missing.join('+') + '.png';
                    } else {
                        console.log('We\'ve got everything we need - proceed');
                        vm.step++;
                    }
                }
            }
        };
        xhttp.open("GET", "api/v1/guild/permissions/?" + vm.guild.id, true);
        xhttp.send();
    },
    updated: function () {
        var vm = this,
            scope = this.scopes[this.step],
            items = this.guild.setup[scope + 's'];
        if (items) {
            if (typeof items.suggested !== 'undefined') {
                if (items.suggested) {
                    if (Object.keys(items.suggested).length > 1) {
                        vm.copy = vm[scope + 'Copy2'];
                    } else {
                        vm.copy = vm[scope + 'Copy1'];
                    }
                } else {
                    vm.copy = vm[scope + 'Copy0'];
                }
            } else {
                vm.copy = vm[scope + 'Copy'];
            }

            if (!vm.loading && !vm.finished && vm.step) {
                vm.top = "Hello!";
                vm.greeting = "Welcome, " + this.guild.name + ", to GIFTron!";
                vm.missingImage = false;
                vm.stepClass = "";
            }
        }
    }
});

Vue.component('setup-options', {
    template: `<ul class="setup-options" v-show="(step == $parent.step)">
        <li v-for="(name, id) in setup.suggested">
            <button v-on:click="removed" v-bind:value="id" v-bind:id="id" v-on:mouseenter="hover(id)" v-on:mouseleave="hover(id)"><i class="far fa-times-circle"></i>{{ prefix }}{{ name }}</button>
        </li>
        <li>
            <select v-on:click="selected" v-if="Object.keys(setup.available).length !== 0">
                <option value="" selected disabled>Select {{ thing }}s</option><option v-for="(name, id) in setup.available" v-bind:value="id">{{ prefix }}{{ name }}</option>
            </select>
        </li>
    </ul>`,
    props: ['setup', 'prefix', 'step'],
    data: function () {
        var scope = this.$parent.scopes[this.step];
        return {
            scope,
            oldSelect: null,
            thing: scope.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        }
    },
    methods: {
        hover: function (id) {
            var circle = document.getElementById(id).querySelector('i');
            if (circle.classList.contains('fas')) {
                circle.classList.remove('fas');
                circle.classList.add('far');
            } else if (circle.classList.contains('far')) {
                circle.classList.remove('far');
                circle.classList.add('fas');
            }
        },
        selected: function (event) {
            var vm = this,
                newSelect = event.target.value;
            if (newSelect && newSelect != vm.oldSelect) {
                if (!vm.setup.suggested) {
                    vm.setup.suggested = {};
                }
                vm.oldSelect = newSelect;
                Vue.set(vm.setup.suggested, newSelect, vm.setup.available[newSelect]);
                delete vm.setup.available[newSelect];
                if (event.target.tagName == 'OPTION') {
                    event.target.parentElement.selectedIndex = 0;
                } else {
                    event.target.selectedIndex = 0;
                }
            }
        },
        removed: function (event) {
            var vm = this,
                value = event.target.value;
            if (!value) {
                value = event.target.parentElement.value;
            }
            console.log(value);
            Vue.set(vm.setup.available, value, vm.setup.suggested[value]);
            delete vm.setup.suggested[value];
            vm.oldSelect = null;
        }
    },
    mounted: function () {
        var vm = this;
        console.log(vm.setup.suggested);
    }
});

Vue.component('setup-buttons', {
    template: `<div class="setup-buttons"><button class="main" v-if="(step > 1) && (step <= last)" v-on:click="back">Back</button><button class="main" v-if="step < last" v-on:click="next">Next</button><button class="main" v-if="step == last" v-on:click="apply">Apply</button><button class="main" v-if="step > last" v-on:click="finish">Next</button></div>`,
    props: ['step'],
    data: function () {
        return {
            last: this.$parent.scopes.length - 1
        }
    },
    methods: {
        finish: function () {
            anime({
                targets: '#setupPanel',
                translateY: -(document.getElementById('dashboard').clientHeight) + 'px'
            });
            setTimeout(() => {
                //dirty af but it gets the job done
                anime({
                    targets: '#dashboardPanel',
                    translateY: 0
                });
            }, 500);
        },
        back: function () {
            var scope = this.$parent.scopes[this.step];
            this.$parent.step--;
            if (this.$parent.setup[scope + 's']) {
                delete this.$parent.setup[scope + 's'];
            }
        },
        next: function () {
            var scope = this.$parent.scopes[this.step];
            if (!this.$parent.guild.setup[scope + 's'].suggested) {
                console.log('Dis bitch empty - Y E E T');
                var items = {};
            } else {
                var items = Object.keys(this.$parent.guild.setup[scope + 's'].suggested);
            }
            this.$parent.step++;
            Vue.set(this.$parent.setup, scope + 's', items.length ? items : false);
        },
        apply: function () {
            var vm = this,
                scope = vm.$parent.scopes[vm.step];
            if (!vm.$parent.guild.setup[scope + 's'].suggested) {
                console.log('Dis bitch empty - Y E E T');
                var items = {};
            } else {
                var items = Object.keys(vm.$parent.guild.setup[scope + 's'].suggested);
            }
            Vue.set(vm.$parent.setup, scope + 's', items.length ? items : false);
            vm.$parent.loading = true;
            vm.$parent.top = "Verifying";
            if (vm.$parent.missing.includes('generalManageRoles')) {
                var verb = "Checking";
            } else {
                var verb = "Setting";
            }
            vm.$parent.greeting = verb + " Channel Permissions...";
            var setup = JSON.stringify(vm.$parent.setup);
            console.log(setup);

            var fixindex = 0,
                options = JSON.stringify({
                    topic: "Giveaways by GIFTron",
                    permission_overwrites: [
                        {
                            id: "523579896144986125",
                            type: 'member',
                            allow: 2048,
                            deny: 0
                        },
                        {
                            id: vm.$parent.guild.id,
                            type: 'role',
                            allow: 0,
                            deny: 2048
                        }
                    ]
                });
            vm.$parent.setup.channels.forEach(function (n) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        fixindex++;
                        if (vm.$parent.missing.includes('generalManageRoles')) {
                            if (this.status == 200) {
                                if (!JSON.parse(this.response).includes('textSendMessages')) {
                                    console.log('asking user to manually fix ' + n);
                                    vm.$parent.fix[n] = vm.$parent.guild.setup.channels.suggested[n];
                                } else {
                                    console.log(n + ' is good to go');
                                }
                            } else {
                                console.log('error with ' + n);
                            }
                        } else {
                            if (this.status == 200) {
                                console.log('fixed ' + n);
                            } else {
                                console.log('failed to fix ' + n);
                            }
                        }
                        console.log(fixindex, vm.$parent.setup.channels.length);
                        if (fixindex == vm.$parent.setup.channels.length) {
                            if (Object.keys(vm.$parent.fix).length) {
                                console.log('asking user at the end to manually fix the following:', vm.$parent.fix);
                            } else {
                                console.log('all clear, proceed');
                            }

                            vm.$parent.top = "Almost Done!";
                            vm.$parent.greeting = "Getting you setup, one moment...";

                            //setup guild
                            var xhttp = new XMLHttpRequest();
                            xhttp.onreadystatechange = function () {
                                if (this.readyState == 4) {
                                    vm.$parent.loading = false;
                                    if (this.status == 200) {
                                        var xhr = this;
                                        var length = Object.keys(vm.$parent.fix).length;
                                        vm.$parent.finished = true;
                                        vm.$root.guilds[vm.$parent.guild.id] = JSON.parse(xhr.response);
                                        console.log(vm.$root.guilds[vm.$parent.guild.id]);


                                        if (length) {
                                            vm.$parent.top = "One More Thing";
                                            vm.$parent.greeting = "We need your help with this part";
                                            vm.$parent.step++;
                                            if (length == 1) {
                                                vm.$parent.copy = vm.$parent.onemorethingCopy0;
                                            } else if (length == vm.$parent.setup.channels.length) {
                                                vm.$parent.copy = vm.$parent.onemorethingCopy2;
                                            } else if (length > 1) {
                                                vm.$parent.copy = vm.$parent.onemorethingCopy1;
                                            }
                                        } else {
                                            vm.$parent.success = true;
                                            vm.$parent.top = "Finished!";
                                            vm.$parent.greeting = "All set - She's all yours!";
                                            setTimeout(() => {
                                                vm.finish();
                                            }, 5000);
                                        }
                                    }
                                }
                            };
                            xhttp.open("POST", "api/v1/guild/?guild_id=" + vm.$parent.guild.id, true);
                            xhttp.send(setup);
                        }
                    }
                };
                if (vm.$parent.missing.includes('generalManageRoles')) {
                    xhttp.open("GET", "api/v1/guild/permissions/?" + n, true);
                } else {
                    xhttp.open("POST", "api/v1/guild/permissions/?channel_id=" + n, true);
                }
                xhttp.send(options);
            });

            /*
            
            */
        }
    }
});

var app = new Vue({
    el: 'main',
    data() {
        return {
            user: {},
            guilds: {},
            page: window.location.hash.split('?')[0]
        };
    },
    methods: {
        delete_cookie: function (name) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
        }
    },
    mounted: function () {
        var vm = this;
        function pageHandle() {
            if (vm.page) {
                if (vm.$refs[vm.page]) {
                    vm.$refs[vm.page].active = true;
                    vm.title = 'GIFTron - ' + vm.$refs[vm.page].pageTitle;
                } else {
                    vm.title = 'GIFTron - 404';
                    console.log('404 not found');
                }
            } else {
                vm.title = 'GIFTron';
            }
            document.title = vm.title;
        }
        pageHandle();
        window.onhashchange = function (e) {
            if (!window.location.hash) {
                history.replaceState({}, document.title, ".");
            }
            vm.page = window.location.hash.split('?')[0];
            pageHandle();
        };
    },
    updated: function () {
        console.log('updating navbar');
    }
});