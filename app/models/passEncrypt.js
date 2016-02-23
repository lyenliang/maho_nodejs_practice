'use strict';

var bcrypt = require('bcrypt');

exports.encryptPassword = function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err)
            return callback(err);
        console.log('salt: ' + salt);
        bcrypt.hash(password, salt, function(err, hash) {
            console.log('hash: ' + hash);
            return callback(err, hash);
        });
    });
};

exports.comparePassword = function(inputPasswd, saltedPasswd, callback) {
    console.log('inputPasswd: ' + inputPasswd);
    console.log('saltedPasswd: ' + saltedPasswd);
    bcrypt.compare(inputPasswd, saltedPasswd, function(err, isPasswordMatch) {
        if (err)
            return callback(err);
        return callback(null, isPasswordMatch);
    });
};