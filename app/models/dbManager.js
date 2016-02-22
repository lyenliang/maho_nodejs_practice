exports.isNewGuid = function(res, con, guid, newPlayerCallback, oldPlayerCallback) {
    con.query('SELECT guid FROM maho_game.players WHERE guid = ?', guid, function(err, rows) {
        if (err) throw err;
        // this guid hasn't been registered
        if (rows.length == 0) {
            newPlayerCallback(res, con, guid);
        } else {
            oldPlayerCallback(res, con, guid);
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