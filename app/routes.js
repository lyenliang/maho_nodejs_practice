var dbManager = require('./models/dbManager.js');

module.exports = function(app, passport, con) {

    app.get('/', function(req, res) {
        res.send('<h1>Hello world</h1>');
    });

    app.post('/update_score', function(req, res){
        var guid = req.body.guid;
        var score = req.body.score;

    });

    app.post('/login', function(req, res) {
        var eventTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var loginTimeStamp = {
            guid: req.body.guid,
            eventTime: eventTime
        };

        var guid = req.body.guid;
        var passwd = 'password';
        var player = {
            name: 'undefined',
            guid: guid,
            score: 0
        }
        // check if guid has already been registered in DB
        dbManager.isNewGuid(res, con, guid,
            function(res, con, guid) {
            // new player
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
        }, function(res, con, guid) {
            // old player
            console.log('old player: ' + guid);
            con.query('SELECT score from maho_game.players WHERE guid = ?', guid, function (err, rows) {
                if (err) throw err;
                res.send('score: ' + rows[0].score);
            });
        });
    });

    app.get('/stop', function(req, res) {
        var msg = 'closing mysql connections';
        con.end();
        console.log(msg)
        res.send(msg);
    });
}