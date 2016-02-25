'use strict';

var dbManager = require('./models/dbManager.js');
var passEncrypt = require('./models/passEncrypt.js');

module.exports = function(app, passport, con) {

    app.get('/', function(req, res) {
        res.send('<h1>Hello world</h1>');
    });

    app.post('/updateTopScore', function(req, res){
        var guid = req.body.guid;
        var score = req.body.score;
        dbManager.isNewGuid(con, guid, function(con, guid){
            console.log('Error updating score with guid: ' + guid);
            res.send('Error updating score with guid: ' + guid);
        }, function(con, guid) {
            dbManager.isScoreHigher(con, guid, score, function(isHigher){
                if(isHigher) {
                    con.query('UPDATE maho_game.players SET topScore = ? WHERE guid = ?', [score, guid], function(err, result) {
                        if(err) throw err;
                        console.log('Update score complete. guid: ' + guid);
                        res.send('Update score complete. guid: ' + guid);
                    });
                } else {
                    res.send('Update topScore fail. Score ' + score + ' is smaller than top score');
                }
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
        var inputPasswd = '';
        var saltedPasswd = '';
        if (req.body.password) {
            inputPasswd = req.body.password;
        } else {
            // default password
            inputPasswd = 'password'
            // Error
            // res.send('password is required');
            // return
        }
        // check if guid has already been registered in DB
        dbManager.isNewGuid(con, guid,
            function(con, guid) {
                // new player
                console.log('new guid: ' + guid);
                //  log time
                passEncrypt.encryptPassword(inputPasswd, function(err, hash) {
                    if(err) throw err;
                    saltedPasswd = hash;
                    var player = {
                        name: 'undefined',
                        guid: guid,
                        score: 0,
                        password: saltedPasswd
                    }
                    con.query('INSERT INTO maho_log.character_login SET ?', loginTimeStamp, function (err, res) {
                        if (err) throw err;
                        console.log('Last insert ID:', res.insertId);
                    });
                    con.query('INSERT INTO maho_game.players SET ?', player, function (err, result) {
                        if (err) throw err;
                    });
                    res.send('score: ' + player.score);
                });
            }, function(con, guid) {
                // old player
                console.log('old player: ' + guid);
                // check password
                dbManager.isPasswordCorrectSalt(con, guid, inputPasswd, function(result, rows){
                    if(typeof result == 'string') {
                        console.log(result);
                        res.send(result);
                    } else if(typeof result == 'boolean') {
                        console.log('isPasswordMatch: ' + result);
                        if(result == true) {
                            res.send('score: ' + rows[0].score);
                        } else {
                            res.send('wrong password');
                        }
                    }
                });
            }
        );
    });

    app.get('/stop', function(req, res) {
        var msg = 'closing mysql connections';
        con.end();
        console.log(msg)
        res.send(msg);
    });
}