Vue.component('snackbar', {
    template: `<div id="snackbar" v-bind:class="'shadow default ' + type" style="transform: translateY(5em);"><i v-if="icons[type]" v-bind:class="'fas fa-' + icons[type]"></i><h1>{{ type.toTitleCase() }}:</h1><p>{{ message }}</p><button v-on:click="dismiss()"><i class="fas fa-times"></i></button></div>`,
    data: function () {
        return {
            type: "info",
            message: "aloha",
            icons: {
                info: 'info-circle',
                warning: 'exclamation-triangle',
                error: 'exclamation-circle'
            },
            callback: null
        }
    },
    methods: {
        dismiss: function () {
            var vm = this;
            anime({
                targets: '#snackbar',
                translateY: '5em'
            });
            if (vm.callback) {
                vm.callback();
                vm.callback = null;
            }
        },
        fire: function (params) {
            var vm = this;
            if (typeof params.timeout == 'undefined') {
                params.timeout = 4000;
            }
            vm.message = params.message;
            if (params.type) {
                vm.type = params.type;
            }
            anime({
                targets: '#snackbar',
                translateY: 0
            });
            if (params.timeout) {
                setTimeout(() => {
                    vm.dismiss();
                }, params.timeout);
            }
            if (params.callback) {
                vm.callback = params.callback;
            } else {
                vm.callback = null;
            }
        }
    }
})