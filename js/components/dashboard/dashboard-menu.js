Vue.component('dashboard-menu', {
    template: `<div id="dashboardMenu">
                    <dashboard-guild-profile v-bind:guild="guild"></dashboard-guild-profile>
                    <div class="view">
                        <div v-for="(options, item) in navigation" v-show="typeof guild.settings !== 'undefined'">
                            <h3 v-on:click="goto(item)" v-bind:class="active == item.toLowerCase() ? 'shadow active' : 'shadow'"><i v-bind:class="icons[item]"></i>{{ item.toTitleCase() }}</h3>
                            <ul style="max-height: 0;" v-bind:id="item + 'Options'">
                                <li v-for="option in options.options" v-on:click="goto(option)" v-bind:class="active == option.toLowerCase() ? 'active' : ''">{{ option }}</li>
                            </ul>
                        </div>
                    </div>
               </div>`,
    props: ['guild'],
    data: function () {
        return {
            active: '',
            icons: {
                schedule: 'fas fa-calendar-alt',
                settings: 'fas fa-cog'
            },
            navigation: {
                schedule: {
                    options: [
                        'Events',
                        'Shards'
                    ]
                },
                settings: {
                    options: [
                        'Timezone',
                        'Access Roles',
                        'Multiplier Roles',
                        'Win Message'
                    ]
                }
            }
        }
    },
    methods: {
        goto: function (section) {
            this.active = ('' + section).toLowerCase();
            switch (this.active) {
                case 'events':
                    //document.getElementById('scheduleOptions').style.maxHeight = (this.navigation.schedule.options.length * 3.5) + 'em';
                    //document.getElementById('settingsOptions').style.maxHeight = 0;
                    document.getElementById('dashboardEvents').style.display = '';
                    document.getElementById('dashboardShards').style.display = 'none';
                    anime({
                        targets: '#schedulerViews',
                        translateY: -(document.getElementById('content').clientHeight + 50) + 'px'
                    });
                    break;
                case 'shards':
                    document.getElementById('dashboardEvents').style.display = 'none';
                    document.getElementById('dashboardShards').style.display = '';
                    anime({
                        targets: '#schedulerViews',
                        translateY: -(document.getElementById('content').clientHeight + 50) + 'px'
                    });
                    break;

                case 'settings':
                    document.getElementById('scheduleOptions').style.maxHeight = 0;
                    document.getElementById('settingsOptions').style.maxHeight = (this.navigation.settings.options.length * 3.5) + 'em';
                    anime({
                        targets: '#dashboardSettings',
                        translateY: 0
                    });
                    break;

                default:
                    document.getElementById('scheduleOptions').style.maxHeight = (this.navigation.schedule.options.length * 3.5) + 'em';
                    document.getElementById('settingsOptions').style.maxHeight = 0;
                    anime({
                        targets: '#schedulerViews, .view .options',
                        translateY: 0
                    });
                    anime({
                        targets: '#dashboardSettings',
                        translateY: -(document.getElementById('content').clientHeight + 50) + 'px'
                    });
                    break;
            }
        }
    },
    mounted: function () {
        console.log('going to schedule');
        this.goto('schedule');
    }
});