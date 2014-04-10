module.exports = function() {
    var express = require('express'),
        app = express();

    var nodePath = '/javascripts';
    if (app.get('env') == 'production') {
        nodePath += '/build';
    }

    app.get('/', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('index', {
            title: 'Chat',
            nodePath: nodePath
        });
    });

    app.get('/client', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('client', {
            title: 'Chat',
            appID: req.query.i,
            nodePath: nodePath
        });
    });

    app.get('/operator', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('operator', {
            title: 'Chat',
            appID: req.query.i,
            nodePath: nodePath
        });
    });

    return app;
}();