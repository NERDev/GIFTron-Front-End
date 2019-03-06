Vue.component('navbar-button', {
    template: `<button v-on:click="click(item.function)">{{ item.name }}</button>`,
    props: ['item'],
    methods: {
        click: function (e) {
            console.log('Clicked ' + e);
            switch (e) {
                case 'dashboard':
                    window.location.hash = '#dashboard';
                    break;
                case 'home':
                    window.location.hash = '';
                    break;
                case 'blog':
                    //code
                    break;
                case 'community':
                    //code
                    break;
            }
        }
    }
});