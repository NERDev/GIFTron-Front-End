Vue.component('dashboard-guild-profile', {
    template: `<div class="profile">
                    <img v-if="guild.icon" v-bind:src="'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png?size=1024'" class="shadow">
                    <h1>{{ guild.name }}</h1>
                    <h3 v-if="typeof guild.wallet !== 'undefined'">\${{ guild.wallet.toFixed(2) }}</h3>
                    <button class="main" v-if="typeof guild.wallet !== 'undefined'">Add Funds</button>
               </div>`,
    props: ['guild']
});