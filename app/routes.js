'use strict';

var dbManager = require('./models/dbManager.js');
var crypto = require('crypto');
// var passEncrypt = require('./models/passEncrypt.js');

module.exports = function(app, passport, con) {

    app.get('/', function(req, res) {
        res.send('<h1>Hello world</h1>');
    });

    app.post('/updateScore', function(req, res){
        var guid = req.body.guid;
        var score = req.body.score;
        dbManager.isNewGuid(res, con, guid, function(res, con, guid){
            console.log('Error updating score with guid: ' + guid);
            res.send('Error updating score with guid: ' + guid);
        }, function(res, con, guid){
            con.query('UPDATE maho_game.players SET score = ? WHERE guid = ?', [score, guid], function(err, result) {
                if(err) throw err;
                console.log('Update score complete. guid: ' + guid);
                res.send('Update score complete. guid: ' + guid);
            });
        });
    });

    app.post('/login', function(req, res) {
        var guid = req.body.guid;
        var eventTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var loginTimeStamp = {
            guid: guid,
            eventTime: eventTime
        };
        var passwd = '';
        if (req.body.password) {
            passwd = req.body.password;
        } else {
            // Error
            res.send('password is required');
            return
        }
        passwd = crypto.createHash('sha256').update(passwd).digest('hex');
        var player = {
            name: 'undefined',
            guid: guid,
            score: 0,
            password: passwd
        }
        // check if guid has already been registered in DB
        dbManager.isNewGuid(res, con, guid,
            function(res, con, guid) {
            // new player
            console.log('new guid: ' + guid);
            //  log time
            con.query('INSERT INTO maho_log.character_login SET ?', loginTimeStamp, function (err, res) {
                if (err) throw err;
                console.log('Last insert ID:', res.insertId);
            });
            con.query('INSERT INTO maho_game.players SET ?', player, function (err, result) {
                if (err) throw err;
            });
            res.send('score: ' + player.score);
        }, function(res, con, guid) {
            // old player
            console.log('old player: ' + guid);
            // check password
            dbManager.isPasswordCorrect(con, guid, passwd, function(){
                // password match
                con.query('SELECT score from maho_game.players WHERE guid = ?', guid, function (err, rows) {
                    if (err) throw err;
                    res.send('score: ' + rows[0].score);
                });
            }, function(errMsg) {
                res.send(errMsg);
            });
        });
    });

    app.post('/logout', function(req, res) {
        var guid = req.body.guid;
        var eventTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var logoutTimeStamp = {
            guid: req.body.guid,
            eventTime: eventTime
        };
        // check if guid has already been registered in DB
        dbManager.isNewGuid(res, con, guid,
            function(res, con, guid) {
                console.log('Error logging out: guid ' + guid + ' does not exist');
                res.send('Error logging out: guid ' + guid + ' does not exist');
            }, function(res, con, guid) {
                // old player
                console.log('player: ' + guid + ' logging out');
                con.query('INSERT INTO maho_log.character_logout SET ?', logoutTimeStamp, function (err, res) {
                    if (err) throw err;
                    console.log('Last insert ID:', res.insertId);
                });
                res.send('guid ' + guid + ' logout');
            });
    });

    app.get('/stop', function(req, res) {
        var msg = 'closing mysql connections';
        con.end();
        console.log(msg)
        res.send(msg);
    });
}