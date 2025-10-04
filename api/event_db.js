const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          
    password: 'root',   
    database: 'charityevents_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create a Promise-wrapped pool
const promisePool = pool.promise();

// Test the connection
promisePool.getConnection()
    .then(connection => {
        console.log('Connected to charityevents_db database');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed: ' + err.message);
        console.log('Please check your MySQL credentials in event_db.js');
    });

module.exports = promisePool;