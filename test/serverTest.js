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
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            callback(chunk);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
}


exports.testLoginOldPlayer = function(test) {
    var data = {
        'guid' : 'serverUnitTestOldPlayer'
    };
    postData('/login', data, function(response){
        test.equal(response, 'score: 0', 'Test login for old user');
        test.done();
    });
}

exports.testUpdateScoreError = function(test) {
    var guid = 'serverUnitTestUpdateScoreError';
    var expected = 'Error updating score with guid: ' + guid;
    var data = {
        'guid' : guid,
        'score' : '123'
    };
    postData('/updateScore', data, function(response) {
        test.equal(response, expected, 'Test update score error');
        test.done();
    });
}

exports.testLoginWrongPassword = function(test) {
    var expected = 'wrong password';
    var data = {
        'guid' : 'serverUnitTestWrongPassword',
        'password' : 'pppa'
    };
    postData('/login', data, function(response){
        test.equal(response, expected, 'Test wrong password');
        test.done();
    });
}
/*
exports.testUpdateScore = function(test) {
    var expected = 'wrong password';
    var data = {
        'guid' : 'serverUnitTestUpdateScore',
        'score' : 123
    };
    postData('/updateScore', function(response) {
        test.equal(response, expected, 'Test update score');
        test.done();
    });
}
*/


/*
exports.testLoginPasswordRequired = function(test) {
    var data = {
        'guid' : 'serverUnitTestPasswordRequired'
    };
    postData('/login', data, function(response){
        test.equal(response, 'password is required', 'Test password required');
        test.done();
    });
}
*/
