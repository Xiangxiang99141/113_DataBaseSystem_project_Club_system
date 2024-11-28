const mysql = require('mysql2');
const mysqlconfig = require('../config/config.json').mysql;
const host = mysqlconfig.host;
const user = mysqlconfig.user;
const passwd = mysqlconfig.pssswd;
const db = mysqlconfig.database;

var pool = mysql.createPool({
    host:host,
    user:user,
    password:passwd,
    database:db
});

module.exports = pool.promise();


