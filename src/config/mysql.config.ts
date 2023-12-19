import mysql from 'mysql'

// const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'school_post',
  port: 3306,
})

export { db }
