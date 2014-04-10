module.exports = function() {
    var express = require('express'),
        app = express();

    app.get('/', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('index');
    });

    app.get('/client', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('client');
    });

    app.get('/operator', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('operator');
    });

    return app;
}();