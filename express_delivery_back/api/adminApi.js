const models = require('../db/db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../db/sqlMap');
const dayjs = require('dayjs');


const conn = mysql.createConnection(models.mysql);
conn.connect();




// 登录接口
router.post('/login',(req,res)=>{
	const admin = req.body;
	const sel_email = $sql.admin.select + " where admin_name = '" + admin.username + "' and password = '"+ admin.password + "'";
	conn.query(sel_email, (error, results)=>{
		if (results[0] === undefined) {
			res.send("-1");  // -1 表示查询不到，用户不存在，即邮箱填写错误
		} else{
			if (results[0].password == admin.password) {
				res.send("0");  // 0 表示用户存在并且密码正确
			}
		}
	})
});

module.exports = router;