Vue.component('user-avatar', {
    template: `<img v-bind:src="'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png'" />`,
    props: ['user'],
});

var app = new Vue({
    el: 'main',
    data() {
        return {
            user: {},
            loading: true
        };
    }
});


var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        // Action to be performed when the document is read;
        app.user = JSON.parse(this.response);
        app.loading = false;
    }
};
xhttp.open("GET", "api/v1/user", true);
xhttp.send();