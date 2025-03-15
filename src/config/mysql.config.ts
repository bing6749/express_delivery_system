import mysql from 'mysql'

// const mysql = require('mysql');

const db = mysql.createConnection({
  host: '121.41.46.15',
  user: 'root',
  password: 'bing6749',
  database: 'school_post',
  port: 3306,
})

export { db }
