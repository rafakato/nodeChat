require.config({
    baseUrl: '/javascripts',
    paths: {
        'angular': 'lib/angular/angular',
        'angular-local-storage': 'lib/angular/plugins/angular-local-storage',
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