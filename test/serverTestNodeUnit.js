// use nodeunit
'use strict';

var C_LOGIN_REQUEST = 100000;

var S_LOGIN_OLD_PLAYER_RESPONSE = 200001;

var S_LOGIN_NEW_PLAYER_RESPONSE = 200002;

var S_LOGIN_ERROR = 200999;


var C_UPDATE_SCORE_REQUEST = 10100;

var S_UPDATE_SCORE_RESPONSE = 201001;

var S_UPDATE_SCORE_ERROR = 201999;


var C_UPDATE_MATERIAL_NUMBER_REQUEST = 102000;

var S_UPDATE_MATERIAL_NUMBER_RESPONSE = 202001;

var S_UPDATE_MATERIAL_NUMBER_ERROR = 202999;

var querystring = require('querystring');
var http = require('http');

function postData(path, data, callback) {
    var post_data = querystring.stringify(data);

    var post_options = {
        host: 'localhost',
        port: '3000',
        path: path,
        method: 'POST',
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        var content = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            content += chunk;
        });
        res.on('end', function() {
            console.log('Response: ' + content);
            callback(content);
        });
    });
    // post the data
    post_req.write(post_data);
    post_req.end();
}

function postData(path, data, contentType, callback) {
    var post_data = JSON.stringify(data);

    var post_options = {
        host: 'localhost',
        port: '3000',
        path: path,
        method: 'POST',
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': contentType
        }
    }

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        var content = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            content += chunk;
        });
        res.on('end', function() {
            console.log('Response: ' + JSON.stringify(content));
            callback(content);
        });
    });
    // post the data
    post_req.write(post_data);
    post_req.end();
}

exports.testLoginOldPlayer = function(test) {
    var guid = "test";
    var expected = "{\"msgID\":" + S_LOGIN_OLD_PLAYER_RESPONSE + ",\"msgContent\":\"score: 556\"}";
    var data = {
        msgID : C_LOGIN_REQUEST,
        guid: guid
    }
    postData('/', data, "application/json;charset=UTF-8", function(response) {
        test.equal(response, expected, "Test old user login");
        test.done();
    });
}


exports.testUpdateScoreError = function(test) {
    var guid = 'serverUnitTestUpdateScoreError';
    var expected = "{\"msgID\":" + S_UPDATE_SCORE_ERROR + ",\"msgContent\":\"Error updating score with guid: serverUnitTestUpdateScoreError\"}";
    var data = {
        msgID: C_UPDATE_SCORE_REQUEST,
        guid : guid,
        score : 123
    };
    postData('/', data, "application/json;charset=UTF-8", function(response) {
        test.equal(response, expected, 'Test update score error');
        test.done();
    });
}


exports.testLoginWrongPassword = function(test) {
    var guid = 'serverUnitTestWrongPassword';
    var expected = "{\"msgID\":"+S_LOGIN_ERROR+",\"msgContent\":\"wrong Password\"}";
    var data = {
        msgID: C_LOGIN_REQUEST,
        guid : guid,
        password : 'pppa'
    };
    postData('/', data, 'application/json;charset=UTF-8', function(response){
        test.equal(response, expected, 'Test wrong password');
        test.done();
    });
}

exports.testUpdateScore = function(test) {
    var guid = 'serverUnitTestUpdateScore';
    var expected = "{\"msgID\":"+S_UPDATE_SCORE_ERROR+",\"msgContent\":\"Update topScore fail. Score 123 is smaller than top score\"}";
    var data = {
        msgID: C_UPDATE_SCORE_REQUEST,
        guid : guid,
        score : 123
    };
    postData('/', data, 'application/json;charset=UTF-8', function(response) {
        test.equal(response, expected, 'Test update score');
        test.done();
    });
}
