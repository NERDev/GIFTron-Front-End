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
            var vm = this;
            vm.$parent.success = true;
            vm.$parent.top = "Finished!";
            vm.$parent.greeting = "All set - She's all yours!";
            setTimeout(() => {
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
            }, 5000);
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
                            allow: 134144,
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
            if (Object.keys(vm.$parent.setup.channels).length) {
                vm.$parent.setup.channels.forEach(function (n) {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            fixindex++;
                            /*
                            if (this.status != 200) {
                                var message = JSON.parse(this.response);
                                if (!message) {
                                    message = "We had an unknown problem querying " + n + ".";
                                }
                                vm.$root.snackbar({
                                    type: 'warning',
                                    message: message
                                });
                            }
                            */
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
                                    vm.$parent.fix[n] = vm.$parent.guild.setup.channels.suggested[n];
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
                                                vm.finish();
                                            }
                                        } else {
                                            var message = JSON.parse(this.response);
                                            if (!message) {
                                                message = "We had an unknown problem setting up your guild. Try refreshing and doing it again.";
                                            }
                                            vm.$root.snackbar({
                                                type: 'warning',
                                                message: message
                                            });
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
            } else {
                vm.finish();
            }
        }
    }
});