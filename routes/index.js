module.exports = function() {
    var express = require('express'),
        app = express();


    app.get('/', function(req, res) {
        res.render('buy', {
            pageName: 'buy'
        });
    });

    app.get('/chat', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('index', {
            pageName: 'index'
        });
    });

    app.get('/chat/client', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('client', {
            pageName: 'client'
        });
    });

    app.get('/chat/operator', function(req, res) {
        if (!req.query.i) {
            res.redirect('/');
        }

        res.render('operator', {
            pageName: 'operator'
        });
    });

    return app;
}();