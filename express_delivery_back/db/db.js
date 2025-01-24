const mysql = require('mysql');

const db = {
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'school_post',
        port: '3306'
    }
};

// 测试数据库连接
const conn = mysql.createConnection(db.mysql);
conn.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        process.exit(1); // 如果数据库连接失败，终止程序
    }
    console.log('数据库连接成功!');
});

module.exports = db;
