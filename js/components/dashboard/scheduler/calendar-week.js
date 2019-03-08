Vue.component('calendar-week', {
    template: `<tr v-bind:id="id"><td v-for="day in week"><div v-bind:class="getDayColor(day)"><h3 v-bind:class="getDayColor(day)">{{ day.getDate() }}</h3></div></td></tr>`,
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

        setTimeout(() => {
            Object.keys(vm.$parent.giveaways).forEach((id) => {
                giveaway = vm.$parent.giveaways[id];
                console.log(giveaway.start * 1000, giveaway.end * 1000, this.id);
                var weekofstart = (this.id < (giveaway.start * 1000) && (giveaway.start * 1000) < this.week[Object.keys(this.week).pop()].setHours(23, 59, 59, 999));
                var weekofend = (this.id < (giveaway.end * 1000) && (giveaway.end * 1000) < this.week[Object.keys(this.week).pop()].setHours(23, 59, 59, 999));
                var interimweek = (this.id > (giveaway.start * 1000) && (giveaway.end * 1000) > this.week[Object.keys(this.week).pop()].setHours(23, 59, 59, 999));
                if (weekofstart) {
                    console.log('the week of ' + new Date(this.id) + ' is the start of ' + id);
                }

                if (weekofend) {
                    console.log('the week of ' + new Date(this.id) + ' is the end of ' + id);
                }

                if (!weekofstart && !weekofend && interimweek) {
                    console.log('the week of ' + new Date(this.id) + ' is an interim of ' + id);
                }

            });
        }, 1000);
    }
});