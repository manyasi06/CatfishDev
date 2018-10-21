var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_musungub',
  password        : '1630',
  database        : 'cs340_musungub'
});

module.exports.pool = pool;
