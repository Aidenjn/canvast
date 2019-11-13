var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_nelsonai',
  password        : '7582',
  database        : 'cs340_nelsonai'
});
module.exports.pool = pool;
