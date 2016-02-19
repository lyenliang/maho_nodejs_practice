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