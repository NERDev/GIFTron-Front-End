Vue.component('user-dropdown', {
    template: `<ul class="dropdown menu"><li v-if="user.staff"><button v-on:click="click('staff')">Staff</button></li><li v-for="item in items"><hr><button v-on:click="click(item.function)">{{ item.name }}</button></li></ul>`,
    props: ['user'],
    data() {
        //need to handle this part on mounted
        var items = [
            { name: "My Servers", function: "servers" },
            { name: "Notifications", function: "notifications" },
            { name: "Log Out", function: "logout" }
        ];

        return {
            items
        }
    },
    methods: {
        click: function (e) {
            console.log('Clicked ' + e);
            switch (e) {
                case 'staff':
                case 'servers':
                case 'notifications':
                    window.location.hash = '#' + e;
                    this.$parent.close();
                    break;
                case 'logout':
                    this.$root.user = {};
                    this.$root.delete_cookie('session');
                    this.$parent.close();
                    window.location.hash = '';
                    break;
            }
        }
    }
});