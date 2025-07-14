const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test kết nối
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Lỗi kết nối database:', err);
        return;
    }
    console.log('Kết nối database thành công!');
    connection.release();
});

const promisePool = pool.promise();

module.exports = promisePool; 