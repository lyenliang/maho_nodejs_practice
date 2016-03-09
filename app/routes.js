'use strict';

var log = require('loglevel')
log.setLevel('info')
var dbManager = require('./models/dbManager.js');
var passEncrypt = require('./models/passEncrypt.js');
var msgTypes = require('./messageTypes.js');
module.exports = function(app, passport, con) {

    app.get('/', function(req, res) {
        res.send('<h1>Hello world</h1>');
    });

    app.post('/', function(req, res) {
        log.info(req.body);
        switch(req.body.msgID) {
            case msgTypes.C_LOGIN_REQUEST:
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
                        log.info('new guid: ' + guid);
                        //  log time
                        passEncrypt.encryptPassword(inputPasswd, function(err, hash) {
                            if(err) throw err;
                            saltedPasswd = hash;
                            var player = {
                                name: 'undefined',
                                guid: guid,
                                topScore: 0,
                                password: saltedPasswd,
                                materialNum: 0
                            }
                            con.query('INSERT INTO maho_log.character_login SET ?', loginTimeStamp, function (err, res) {
                                if (err) throw err;
                                log.info('Last insert ID:', res.insertId);
                            });
                            con.query('INSERT INTO maho_game.players SET ?', player, function (err, result) {
                                if (err) throw err;
                            });
                            res.send({
                                msgID: msgTypes.S_LOGIN_NEW_PLAYER_RESPONSE,
                                msgContent: "score: " + player.topScore
                            });
                        });
                    }, function(con, guid) {
                        // old player
                        log.info('old player: ' + guid);
                        // check password
                        dbManager.isPasswordCorrectSalt(con, guid, inputPasswd, function(result, rows){
                            if(typeof result == 'string') {
                                log.debug(result);
                                res.send(result);
                            } else if(typeof result == 'boolean') {
                                log.debug('isPasswordMatch: ' + result);
                                if(result == true) {
                                    res.send({
                                        msgID: msgTypes.S_LOGIN_OLD_PLAYER_RESPONSE,
                                        msgContent: "score: " + rows[0].topScore}
                                    );
                                } else {
                                    res.send({
                                        msgID: msgTypes.S_LOGIN_ERROR,
                                        msgContent: "wrong Password"}
                                    );
                                }
                            }
                        });
                    }
                );
                break;
            case msgTypes.C_UPDATE_SCORE_REQUEST:
                var guid = req.body.guid;
                var score = req.body.score;
                dbManager.isNewGuid(con, guid, function(con, guid){
                    log.error('Error updating score with guid: ' + guid);
                    res.send({
                        msgID: msgTypes.S_UPDATE_SCORE_ERROR,
                        msgContent: 'Error updating score with guid: ' + guid
                    });
                }, function(con, guid) {
                    dbManager.isScoreHigher(con, guid, score, function(isHigher){
                        if(isHigher) {
                            con.query('UPDATE maho_game.players SET topScore = ? WHERE guid = ?', [score, guid], function(err, result) {
                                if(err) throw err;
                                log.info('Update score complete. guid: ' + guid);
                                res.send({
                                    msgID: msgTypes.S_UPDATE_SCORE_RESPONSE,
                                    msgContent: 'Update score complete.'}
                                );
                            });
                        } else {
                            res.send({
                                msgID: msgTypes.S_UPDATE_SCORE_ERROR,
                                msgContent: 'Update topScore fail. Score ' + score + ' is smaller than top score'
                            });
                        }
                    });
                });
                break;
            default:
                break;
        }
    });

    app.get('/stop', function(req, res) {
        var msg = 'closing mysql connections';
        con.end();
        log.info(msg)
        res.send(msg);
    });
}