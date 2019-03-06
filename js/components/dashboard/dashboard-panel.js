Vue.component('dashboard-panel', {
    template: `<div class="panel" id="dashboardPanel" style="transform: translateY(-100vh);">
                    <dashboard-menu v-bind:guild="guild"></dashboard-menu>
                    <dashboard-settings v-bind:guild="guild" class="main shadow"></dashboard-settings>
                    <div id="schedulerViews">
                        <dashboard-scheduler v-bind:guild="guild" class="main" v-if="Object.keys(guild).length"></dashboard-scheduler>
                        <dashboard-events v-bind:guild="guild" class="main"></dashboard-events>
                        <dashboard-shards v-bind:guild="guild" class="main"></dashboard-shards>
                    </div>
               </div>`,
    props: ['guild']
});