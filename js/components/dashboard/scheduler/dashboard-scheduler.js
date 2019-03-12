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


            vm.guild.giveaways.forEach((giveaway) => {
                var start = giveaway.split('-')[1] * 1000;
                var end = giveaway.split('-')[0] * 1000;
                var parts = [+reference, +tomorrow].sort();
                if ((parts[0] > start && parts[0] < end) || (start > parts[0] && start < parts[1])) {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            if (this.status == 200) {
                                var giveawaydata = JSON.parse(this.response);
                                //var starttime = new Date(+giveawaydata.start * 1000);
                                //var endtime = new Date(+giveawaydata.end * 1000);
                                Vue.set(vm.giveaways, giveaway, giveawaydata);
                                vm.buildCalendarElements();
                            }
                        }
                    };
                    xhttp.open("GET", "api/v1/guild/schedule/giveaway/?" + giveaway, true);
                    xhttp.send();
                }
            });
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
        },
        buildCalendarElements: function () {
            var vm = this;

            function getbackgroundcolor(id) {
                return 'rgba(' + id.split('-')[2].substring(0, 9).match(/.{1,3}/g).map(x => x % 250).join(',') + ',1)';
            }

            if (Object.keys(vm.giveaways).length) {
                Object.keys(vm.giveaways).forEach((id) => {
                    if (typeof vm.blocks[[id.split('-')[1], id.split('-')[2]].join('-')] == 'undefined') {
                        var idParts = id.split('-');
                        console.log(vm.blocks[[idParts[1], idParts[2]].join('-')]);
                        giveaway = vm.giveaways[id];
                        giveawayStart = new Date(idParts[1] * 1000);
                        giveawayEnd = new Date(idParts[0] * 1000);

                        var startWeek = new Date(new Date((new Date(giveawayStart).setDate(new Date(giveawayStart).getDate() - new Date(giveawayStart).getDay()))).setHours(0, 0, 0, 0));
                        var endWeek = new Date(new Date((new Date(giveawayEnd).setDate(new Date(giveawayEnd).getDate() - new Date(giveawayEnd).getDay()))).setHours(0, 0, 0, 0));
                        //console.log(startWeek, endWeek);

                        if (typeof vm.blocks[+startWeek] === 'undefined') {
                            Vue.set(vm.blocks, +startWeek, {});
                        }
                        Vue.set(vm.blocks[+startWeek], [idParts[1], idParts[2]].join('-'), {
                            style: ['background-color: ' + getbackgroundcolor(id) + ';'],
                            day: giveawayStart.getDay(),
                        });

                        if (giveaway.recurring) {
                            //This is a recurring giveaway.
                            console.log(giveaway);
                            var newStart = giveaway.end;
                            var newEnd = giveaway.end + (giveaway.end - giveaway.start);
                            var newId = [newEnd, newStart, id.split('-')[2]].join('-');
                            var newGiveaway = {
                                start: newStart,
                                end: newEnd,
                                recurring: true,
                                channel: giveaway.channel,
                                game_id: giveaway.game_id,
                                visible: giveaway.visible,
                                guild_id: giveaway.guild_id,
                                beginning: giveaway.beginning
                            };

                            if (giveaway.beginning < giveaway.start) {
                                //lets get the most recent expected ID...
                                var priorEnd = giveaway.start;
                                var priorStart = priorEnd - (giveaway.end - giveaway.start);
                                var priorId = [priorEnd, priorStart, id.split('-')[2]].join('-');
                                var priorGiveaway = {
                                    start: priorStart,
                                    end: priorEnd,
                                    recurring: true,
                                    channel: giveaway.channel,
                                    game_id: giveaway.game_id,
                                    visible: giveaway.visible,
                                    guild_id: giveaway.guild_id,
                                    beginning: giveaway.beginning
                                };
                                if (priorStart >= giveaway.beginning) {
                                    if (!vm.giveaways[priorId]) {
                                        Vue.set(vm.giveaways, priorId, priorGiveaway);
                                    }
                                }
                            } else {
                                console.log('this is the start, there is no prior giveaways to this');
                            }

                            if (giveaway.count > 0 || typeof giveaway.count === 'undefined') {
                                if (giveaway.count > 0) {
                                    newGiveaway['count'] = giveaway.count - 1;
                                }
                                if (!vm.giveaways[newId]) {
                                    Vue.set(vm.giveaways, newId, newGiveaway);
                                }
                            }
                        } else {
                            //This is a one-off giveaway. We're definitely rendering the start block, so we can at least take care of that right away.

                            var needsendconnector = false;
                            //The question now is, do we need anything else? Let's find out.
                            if (+startWeek == +endWeek) {
                                //This one-off giveaway has the same week for its start and end.
                                if (giveawayStart.getDay() == giveawayEnd.getDay()) {
                                    //It's on the same day though. We're not going to bother with rendering anything else.
                                    return;
                                } else if (giveawayEnd.getDay() - giveawayStart.getDay() <= 1) {
                                    //It's only a day's difference... No need to render a connector.
                                } else {
                                    //We have more than a day's difference... We are going to need a single conector.
                                }
                            } else {
                                needsendconnector = true;
                            }

                            //Alright, let's go ahead and make the end block.
                            if (typeof vm.blocks[+endWeek] === 'undefined') {
                                Vue.set(vm.blocks, +endWeek, {});
                            }
                            Vue.set(vm.blocks[+endWeek], [idParts[0], idParts[2]].join('-'), {
                                style: ['background-color: ' + getbackgroundcolor(id) + ';'],
                                day: giveawayEnd.getDay(),
                            });

                            //So... now we have to figure out connectors. We've got two types of connectors: start/end, and interim.
                            //Let's take care of the start/end first, where applicable.

                            if (giveawayStart.getDay() < 6) {
                                //We've got some space to fill for the start, we'll make a connector.
                                if (typeof vm.connectors[+startWeek] === 'undefined') {
                                    Vue.set(vm.connectors, +startWeek, {});
                                }
                                Vue.set(vm.connectors[+startWeek], [+startWeek, idParts[2]].join('-'), {
                                    style: ['background-color: ' + getbackgroundcolor(id) + ';', 'left: 10vw;'],
                                    day: giveawayStart.getDay(),
                                    block: [idParts[1], idParts[2]].join('-')
                                });
                            }

                            if (needsendconnector) {
                                if (giveawayEnd.getDay()) {
                                    //We've got some space to fill for the end, we'll make a connector.
                                    if (typeof vm.connectors[+endWeek] === 'undefined') {
                                        Vue.set(vm.connectors, +endWeek, {});
                                    }
                                    Vue.set(vm.connectors[+endWeek], [idParts[0], idParts[2]].join('-'), {
                                        style: ['background-color: ' + getbackgroundcolor(id) + ';', 'right: 10vw;'],
                                        day: giveawayEnd.getDay(),
                                        block: [idParts[0], idParts[2]].join('-')
                                    });
                                }
                            }

                            //Now for the interim weeks.
                            var workingTime = new Date(startWeek);
                            for (let index = 0; index < Math.round((+endWeek - +startWeek) / (7 * 24 * 60 * 60 * 1000)) - 1; index++) {
                                var interimweek = new Date(+workingTime + (7 * (index + 1)) * 24 * 60 * 60 * 1000);
                                interimweek.setHours(0, 0, 0, 0);
                                if (typeof vm.connectors[+interimweek] === 'undefined') {
                                    Vue.set(vm.connectors, +interimweek, {});
                                }
                                Vue.set(vm.connectors[+interimweek], [+interimweek, idParts[2]].join('-'), {
                                    style: ['background-color: ' + getbackgroundcolor(id) + ';'],
                                    day: interimweek.getDay(),
                                });
                            }
                        }
                    }
                });
            }
        }
    },
    data: function () {
        return {
            giveaways: {},
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
            },
            connectors: {},
            blocks: {}
        }
    },
    mounted: function () {

        var vm = this,
            today = new Date(new Date().setHours(0, 0, 0, 0)),
            sunday = new Date((new Date(today).setDate(new Date(today).getDate() - new Date(today).getDay())));

        vm.generate(-10, sunday);
        vm.generate(10, sunday);
    },
    updated: function () {
        this.buildCalendarElements();
    }
});