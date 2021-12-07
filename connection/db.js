const mysql = require('mysql2')

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Rightnow3173A',
    database: 'todo',
    connectionLimit: 6
})

module.exports = connectionPool