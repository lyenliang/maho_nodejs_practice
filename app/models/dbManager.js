'use strict';

var encrypt = require('./passEncrypt.js');

exports.isNewGuid = function(con, guid, newPlayerCallback, oldPlayerCallback) {
    con.query('SELECT * FROM maho_game.players WHERE guid= ? ', [guid], function(err, rows) {
        if (err) throw err;
        // this guid hasn't been registered
        if (rows.length == 0) {
            newPlayerCallback(con, guid);
        } else {
            oldPlayerCallback(con, guid);
        }
    });
};

exports.isPasswordCorrect = function(con, guid, passwd, correctCallback, errorCallback) {
    con.query('SELECT password from maho_game.players WHERE guid = ? and password = ? ', [guid, passwd], function(err, rows) {
        if (err) throw err;
        if (rows.length == 1) {
            correctCallback(rows);
        } else if (rows.length == 0) {
            errorCallback('Error: wrong password');
        } else if (rows.length > 1) {
            errorCallback('Error: duplicate guid');
        }
    });
}

exports.isPasswordCorrectSalt = function(con, guid, inputPasswd, callback) {
    con.query('SELECT * from maho_game.players WHERE guid = ?', guid, function(err, rows) {
        if (err) throw err;
        if (rows.length == 1) {
            encrypt.comparePassword(inputPasswd, rows[0].password, isPwdMatch(rows, callback));
        } else if (rows.length == 0) {
            callback('Error: guid does not exist');
        } else if (rows.length > 1) {
            callback('Error: duplicate guid');
        }
    });
}

exports.isScoreHigher = function(con, guid, curScore, callback) {
    con.query('SELECT topScore from maho_game.players WHERE guid = ?', [guid], function(err, rows){
        if(err) throw err;
        if(curScore > rows[0].topScore ) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

var isPwdMatch = function(rows, callback) {
    return function(err, isPasswordMatch) {
        if(err) throw err;
        console.log('isPasswordMatch: ' + isPasswordMatch);
        callback(isPasswordMatch, rows);
    }
}