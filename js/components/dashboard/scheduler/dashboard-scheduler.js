Vue.component('dashboard-scheduler', {
    template: `<div id="dashboardScheduler">
                    <h1>{{ [calendar.monthnames[calendar.visibleDate.getMonth()], calendar.visibleDate.getFullYear()].join(' ') }}</h1>
                    <div id="calendarDays"><div v-for="(dayname, index) in calendar.daynames" class="day">{{ dayname.split('').slice(0,3).join('') }}<div style="display: inline-block;" v-if="!shortenDay(index)">{{ dayname.split('').slice(3).join('') }}</div></div></div>
                    <hr>
                    <div id="calendarContainer">
                        <table>
                            <calendar-week v-for="id in calendar.weekorder" v-bind:week="calendar.weeks[id]" v-bind:id="id"></calendar-week>
                        </table>
                    </div>
               </div>`,
    props: ['guild'],
    methods: {
        shortenDay: function (i) {
            if (this.$el) {
                var day = this.$el.querySelector('#calendarDays').childNodes[i];
                if (day.clientHeight != day.childNodes[1].clientHeight) {
                    this.shortDay = true;
                }
            }

            if (this.shortDay) {
                return this.shortDay;
            }
        },
        jumpTo: function (day) {
            var first = new Date([day.getMonth() + 1, day.getDate(), day.getFullYear()].join('/'));
            document.querySelector('#calendarContainer').scrollTop = document.getElementById(+new Date((new Date(first).setDate(new Date(first).getDate() - new Date(first).getDay())))).offsetTop;
        },
        generate: function (number, reference) {
            var vm = this;

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

            if (number > 0) {
                for (let index = 0; index < number; index++) {
                    var tomorrow = new Date(reference);
                    var weekstart = new Date(tomorrow.setDate(tomorrow.getDate() + index * 7));
                    if (vm.calendar.weekorder.indexOf(+weekstart) == -1) {
                        vm.calendar.weekorder.push(+weekstart);
                    }
                    Vue.set(vm.calendar.weeks, +weekstart, buildWeek(weekstart));
                }
            } else {
                number = Math.abs(number);
                for (let index = 0; index < number; index++) {
                    var tomorrow = new Date(reference);
                    var weekstart = new Date(tomorrow.setDate(tomorrow.getDate() - index * 7));
                    if (vm.calendar.weekorder.indexOf(+weekstart) == -1) {
                        vm.calendar.weekorder.unshift(+weekstart);
                    }
                    Vue.set(vm.calendar.weeks, +weekstart, buildWeek(weekstart));
                }
            }
        },
        handleCalendar: function () {
            var vm = this;
            function getVisibleDate() {
                //console.log(vm.calendar.visibleweeks);
                vm.calendar.visibleDate = new Date(+Object.keys(vm.calendar.visibleweeks)[1]);
            }
            //console.log(Object.keys(vm.calendar.topweeks), Object.keys(vm.calendar.bottomweeks))
            if (Object.keys(vm.calendar.bottomweeks).length < 4) {
                console.log('getting close, loading more on the bottom');
                var date = Object.keys(vm.calendar.bottomweeks).pop();
                console.log(vm.calendar.bottomweeks);
                if (!isFinite(date)) {
                    date = Object.keys(vm.calendar.visibleweeks).pop();
                }

                if (date) {
                    console.log(date, new Date(+date));
                    vm.generate(10, new Date(+date));
                }
                //console.log(new Date(Math.min(...Object.keys(vm.calendar.bottomweeks))));
                //generate(10, new Date(Math.min(...Object.keys(vm.calendar.bottomweeks))));
            } else if (Object.keys(vm.calendar.topweeks).length < 4) {
                console.log('getting close, loading more on the top');
                var date = Object.keys(vm.calendar.topweeks).shift();
                console.log(vm.calendar.topweeks);
                if (!isFinite(date)) {
                    date = Object.keys(vm.calendar.visibleweeks).shift();
                }

                if (date) {
                    console.log(date, new Date(+date));
                    vm.generate(-10, new Date(+date));
                    console.log(document.getElementById(+date));
                    document.querySelector('#calendarContainer').scrollTop += document.querySelector('#calendarContainer tr').getBoundingClientRect().height * 9;
                }
            }
            getVisibleDate();
            //console.log('top', vm.calendar.topweeks);
            //console.log('visible', vm.calendar.visibleweeks);
            //console.log('bottom', vm.calendar.bottomweeks);
            //console.log(Object.keys(vm.calendar.topweeks).length, Object.keys(vm.calendar.bottomweeks).length);
        }
    },
    data: function () {
        return {
            calendar: {
                shortDay: false,
                weeks: {},
                weekorder: [],
                topweeks: [],
                bottomweeks: [],
                visibleweeks: [],
                monthnames: ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ],
                daynames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                visibleDate: new Date(),
                initialized: false
            }
        }
    },
    mounted: function () {

        var vm = this,
            today = new Date(new Date().setHours(0, 0, 0, 0)),
            sunday = new Date((new Date(today).setDate(new Date(today).getDate() - new Date(today).getDay())));

        vm.generate(-10, sunday);
        vm.generate(10, sunday);
    }
});