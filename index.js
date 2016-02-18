'use strict';

var url = require('url');
var mysql = require("mysql");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser')
var qs = require('querystring');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "xpec@1923",
    database: "maho_log"
});

con.connect(function(err){
    if(err){
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

app.get('/', function(req, res){
  console.log('client connected');
  res.send('<h1>Hello world</h1>');
});

app.post('/test', function(req, res) {
    console.log('post connection');
    var loginTimeStamp = {guid: req.body.guid, eventTime: '2016-02-18 05:05:05'};
    con.query('INSERT INTO character_login SET ?', loginTimeStamp, function(err, res){
       if(err) throw err;
        console.log('Last insert ID:', res.insertId);
    });
    res.send('post /test. guid: ' + req.body.guid);
});

app.get('/stop', function(req, res) {
    var msg = 'closing mysql connections';
    con.end();
    console.log(msg)
    res.send(msg);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});



