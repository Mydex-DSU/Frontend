const mysql = require('mysql2/promise');

const DB = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'Heo',
    password: '1234',
    database: 'Mydex',
});

module.exports = DB;