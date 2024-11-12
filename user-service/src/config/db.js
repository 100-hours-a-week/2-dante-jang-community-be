const mysql = require("mysql2/promise");
require('dotenv').config();
const { MARIA_DB_HOST, MARIA_DB_USER, MARIA_DB_PASSWORD, MARIA_DB_DATABASE } = process.env;

const pool = mysql.createPool({
    host: MARIA_DB_HOST,
    user: MARIA_DB_USER,
    password: MARIA_DB_PASSWORD, 
    database: MARIA_DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;