Vue.component('calendar-week', {
    template: `<tr v-bind:id="id">
                    <td v-for="day in week">
                        <div v-bind:class="getDayColor(day)">
                            <div class="connector" v-for="(connector, index) in $parent.connectors" v-if="day.getDay() == connector.day && id == connector.week" v-bind:style="connector.style.join(' ')"></div>
                            <div class="block" v-for="block in $parent.blocks" v-if="day.getDay() == block.day && id == block.week" v-bind:style="block.style.join(' ')"></div>
                            <h3 v-bind:class="getDayColor(day)">{{ day.getDate() }}</h3>
                        </div>
                    </td>
               </tr>`,
    props: ['week', 'id'],
    methods: {
        getDayColor: function (day) {
            var classes = [];

            if (+day == +new Date().setHours(0, 0, 0, 0)) {
                classes.push('today');
            }

            if ((day.getMonth() == this.$parent.calendar.visibleDate.getMonth()) && (day.getFullYear() == this.$parent.calendar.visibleDate.getFullYear())) {
                classes.push('active');
            }

            return classes.join(' ');
        }
    },
    mounted: function () {
        function position() {
            var rect = thisweek.getBoundingClientRect();
            var rect2 = container.getBoundingClientRect();

            if (thisweek.id != vm.id) {
                thisweek = document.getElementById(vm.id);
            }

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
        if ((this.id == this.$parent.calendar.weekorder[this.$parent.calendar.weekorder.length - 1]) && !this.$parent.initialized) {
            this.$parent.initialized = true;
            container.addEventListener('scroll', vm.$parent.handleCalendar);
            this.$parent.jumpTo(new Date());
        }

        /*

        The gist of this is that every week goes and gets its own data.

        vm.$parent.guild.giveaways.forEach((id) => {
            var giveaway = vm.$parent.giveaways[id];
            if (+reference < g && g < +tomorrow) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            var giveawaydata = JSON.parse(this.response);
                            //var starttime = new Date(+giveawaydata.start * 1000);
                            //var endtime = new Date(+giveawaydata.end * 1000);
                            Vue.set(vm.giveaways, giveaway, giveawaydata);
                        }
                    }
                };
                xhttp.open("GET", "api/v1/guild/schedule/giveaway/?" + id, true);
                xhttp.send();
            }
        });

        */

        //the issue at hand here is that we can't just treat each week as immutable. We need to have vue determine how many blocks and connectors need to be rendered.
    },
    updated: function () {
        var connectors = document.getElementById(this.id).querySelectorAll('.connector');
        for (let index = 0; index < connectors.length; index++) {
            var connector = connectors[index];

            if (connectors.length - 1 == 0) {
                return;
            }

            if (index < connectors.length / 2) {
                connector.style.marginTop = 3.5 / connectors.length + 'vw';
            }
            if (index >= connectors.length / 2) {
                connector.style.marginTop = -3.5 / connectors.length + 'vw';
            }
        }
    }
});