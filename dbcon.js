var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_musungub',
  password        : '1630',
  database        : 'cs340_musungub'
});

/*
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'bmusungu',
    password        : 'Bryan123!',
    database        : 'CatfishDatabase',
    multipleStatements: true
  });
  */


module.exports.pool = pool;
