Vue.component('setup-options', {
    template: `<ul class="setup-options" v-show="(step == $parent.step)">
        <li v-for="(name, id) in setup.suggested">
            <button v-on:click="removed" v-bind:value="id" v-bind:id="id" v-on:mouseenter="hover(id)" v-on:mouseleave="hover(id)"><i class="far fa-times-circle"></i>{{ prefix }}{{ name }}</button>
        </li>
        <li>
            <select v-on:click="selected" v-if="Object.keys(setup.available).length !== 0">
                <option value="" selected disabled>Select {{ thing }}s</option><option v-for="(name, id) in setup.available" v-bind:value="id">{{ prefix }}{{ name }}</option>
            </select>
        </li>
    </ul>`,
    props: ['setup', 'prefix', 'step'],
    data: function () {
        var scope = this.$parent.scopes[this.step];
        return {
            scope,
            oldSelect: null,
            thing: scope.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        }
    },
    methods: {
        hover: function (id) {
            var circle = document.getElementById(id).querySelector('i');
            if (circle.classList.contains('fas')) {
                circle.classList.remove('fas');
                circle.classList.add('far');
            } else if (circle.classList.contains('far')) {
                circle.classList.remove('far');
                circle.classList.add('fas');
            }
        },
        selected: function (event) {
            var vm = this,
                newSelect = event.target.value;
            if (newSelect) {
                if (newSelect != vm.oldSelect) {
                    if (!vm.setup.suggested) {
                        vm.setup.suggested = {};
                    }
                    vm.oldSelect = newSelect;
                    Vue.set(vm.setup.suggested, newSelect, vm.setup.available[newSelect]);
                    delete vm.setup.available[newSelect];
                    if (event.target.tagName == 'OPTION') {
                        event.target.parentElement.selectedIndex = 0;
                    } else {
                        event.target.selectedIndex = 0;
                    }
                }
            }
        },
        removed: function (event) {
            var vm = this,
                value = event.target.value;
            if (!value) {
                value = event.target.parentElement.value;
            }
            console.log(value);
            Vue.set(vm.setup.available, value, vm.setup.suggested[value]);
            delete vm.setup.suggested[value];
            vm.oldSelect = null;
        }
    },
    mounted: function () {
        var vm = this;
        console.log(vm.setup.suggested);
    }
});