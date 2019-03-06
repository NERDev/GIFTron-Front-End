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
                        'generalManageChannels',
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
                        vm.greeting = "But did you mean to click ";
                        if (vm.missing.length == 1) {
                            vm.greeting += "this?";
                        } else {
                            vm.greeting += "these?";
                        }

                        var set1 = vm.missing.includes(desiredPerms[0]) || vm.missing.includes(desiredPerms[1]),
                            set2 = vm.missing.includes(desiredPerms[2]) || vm.missing.includes(desiredPerms[3]);

                        if (set1) {
                            vm.guild_permCopy += vm.guild_permCopy0;
                            if (set2) {
                                vm.guild_permCopy += " However, ";
                            }
                        }

                        if (set2) {
                            vm.guild_permCopy += vm.guild_permCopy1;
                        }

                        vm.guild_permCopy += " You may want to go back and re-add GIFTron to fix this."
                        vm.missingImage = vm.missing.join('+') + '.png';
                    } else {
                        console.log('We\'ve got everything we need - proceed');
                        vm.step++;
                    }
                } else {
                    var message = JSON.parse(this.response);
                    if (!message) {
                        message = "Our server responded with an unknown error. We're looking into it.";
                    }
                    vm.$root.snackbar({
                        type: 'error',
                        message: message
                    });
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