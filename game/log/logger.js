/**
 * Created by yen_lee on 2016/3/21.
 */
exports.logDB = function(con, data, table, callback) {
    var eventTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    data.eventTime = eventTime;
    con.query('INSERT INTO maho_log.' + table + ' SET ?', data, function (err, res) {
        if (err) throw err;
        callback();
    });
}