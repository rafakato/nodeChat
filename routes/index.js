module.exports = function() {
    var express = require('express'),
        app = express();

    app.get('/', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('index', {
            title: 'Chat'
        });
    });

    app.get('/client', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('client', {
            title: 'Chat',
            appID: req.query.i
        });
    });

    app.get('/operator', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('operator', {
            title: 'Chat',
            appID: req.query.i
        });
    });

    return app;
}();