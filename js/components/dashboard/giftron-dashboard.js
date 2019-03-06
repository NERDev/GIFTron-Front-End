Vue.component('giftron-dashboard', {
    template: `<div id="dashboard"><server-toolbar></server-toolbar><ul class="serverList"><server-card v-for="(value, guild) in guildlist" v-bind:id="guild" v-bind:manage="value" v-bind:filter="filter"></server-card></ul><dashboard-panel v-bind:guild="guildQuery"></dashboard-panel><setup-panel v-if="guildQuery.setup" v-bind:guild="guildQuery"></setup-panel></div>`,
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
                                anime({
                                    targets: '.panel',
                                    translateY: -(document.getElementById('dashboard').clientHeight) + 'px'
                                });
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