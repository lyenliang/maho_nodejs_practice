'use strict';

var url = require('url');

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/server_info.properties');
var port = properties.get('server.port');

var mysql = require("mysql");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser')


var morgan = require('morgan');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');

var jsonParser = bodyParser.json();       // to support JSON-encoded bodies

var dbManager = require('./app/models/dbManager');



app.use(jsonParser);
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));
app.use(morgan('dev'));

// required for passport
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'iehlkjwehfisjqkjhviejlksaa'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Error Handling
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
dbManager.initDB();
var con = mysql.createConnection({
    host: properties.get('database.host'),
    user: properties.get('database.user'),
    password: properties.get('database.password')
});

con.connect(function(err){
    if(err){
        console.log('Error connecting to Db');
        return;
    }

    console.log('MySQL Connection established');
});

require('./app/routes.js')(app, passport, con);

http.listen(port, function(){
  console.log('listening on port:' + port);
});



