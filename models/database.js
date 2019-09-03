const dbConnect = require('./db_connect')
const mysql = require('mysql2')

const pool = mysql.createPool(dbConnect())

module.exports = pool.promise()