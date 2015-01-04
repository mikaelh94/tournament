// modules =================================================
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();




// configuration ===========================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));






// Passport / Session
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport/init');
initPassport(passport);



// Routes
var indexRoutes = require('./routes/index')();
var tournamentsRoutes = require('./routes/tournaments')();
var usersRoutes = require('./routes/users')();
var authRoutes = require('./routes/auth')(passport);

app.use('/', indexRoutes);
app.use('/tournaments', tournamentsRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);



app.use('/bower_components',  express.static(path.join(__dirname + '/bower_components')));





// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tournament');



app.listen( process.env.PORT || 3000 );


module.exports = app;