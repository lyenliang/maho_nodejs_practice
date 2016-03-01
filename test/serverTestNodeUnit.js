// use nodeunit
'use strict';

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
    var expected = "{\"msgID\":200000,\"msgContent\":\"score: 556\"}";
    var data = {
        msgID : 100000,
        guid: guid
    }
    postData('/', data, "application/json;charset=UTF-8", function(response) {
        test.equal(response, expected, "Test old user login");
        test.done();
    });
}


exports.testUpdateScoreError = function(test) {
    var guid = 'serverUnitTestUpdateScoreError';
    var expected = "{\"msgID\":210003,\"msgContent\":\"Error updating score with guid: serverUnitTestUpdateScoreError\"}";
    var data = {
        msgID: 100002,
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
    var expected = "{\"msgID\":210000,\"msgContent\":\"wrong Password\"}";
    var data = {
        msgID: 100000,
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
    var expected = "{\"msgID\":210003,\"msgContent\":\"Update topScore fail. Score 123 is smaller than top score\"}";
    var data = {
        msgID: 100002,
        guid : guid,
        score : 123
    };
    postData('/', data, 'application/json;charset=UTF-8', function(response) {
        test.equal(response, expected, 'Test update score');
        test.done();
    });
}
