var express = require('express'),
    http = require('http'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    debug = require('debug')('my-application'),
    parseArgs = require('minimist');

var routes = require('./routes');

var app = express();

var argv = parseArgs(process.argv.splice(2));

app.configure(function () {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);

    app.use(function (req, res, next) {
        res.locals({
            title: "SChat",
            year: new Date().getFullYear(),
            buildPath: app.get('env') == 'production' ? '/build/' : '/',
            socketUrl: req.protocol + '://' + req.host + (app.get('socket-port') == 80 || app.get('socket-port') == 443 ? '' : ':' + app.get('socket-port')) + '/',
            appID: req.query.i,
            env: app.get('env')
        });
        next();
    });

    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', require('./routes'));
});


/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    /// catch 404 and forwarding to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);
app.set('socket-port', argv.socket_port || 3010);

var socketConfig = require('./socket')(app);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});