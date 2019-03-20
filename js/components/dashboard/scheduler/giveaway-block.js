Vue.component('giveaway-block', {
    template: `<div class="block" v-bind:id="id"></div>`,
    props: ['id', 'giveaway'],
    mounted: function () {
        var vm = this;
        if (vm.$parent.$parent.giveaways[vm.giveaway].name) {
            tippy("[id=\'" + vm.id + "\'].block", {
                content: vm.$parent.$parent.giveaways[vm.giveaway].name,
                onShow: function () {
                    document.getElementById(vm.id).closest('table').querySelectorAll('[id$="' + vm.id.split('-')[1] + '"].connector').forEach((e) => {
                        e.style.opacity = 1;
                        e.style.visibility = 'visible';
                    });
                },
                onHide: function () {
                    document.getElementById(vm.id).closest('table').querySelectorAll('[id$="' + vm.id.split('-')[1] + '"].connector').forEach((e) => {
                        e.style.opacity = 0;
                    });
                },
                onHidden: function () {
                    document.getElementById(vm.id).closest('table').querySelectorAll('[id$="' + vm.id.split('-')[1] + '"].connector').forEach((e) => {
                        e.style.visibility = '';
                    });
                }
            });
        }
    }
})