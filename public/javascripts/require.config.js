require.config({
    baseUrl: '/javascripts',
    paths: {
        'angular': 'lib/angular/angular',
        'moment': 'lib/momentjs/moment',
        'socket.io': 'lib/socket.io/socket.io',
        'underscore': 'lib/underscore/underscore'
    },
    shim: {
        'angular': {
            'exports': 'angular'
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