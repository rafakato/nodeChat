require.config({
    baseUrl: '/javascripts',
    paths: {
        'angular': 'lib/angular/angular',
        'angular-local-storage': 'lib/angular/plugins/angular-local-storage',
        'angular-sanitize': 'lib/angular/plugins/angular-sanitize',
        'angular-gettext': 'lib/angular/plugins/angular-gettext',
        'moment': 'lib/momentjs/moment',
        'socket.io': 'lib/socket.io/socket.io',
        'underscore': 'lib/underscore/underscore'
    },
    shim: {
        'angular': {
            'exports': 'angular'
        },
        'angular-local-storage': {
            'deps': ['angular']
        },
        'angular-sanitize': {
            'deps': ['angular']
        },
        'angular-gettext': {
            'deps': ['angular']
        },
        'moment': {
            'exports': 'moment'
        },
        'socket.io': {
            'exports': 'io'
        },
        'underscore': {
            'exports': '_'
        }
    }
});