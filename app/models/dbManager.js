exports.checkExistence = function(res, con, guid) {
    return function(err, rows) {
        if (err) throw err;
        // this guid hasn't been registered
        if (rows.length == 0) {
            console.log('new guid: ' + guid);
            //  log time
            con.query('INSERT INTO maho_log.character_login SET ?', loginTimeStamp, function (err, res) {
                if (err) throw err;
                console.log('Last insert ID:', res.insertId);
            });
            con.query('INSERT INTO maho_game.players SET ?', player, function (err, result) {
                if (err) throw err;
            });
            res.send('score: ' + player.score);
        } else {
            console.log('old player: ' + guid);
            con.query('SELECT score from maho_game.players WHERE guid = ?', guid, function (err, rows) {
                if (err) throw err;
                res.send('score: ' + rows[0].score);
            });
        }
    }
};