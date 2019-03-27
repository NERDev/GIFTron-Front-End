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
                //console.log(vm.calendar.bottomweeks);
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
                //console.log(vm.calendar.topweeks);
                if (!isFinite(date)) {
                    date = Object.keys(vm.calendar.visibleweeks).shift();
                }

                if (date) {
                    //console.log(date, new Date(+date));
                    vm.generate(-10, new Date(+date));
                    //console.log(document.getElementById(+date));
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
                        //console.log(vm.blocks[[idParts[1], idParts[2]].join('-')]);
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
                            giveaway: id
                        });

                        if (giveaway.recurring) {
                            //This is a recurring giveaway.
                            //console.log(giveaway);
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
                                beginning: giveaway.beginning,
                                name: giveaway.name
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
                                    beginning: giveaway.beginning,
                                    name: giveaway.name
                                };
                                if (priorStart >= giveaway.beginning) {
                                    if (!vm.giveaways[priorId]) {
                                        Vue.set(vm.giveaways, priorId, priorGiveaway);
                                    }
                                }
                            } else {
                                //console.log('this is the start, there is no prior giveaways to this');
                            }

                            if (giveaway.count > 0 || typeof giveaway.count === 'undefined') {
                                if (giveaway.count > 0) {
                                    newGiveaway['count'] = giveaway.count - 1;
                                }
                                if (!vm.giveaways[newId]) {
                                    Vue.set(vm.giveaways, newId, newGiveaway);

                                    if (newStart * 1000 < (+Object.keys(vm.calendar.bottomweeks)[2])) {
                                        vm.buildCalendarElements();
                                        //console.log(newStart * 1000, +Object.keys(vm.calendar.visibleweeks).pop());
                                    }
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
                                giveaway: id
                            });

                            //So... now we have to figure out connectors. We've got two types of connectors: start/end, and interim.
                            //Let's take care of the start/end first, where applicable.

                            //We've got some space to fill for the start, we'll make a connector.
                            if (typeof vm.connectors[+startWeek] === 'undefined') {
                                Vue.set(vm.connectors, +startWeek, {});
                            }
                            Vue.set(vm.connectors[+startWeek], [+startWeek, idParts[2]].join('-'), {
                                style: ['background-color: ' + getbackgroundcolor(id) + ';', 'left: 10vw;'],
                                day: giveawayStart.getDay(),
                                block: [idParts[1], idParts[2]].join('-')
                            });
                            if (+startWeek != +endWeek) {
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
        },
        buildModalHTML: function (param, start, end) {
            var vm = this;
            
            function getLocalDateTime(date) {
                return [start.getFullYear(), (date.getMonth() + 1).AddZero(), date.getDate().AddZero()].join('-') + 'T' +
                [date.getHours().AddZero(),
                date.getMinutes().AddZero()].join(':');
            }
            
            return function () {
                var modalContent = document.querySelector('.vex-content');
                var title = document.createElement('h1');
                var undertitle = document.createElement('hr');
                if (isNaN(parseInt(param))) {
                    //display giveaway
                    title.innerText = param.name;
                    modalContent.appendChild(title);
                    modalContent.appendChild(undertitle);

                    var display = document.createElement('div');
                    var displayparamscontainer = document.createElement('ul');
                    var giveawaystart = document.createElement('li');
                    var giveawayend = document.createElement('li');
                    var imagecontainer = document.createElement('div');
                    var image = document.createElement('img');

                    var game = '';

                    display.className = 'display';
                    giveawaystart.innerText = "Start: " + new Date(+param.start * 1000).toLocaleString(vm.$root.user.locale);
                    giveawayend.innerText = "End: " + new Date(+param.end * 1000).toLocaleString(vm.$root.user.locale);

                    image.src = (() => {
                        if (param.visible) {
                            if (param.game_id) {
                                //go find pic and game name
                                game = 'rocket league'.toTitleCase();
                                return 'https://images.g2a.com/newlayout/323x433/1x1x0/c5cce5c915b4/591311205bafe31cbf5cd2db';
                            } else {
                                //display unknown
                                if (param.image) {
                                    return param.image;
                                } else {
                                    return 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
                                }
                            }
                        } else {
                            game = 'Mystery';
                            return 'https://upload.wikimedia.org/wikipedia/commons/6/61/Emojione_2754.svg';
                        }
                    })();

                    modalContent.appendChild(display);
                    display.appendChild(displayparamscontainer);
                    displayparamscontainer.appendChild(giveawaystart);
                    displayparamscontainer.appendChild(giveawayend);
                    display.appendChild(imagecontainer);
                    imagecontainer.appendChild(image);

                    if (game) {
                        var gametitle = document.createElement('h2');
                        gametitle.innerText = game;
                        imagecontainer.appendChild(gametitle);
                    }


                } else {
                    //create
                    var create = document.createElement('div');
                    var step1 = document.createElement('div');
                    var step2 = document.createElement('div');
                    var step3 = document.createElement('div');
                    var startdiv = document.createElement('div');
                    var starttitle = document.createElement('h2');
                    var startinput = document.createElement('input');
                    var secondinput = document.createElement('input');
                    create.className = 'create';
                    step1.id = 'step1';
                    step2.id = 'step2';
                    step2.style.display = 'none';
                    step3.id = 'step3';
                    step3.style.display = 'none';
                    step3.className = step2.className = step1.className = 'step';
                    startdiv.classList.add('start');
                    starttitle.innerText = 'Start';
                    startinput.type = secondinput.type = 'datetime-local';
                    startinput.value = startinput.min = getLocalDateTime(start);
                    startinput.className = secondinput.className = 'datetime';
                    startinput.required = secondinput.required = 'required';

                    modalContent.appendChild(title);
                    modalContent.appendChild(undertitle);
                    modalContent.appendChild(create);
                    create.appendChild(step1);
                    create.appendChild(step2);
                    create.appendChild(step3);
                    step1.appendChild(startdiv);
                    startdiv.appendChild(starttitle);
                    startdiv.appendChild(startinput);

                    var step2question = document.createElement('p');
                    step2question.innerText = 'Would you like GIFTron to handle this Giveaway all by itself?';
                    var step2affirmative = document.createElement('input');
                    var step2negative = document.createElement('input');
                    step2negative.type = step2affirmative.type = 'radio';
                    step2negative.name = step2affirmative.name = 'autonomous';
                    step2affirmative.value = '1';
                    step2affirmative.id = 'autonomychoice1';
                    step2negative.value = '0';
                    step2negative.id = 'autonomychoice2';


                    //Here
                    var step2affirmativecontainer = document.createElement('div');
                    var step2negativecontainer = document.createElement('div');
                    var step2affirmativelabel = document.createElement('label');
                    var step2negativelabel = document.createElement('label');
                    step2affirmativelabel.for = 'autonomychoice1';
                    step2affirmativelabel.innerText = 'Yes';
                    step2negativelabel.for = 'autonomychoice2';
                    step2negativelabel.innerText = 'No';
                    
                    step2.appendChild(step2question);
                    step2.appendChild(step2affirmative);
                    step2.appendChild(step2affirmativelabel);
                    step2.appendChild(step2negative);
                    step2.appendChild(step2negativelabel);

                    
                    if (param) {
                        //create recurring
                        title.innerText = 'Create Recurring Giveaway';
                        var nextdiv = document.createElement('div');
                        var nexttitle = document.createElement('h2');
                        var intervaldiv = document.createElement('div');
                        var intervalpart1 = document.createElement('h2');
                        var intervalpart2 = document.createElement('h2');
                        var intervalselect = document.createElement('select');

                        nextdiv.className = nexttitle.innerText = 'Next';
                        intervaldiv.className = 'interval';
                        secondinput.value = getLocalDateTime(new Date(start.getTime() + 604800000));
                        secondinput.min = getLocalDateTime(new Date(start.getTime() + 60000));

                        intervalpart1.innerText = 'Repeat';
                        intervalpart2.innerText = 'Times';

                        step1.appendChild(nextdiv);
                        step1.appendChild(intervaldiv);
                        nextdiv.appendChild(nexttitle);
                        nextdiv.appendChild(secondinput);
                        intervaldiv.appendChild(intervalpart1);
                        intervaldiv.appendChild(intervalselect);
                        intervaldiv.appendChild(intervalpart2);
                        
                        for (let index = 0; index <= 10; index++) {
                            var option = document.createElement('option');
                            if (!index) {
                                option.innerText = 'Infinite';
                            } else {
                                option.innerText = index;
                            }
                            intervalselect.appendChild(option);
                        }
                    } else {
                        //create one-off
                        title.innerText = 'Create One-Off Giveaway';
                        var enddiv = document.createElement('div');
                        var endtitle = document.createElement('h2');
                        
                        endtitle.innerText = 'End';
                        secondinput.value = getLocalDateTime(end);

                        step1.appendChild(enddiv);
                        enddiv.appendChild(endtitle);
                        enddiv.appendChild(secondinput);
                    }

                    var buttoncontainer = document.createElement('div');
                    buttoncontainer.id = 'giveawaySetupButtons';
                    var backbutton = document.createElement('button');
                    var nextbutton = document.createElement('button');

                    backbutton.innerText = 'Back';
                    nextbutton.innerText = 'Next';

                    backbutton.addEventListener('click', () => {
                        var steps = create.querySelectorAll('.step'),
                            currentStep;
                        steps.forEach((e) => {
                            if (!e.style.display) {
                                currentStep = parseInt(e.id.split('').pop());
                            }
                        });

                        if (currentStep - 1) {
                            create.querySelector('#step' + currentStep).style.display = 'none';
    
                            var nextStep = create.querySelector('#step' + --currentStep)
                            nextStep.style.display = '';
                        } else {
                            vex.closeAll();
                        }
                    });

                    nextbutton.addEventListener('click', () => {
                        var steps = create.querySelectorAll('.step'),
                            currentStep;
                        steps.forEach((e) => {
                            if (!e.style.display) {
                                currentStep = parseInt(e.id.split('').pop());
                            }
                        });

                        if (currentStep < steps.length) {
                            create.querySelector('#step' + currentStep).style.display = 'none';
    
                            var nextStep = create.querySelector('#step' + ++currentStep)
                            nextStep.style.display = '';
                        }
                    });

                    backbutton.className = nextbutton.className = 'main';

                    create.appendChild(buttoncontainer);
                    buttoncontainer.appendChild(backbutton);
                    buttoncontainer.appendChild(nextbutton);
                }
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

        var flag = 0;
        var startcoordinates = {};
        var isdown = false;
        var element = document.querySelector('table');
        var startingElement;
        var endingElement;
        var changedElements;
        var lastindex = 0;
        var misclicks = 0;

        element.addEventListener("mousedown", function (e) {
            flag = 0;
            startcoordinates = { x: e.clientX, y: e.clientY };
            var elements = element.querySelectorAll('td');
            isdown = true;
            startingElement = document.elementFromPoint(e.clientX, e.clientY).closest('td');
            lastindex = Array.prototype.indexOf.call(elements, startingElement);
            changedElements = [];
        }, false);
        element.addEventListener("mousemove", function (e) {
            const activeColor = '#9a9a9a';

            if (typeof vm.guild.settings !== 'undefined') {
                if (isdown && Math.abs(e.clientX - startcoordinates.x) > 5 && Math.abs(e.clientY - startcoordinates.y) > 5) {
                    flag = 1;
                    var elements = element.querySelectorAll('td');
                    var hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
                    var currentElement = hoveredElement.closest('td');
                    if (currentElement) {
                        var startingElementIndex = Array.prototype.indexOf.call(elements, startingElement);
                        var currentElementIndex = Array.prototype.indexOf.call(elements, currentElement);
                        var indeces = [startingElementIndex, currentElementIndex].sort(function (a, b) { return a - b });
                        for (let index = indeces[0]; index <= indeces[1]; index++) {
                            var thisindex = currentElementIndex + 1;
                            console.log(thisindex, lastindex, startingElementIndex);

                            elements[startingElementIndex].childNodes[0].style.backgroundColor = activeColor;
                            if (!(Array.prototype.indexOf.call(changedElements, elements[startingElementIndex].childNodes[0]) + 1)) {
                                changedElements.push(elements[startingElementIndex].childNodes[0]);
                            }

                            if (thisindex > lastindex) {
                                if (thisindex <= startingElementIndex + 1) {
                                    console.log('were goin forward again', lastindex);
                                    Array(thisindex - lastindex).fill(lastindex - 1).map((x, y) => x + y).forEach((x) => {
                                        changedElements.splice(Array.prototype.indexOf.call(changedElements, elements[x].childNodes[0]), 1);
                                        elements[x].childNodes[0].style.backgroundColor = '';
                                    });
                                } else {
                                    console.log('advancing ' + (thisindex - lastindex));
                                    console.log(Array(thisindex - lastindex).fill(thisindex).map((x, y) => x + y));
                                    Array(thisindex - lastindex).fill(lastindex).map((x, y) => x + y).forEach((x) => {
                                        console.log(Array.prototype.indexOf.call(changedElements, elements[x].childNodes[0]));
                                        if (!(Array.prototype.indexOf.call(changedElements, elements[x].childNodes[0]) + 1)) {
                                            changedElements.push(elements[x].childNodes[0]);
                                        }
                                        if (elements[x].childNodes[0].style.backgroundColor) {
                                            elements[x].childNodes[0].style.backgroundColor = '';
                                        } else {
                                            elements[x].childNodes[0].style.backgroundColor = activeColor;
                                        }
                                    });
                                }
                            } else if (thisindex < lastindex) {
                                if (thisindex <= startingElementIndex) {
                                    console.log('were goin backwards from ', startingElementIndex, elements[startingElementIndex], ' to ', thisindex - 1, elements[thisindex - 1]);
                                    console.log(startingElementIndex - (thisindex - 1), thisindex - 1);
                                    console.log(Array(startingElementIndex - thisindex + 2).fill(thisindex - 1).map((x, y) => x + y));
                                    Array(startingElementIndex - thisindex + 2).fill(thisindex - 1).map((x, y) => x + y).forEach((x) => {
                                        console.log(elements[x]);
                                        if (!(Array.prototype.indexOf.call(changedElements, elements[x].childNodes[0]) + 1)) {
                                            changedElements.push(elements[x].childNodes[0]);
                                        }
                                        elements[x].childNodes[0].style.backgroundColor = activeColor;
                                    });
                                } else {
                                    console.log('subtracting ' + (lastindex - thisindex));
                                    Array(lastindex - thisindex).fill(thisindex).map((x, y) => x + y).forEach((x) => {
                                        changedElements.splice(Array.prototype.indexOf.call(changedElements, elements[x].childNodes[0]), 1);
                                        elements[x].childNodes[0].style.backgroundColor = '';
                                    });
                                }
                            } else {
                                //console.log('staying');
                            }
                            lastindex = thisindex;
                            /*
                            elements[index].childNodes[0].style.backgroundColor = '#9a9a9a';
                            changedElements.push(elements[index].childNodes[0]);                    
                            console.log(startingElementIndex, currentElementIndex);
                            */
                        }
                    }
                }
            }
        }, false);
        document.addEventListener("mouseup", function (e) {
            isdown = false;
            if (e.which == 1) {
                endingElement = document.elementFromPoint(e.clientX, e.clientY);
                if (endingElement.classList.contains('block', 'connector')) {
                    console.log('ayy we clicked on a giveaway m88', vm.giveaways[vm.blocks[endingElement.closest('tr').id][endingElement.id].giveaway]);
                    vex.open({
                        afterOpen: vm.buildModalHTML(vm.giveaways[vm.blocks[endingElement.closest('tr').id][endingElement.id].giveaway])
                    });
                } else {
                    if (typeof vm.guild.settings !== 'undefined') {
                        endingElement = endingElement.closest('td');
                        if (startingElement) {
                            if (endingElement) {
                                for (let index = 0; index < changedElements.length; index++) {
                                    console.log(changedElements[index]);
                                    changedElements[index].style.backgroundColor = '';
                                }
                                var start = +new Date(+((Array.prototype.indexOf.call(startingElement.parentElement.querySelectorAll('td'), startingElement) * 86400000) + parseInt(startingElement.parentElement.id))).setHours(0, 0, 0, 0);
                                var end = +new Date(+((Array.prototype.indexOf.call(endingElement.parentElement.querySelectorAll('td'), endingElement) * 86400000) + parseInt(endingElement.parentElement.id))).setHours(0, 0, 0, 0);
                                var dates = [start, end].sort(function (a, b) { return a - b });
                                var startDate = new Date(dates[0]);
                                if (+startDate == new Date().setHours(0,0,0,0)) {
                                    var d = new Date();
                                    d.setMinutes(d.getMinutes() + 30);
                                    d.setMinutes(0);
                                    if (+d <= +new Date()) {
                                        d.setHours(d.getHours() + 1);
                                    }
                                    startDate = d;
                                }
                                var endDate = new Date(dates[1]);
                                if (+endDate == new Date().setHours(0,0,0,0)) {
                                    endDate = new Date(new Date(+startDate).setHours(startDate.getHours() + 1));
                                }
                                console.log(endDate);
                                if (+new Date().setHours(0, 0, 0, 0) > start || +new Date().setHours(0, 0, 0, 0) > end) {
                                    misclicks++;
                                    if (misclicks == 1) {
                                        //
                                    } else if (misclicks > 1 && misclicks < 5) {
                                        vm.$root.snackbar({
                                            type: 'info',
                                            message: 'You can\'t change the past.',
                                            callback: function () {
                                                misclicks = 1;
                                            }
                                        });
                                    } else {
                                        vm.$root.snackbar({
                                            type: 'error',
                                            message: 'Hey Dumbass! You can\'t change the past!',
                                            timeout: 0
                                        });
                                    }
                                } else {
                                    if (flag === 0) {
                                        console.log("creating a recurring giveaway starting on ", startDate);
                                        console.log(e);
                                        vex.open({
                                            afterOpen: vm.buildModalHTML(1, startDate)
                                        });
                                    }
                                    else if (flag === 1) {
                                        console.log('creating a one-off giveaway from ', startDate, ' to ', endDate);
                                        vex.open({
                                            afterOpen: vm.buildModalHTML(0, startDate, endDate)
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, false);
    },
    updated: function () {
        this.buildCalendarElements();
    }
});