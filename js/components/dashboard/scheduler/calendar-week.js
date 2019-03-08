Vue.component('calendar-week', {
    template: `<tr v-bind:id="id">
                    <td v-for="day in week">
                        <div v-bind:class="getDayColor(day)">
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

        function getbackgroundcolor(id) {
            return 'rgba(' + id.substring(0,9).match(/.{1,3}/g).map(x => x % 250).join(',') + ',0.5)';
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

        setTimeout(() => {
            Object.keys(vm.$parent.giveaways).forEach((id) => {
                giveaway = vm.$parent.giveaways[id];
                giveawayStart = new Date(id.split('-')[1] * 1000);
                giveawayEnd = new Date(id.split('-')[0] * 1000);
                //console.log(giveaway.start * 1000, giveaway.end * 1000, this.id);
                var weekofstart = (this.id < (giveaway.start * 1000) && (giveaway.start * 1000) < this.week[Object.keys(this.week).pop()].setHours(23, 59, 59, 999));
                var weekofend = (this.id < (giveaway.end * 1000) && (giveaway.end * 1000) < this.week[Object.keys(this.week).pop()].setHours(23, 59, 59, 999));
                var interimweek = (this.id > (giveaway.start * 1000) && (giveaway.end * 1000) > this.week[Object.keys(this.week).pop()].setHours(23, 59, 59, 999));

                var backgroundColor = getbackgroundcolor(id);

                if (giveaway.recurring) {
                    //This is a recurring giveaway. We're going to only render the start "block" and add another giveaway to the list.
                    //We just need to figure out where to put it.
                    if (weekofstart && weekofend) {
                        //This recurring giveaway's period is less than a week. We're going to loop through and determine what blocks need to be rendered.
                        //The way we do this is each loop, to take the difference in time between the start and the end, add that to the end to figure out the next end.
                        //If the next end falls within this week, render a block on the day it falls on and loop again.
                        //If the next end falls outside this week, add a new instance of that giveaway to the list.
                    } else {
                        //This recurring giveaway's period is greater than this week. We're going to render one block and make a new giveaway for the list.
                        //console.log('recurring giveaway ' + id + ' only happens once this week. Rendering only one block.');
                    }

                    //The process of adding to the list:
                    //Figure out the new start and end times, keep all else equal including the ID of the giveaway

                } else {
                    //This is a one-off giveaway.
                    if (weekofstart && weekofend) {
                        //Same-week giveaway.
                        if (giveawayStart.getDate() == giveawayEnd.getDate()) {
                            //Same-day giveaway. Just rendering one block.
                            console.log('giveaway ' + id + ' starts and ends on the ' + giveawayStart.getDate() + '. Just going to render one block');
                        } else {
                            //Different-day giveaway. Rendering two blocks and connecting.
                            console.log('the week of ' + new Date(this.id) + ' is the start and end of ' + id);
                        }
                    } else {
                        //Multi-week giveaway.
                        if (weekofstart) {
                            console.log('this week is ', thisweek);
                            console.log('the week of ' + new Date(this.id) + ' is the discrete start of ' + id);
                            var day = thisweek.childNodes[giveawayStart.getDay()].childNodes[0];
                            var block = document.createElement('div');
                            var connector = document.createElement('div');
                            block.classList.add('block');
                            block.style.backgroundColor = backgroundColor;
                            day.appendChild(block);
                            connector.classList.add('connector');
                            connector.style.backgroundColor = backgroundColor;
                            connector.style.right = '5px';
                            connector.style.marginTop = '3.5vw';
                            connector.style.width = (100 / 7) * (6 - giveawayStart.getDay()) + '%';
                            if (parseFloat(connector.style.width) > 0) {
                                thisweek.appendChild(connector);
                            }
                            
                            console.log(thisweek.childNodes[giveawayStart.getDay()]);
                        } else if (weekofend) {
                            console.log('the week of ' + new Date(this.id) + ' is the discrete end of ' + new Date(id.split('-')[1] * 1000) + ' to ' + new Date(id.split('-')[0] * 1000));
                            var day = thisweek.childNodes[giveawayEnd.getDay()].childNodes[0];
                            var block = document.createElement('div');
                            var connector = document.createElement('div');
                            block.classList.add('block');
                            block.style.backgroundColor = backgroundColor;
                            day.appendChild(block);
                            connector.classList.add('connector');
                            connector.style.backgroundColor = backgroundColor;
                            connector.style.left = '3px';
                            connector.style.marginTop = '3.5vw';
                            connector.style.width = (100 / 7) * giveawayEnd.getDay() + '%';
                            if (parseFloat(connector.style.width) > 0) {
                                thisweek.appendChild(connector);
                            }
                        } else if (interimweek) {
                            console.log('the week of ' + new Date(this.id) + ' is an interim of ' + new Date(id.split('-')[1] * 1000) + ' to ' + new Date(id.split('-')[0] * 1000));
                            var connector = document.createElement('div');
                            connector.classList.add('connector');
                            connector.style.backgroundColor = backgroundColor;
                            connector.style.left = '3px';
                            connector.style.marginTop = '3.5vw';
                            connector.style.width = 'calc(100% - 8px)';
                            thisweek.appendChild(connector);
                        }
                    }                    
                }

            });
        }, 1000);
    }
});