const models = require('../db/db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../db/sqlMap');
const dayjs = require('dayjs');


const conn = mysql.createConnection(models.mysql);
conn.connect();


// 注册接口
router.post('/putAdminOrderByAddressAndDate', (req, res) => {
	const params = req.body;

		//查询手机号对应的user_id
		conn.query($sql.user.selectUserIdByUserPhone + " where user_phone = '" + params.user_phone + "'",(err,results)=>{
			if (err){
				console.log(err)
				res.send(results)
			}
			else{
				const user_id = results[0].user_id
				//新增上门区间记录
				const sel_sql = $sql.adminOrder.add;
				conn.query(sel_sql, [user_id, params.submitAddress, dayjs(params.submitDate).format('YYYY-MM-DD HH:mm:ss')], (err,results)=>{
					if (err){
						console.log(err)
						res.send(results)
					}
					else{
						res.send(results)
					}
				})
			}
		});
});

// 注册接口
router.get('/getSignPackageInfo', (req, res) => {

	//查询手机号对应的user_id
	const sel_sql = $sql.adminOrder.select + " where appointment_time > '" + dayjs().format('YYYY-MM-DD HH:mm:ss') + "'";
	console.log(sel_sql)
	conn.query(sel_sql, (err, results) => {
		if (err) {
			console.log(results)
			res.send(results)
		}
		else{
			res.send(results)
		}
	});
});
module.exports = router;