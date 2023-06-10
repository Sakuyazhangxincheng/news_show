// db.js

const mysql = require('mysql');

// 创建数据库连接
function createConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'news'
  });
}

// 封装数据库查询函数
function queryDatabase(sql, callback) {
  const conn = createConnection();

  conn.connect();

  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(null, result);
    }

    conn.end();
  });
}

module.exports = {
  queryDatabase
};
