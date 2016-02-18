module.exports = function(app, passport, con) {
    app.get('/', function(req, res) {
        res.send('<h1>Hello world</h1>');
    });

    app.post('/login', function(req, res) {
        //  login log
        var eventTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var loginTimeStamp = {guid: req.body.guid, eventTime: eventTime};
        con.query('INSERT INTO character_login SET ?', loginTimeStamp, function(err, res){
            if(err) throw err;
            console.log('Last insert ID:', res.insertId);
        });
        res.send('post /test. guid: ' + req.body.guid);
    });

    app.get('/stop', function(req, res) {
        var msg = 'closing mysql connections';
        con.end();
        console.log(msg)
        res.send(msg);
    });
}