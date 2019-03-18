Vue.component('calendar-week', {
    template: `<tr v-bind:id="id">
                    <td v-for="day in week">
                        <div v-bind:class="getDayColor(day)">
                            <div class="connector" v-for="(connector, index) in $parent.connectors[id]" v-if="day.getDay() == connector.day" v-bind:id="index"></div>
                            <div class="block" v-for="(block, index) in $parent.blocks[id]" v-if="day.getDay() == block.day" v-bind:id="index" v-bind:style="block.style.join(' ')" v-on:mouseover="highlight('on', index)" v-on:mouseleave="highlight('off', index)"></div>
                            <h3 v-bind:class="getDayColor(day)">{{ day.getDate() }}</h3>
                        </div>
                    </td>
               </tr>`,
    props: ['week', 'id'],
    methods: {
        highlight: function (event, id) {
            if (event == 'on') {
                document.getElementById(this.id).parentElement.querySelectorAll('[id$="' + id.split('-')[1] + '"]').forEach((e) => {
                    e.style.opacity = 1;
                    e.style.visibility = 'visible';
                });
            } else {
                document.getElementById(this.id).parentElement.querySelectorAll('[id$="' + id.split('-')[1] + '"]').forEach((e) => {
                    e.style.opacity = '';
                    e.style.visibility = '';
                });
            }
        },
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

        var vm = this;

        setTimeout(() => {
            var blocks = document.getElementById(this.id).querySelectorAll('.block');
            for (let index = 0; index < blocks.length; index++) {
                var block = blocks[index];
                var day = block.parentElement;
                var dayblocks = day.querySelectorAll('.block');
                var calculatedwidth = ((1 / dayblocks.length) * 100);
                if (calculatedwidth != block.style.width) {
                    block.style.width = calculatedwidth + '%';
                }
            }



            var connectors = document.getElementById(this.id).querySelectorAll('.connector');
            var mid = Math.floor(connectors.length / 2);
            for (let index = 0; index < connectors.length; index++) {
                var connector = connectors[index];
                connector.style = vm.$parent.connectors[connector.closest('tr').id][connector.id].style.join(' ');
                var blocks = Array.from(document.getElementById(this.id).querySelectorAll('[id$="' + connector.id.split('-')[1] + '"]')).map((x) => {
                    if (x.classList[0] != 'connector') {
                        return x;
                    }
                }).filter(x => x);

                if (blocks.length == 1) {
                    var leftdifference = connector.getBoundingClientRect().left - blocks[0].getBoundingClientRect().right;
                    var rightdifference = connector.getBoundingClientRect().right - blocks[0].getBoundingClientRect().left;
                    var topdifference = blocks[0].getBoundingClientRect().top - connector.getBoundingClientRect().top;
                    if (parseInt((topdifference + (connector.clientHeight / 1.1)))) {
                        vm.$parent.connectors[connector.closest('tr').id][connector.id].style.push('top: ' + (topdifference + (connector.clientHeight / 1.1)) + 'px;');
                    }
                    //console.log(blocks[0], connector, leftdifference, rightdifference);
                    if (Math.abs(leftdifference) < Math.abs(rightdifference)) {
                        if (parseInt(leftdifference)) {
                            //console.log('we have ' + 'left: ' + (-leftdifference) + 'px;' + ' to clear left');
                            vm.$parent.connectors[connector.closest('tr').id][connector.id].style.push('left: calc(10vw + ' + (-leftdifference) + 'px);');
                            vm.$parent.connectors[connector.closest('tr').id][connector.id].style.push('width: ' + (document.getElementById(this.id).childNodes[document.getElementById(this.id).childNodes.length - 1].getBoundingClientRect().right - blocks[0].getBoundingClientRect().right) + 'px;');
                        }
                    } else {
                        if (parseInt(rightdifference)) {
                            //console.log('we have ' + 'right: ' + (-rightdifference) + 'px;' + ' to clear right');
                            vm.$parent.connectors[connector.closest('tr').id][connector.id].style.push('right: calc(10vw - ' + (-rightdifference) + 'px);');
                            //console.log('kek', blocks[0], document.getElementById(this.id).childNodes[0]);
                            vm.$parent.connectors[connector.closest('tr').id][connector.id].style.push('width: ' + (blocks[0].getBoundingClientRect().left - document.getElementById(this.id).childNodes[0].getBoundingClientRect().left) + 'px;');
                        }
                    }
                } else if (blocks.length == 2) {
                    var difference = Math.abs(blocks[0].getBoundingClientRect().right - connector.getBoundingClientRect().left);
                    if (parseInt(difference) > 2) {
                        vm.$parent.connectors[connector.closest('tr').id][connector.id].style.push('left: ' + (difference - 1) + 'px;');
                    }

                    vm.$parent.connectors[connector.closest('tr').id][connector.id].style.push('width: ' + (blocks[1].getBoundingClientRect().left - blocks[0].getBoundingClientRect().right) + 'px;');
                } else {
                    vm.$parent.connectors[connector.closest('tr').id][connector.id].style.push('left: -1px;');
                    vm.$parent.connectors[connector.closest('tr').id][connector.id].style.push('top: 3.75vw;');
                    vm.$parent.connectors[connector.closest('tr').id][connector.id].style.push('width: ' + (document.getElementById(this.id).childNodes[document.getElementById(this.id).childNodes.length - 1].getBoundingClientRect().right - connector.getBoundingClientRect().left - 1) + 'px;');
                }
                connector.style = vm.$parent.connectors[connector.closest('tr').id][connector.id].style.join(' ');



                /*
                if (connectors.length - 1 != 0) {
                    if (index < mid) {
                        var unit = 3.5 / connectors.length;
                        //console.log((unit * (Math.abs(mid - index))));
                        connector.style.marginTop = (unit * (Math.abs(mid - index))) + 'vw';
                    }
                    if (index > mid) {
                        var unit = -3.5 / connectors.length;
                        //console.log((unit * (Math.abs(mid - index))));
                        connector.style.marginTop = (unit * (Math.abs(mid - index))) + 'vw';
                    }
                }
                */
            }
        }, 10);
    }
});