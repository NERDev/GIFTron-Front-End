Vue.component('giveaway-connector', {
    template: `<div class="connector" v-bind:id="id"></div>`,
    props: ['id', 'block'],
    mounted: function () {
        var vm = this;
        if (vm.block) {
            var giveaway = vm.$parent.$parent.giveaways[vm.$parent.$parent.blocks[vm.$parent.id][vm.block].giveaway];
            if (giveaway) {
                tippy("[id=\'" + vm.id + "\'].connector", {
                    content: giveaway.name,
                    interactive: true,
                    followCursor: 'horizontal'
                });
            }
        }
    }
})