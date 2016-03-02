'use strict';

var fs = require('fs'),
    mysql = require('mysql'),
    initConfig = {
        host: "localhost",
        user: "root",
        password: "xpec@1923",
        multipleStatements: true
    },
    sqlGame = 'use maho_game;',
    sqlLog = 'use maho_log;',
    sqlGameFile = __dirname + './../db/maho_game.sql',
    sqlLogFile = __dirname + './../db/maho_log.sql',
    initCon;

var gameDBConfig = {
    host: 'localhost',
    user: 'root',
    password: 'xpec@1923'
};
var useGameSql = 'use maho_game';
var useLogSql = 'use maho_log';
var gameSqlFile = __dirname + './../db/maho_game.sql';
var logsqlFile = __dirname + './../db/maho_log.sql';
var encrypt = require('./passEncrypt.js');

function initLogDB() {
    initCon.query(sqlLog, function (err, results) {
        if(err) throw err;
        fs.readFile(sqlLogFile, 'utf8', function (err, data) {
            if (err) throw err;
            initCon.query(data, function(err, results){
                initCon.end();
            });
        });
    });
}

exports.initDB = function() {
    console.log('Initializing Database...');
    var doneTable = [false, false];
    initCon = mysql.createConnection(initConfig);
    initCon.connect();
    // initalize maho_game database
    initCon.query(sqlGame, function (err, results) {
        if(err) throw err;
        fs.readFile(sqlGameFile, 'utf8', function (err, data) {
            if (err) throw err;
            initCon.query(data, function(err, results){
                initLogDB();
            });
        });
    });
}

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
};

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
};

exports.isScoreHigher = function(con, guid, curScore, callback) {
    con.query('SELECT topScore from maho_game.players WHERE guid = ?', [guid], function(err, rows){
        if(err) throw err;
        if(curScore > rows[0].topScore ) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

var isPwdMatch = function(rows, callback) {
    return function(err, isPasswordMatch) {
        if(err) throw err;
        console.log('isPasswordMatch: ' + isPasswordMatch);
        callback(isPasswordMatch, rows);
    }
};