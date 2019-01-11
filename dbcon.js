var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'bmusungu',
    password        : 'Bryan123!',
    database        : 'CatfishDatabase',
    multipleStatements: true
  });

var userPool = mysql.createPool({
  connectionLimit : 10,
    host            : 'localhost',
    user            : 'bmusungu',
    password        : 'Bryan123!',
    database        : 'UserDB',
    multipleStatements: true
});




module.exports.pool = pool;
module.exports.userPool = userPool;
