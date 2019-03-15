String.prototype.toTitleCase = function () {
    var str = this;
    if (str.length = 0) {
        return str;
    }
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

window.onload = () => {
    var app = new Vue({
        el: 'main',
        data() {
            return {
                user: {},
                guilds: {},
                page: window.location.hash.split('?')[0]
            };
        },
        methods: {
            delete_cookie: function (name) {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
            },
            snackbar: function (params) {
                this.$refs.snackbar.fire(params);
            }
        },
        mounted: function () {
            var vm = this;
            function pageHandle() {
                if (vm.page) {
                    if (vm.$refs[vm.page]) {
                        vm.$refs[vm.page].active = true;
                        vm.title = 'GIFTron - ' + vm.$refs[vm.page].pageTitle;
                    } else {
                        vm.title = 'GIFTron - 404';
                        console.log('404 not found');
                    }
                } else {
                    vm.title = 'GIFTron';
                }


                if (typeof (Storage) !== 'undefined') {
                    console.log('remembering ' + window.location.hash + ' for next time');
                    localStorage.setItem('page', window.location.hash);
                }

                document.title = vm.title;
            }
            if (typeof (Storage) !== 'undefined') {
                if (localStorage.getItem('page')) {
                    if (localStorage.getItem('page').includes('?')) {
                        //window.location.hash = localStorage.getItem('page');
                        console.log('you were on ' + localStorage.getItem('page') + ' last time');
                    }
                }
            }
            pageHandle();
            window.onhashchange = function (e) {
                if (!window.location.hash) {
                    history.replaceState({}, document.title, ".");
                }
                vm.page = window.location.hash.split('?')[0];
                pageHandle();
            };
        }
    });
};
