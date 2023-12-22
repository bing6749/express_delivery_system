const models = require('../db/db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../db/sqlMap');
const dayjs = require("dayjs");


const conn = mysql.createConnection(models.mysql);
conn.connect();


// 注册接口
router.post('/getPackageByUserPhone', (req, res) => {
	const params = req.body;
	const sel_sql = $sql.package.select + " where consignee_phone = '" + params.user_phone + "'";

	conn.query(sel_sql,(err,results)=>{
		if (err){
			console.log(err)
			res.send(results)
		}
		else{
			// console.log(results)
			res.send(results)
		}
	})
});
//手机号模糊查找包裹
router.post('/findPackageByPhone', (req, res) => {
	const params = req.body;
	const sel_sql = $sql.package.select + " where status = 0 and consignee_phone like '%" + params.user_phone + "%'";

	conn.query(sel_sql,(err,results)=>{
		if (err){
			console.log(err)
			res.send(results)
		}
		else{
			console.log(results)
			res.send(results)
		}
	})
});
//根据package_id签收包裹signPackageById
router.post('/signPackageById', (req, res) => {
	const params = req.body;
	const sel_sql = $sql.package.sign + " where package_id = '" + params.package_id + "'";

	conn.query(sel_sql,(err,results)=>{
		if (err){
			console.log(err)
			res.send(results)
		}
		else{
			console.log(results)
			res.send(results)
		}
	})
});//增加package
router.post('/addPackage', (req, res) => {
	const params = req.body;
	const sel_sql = $sql.package.add;

	conn.query(sel_sql,[params.package_code,params.package_address,params.consignee,params.consignee_phone,'浙江万里学院钱湖校区',0,dayjs().format('YYYY-MM-DD HH:mm:ss')],(err,results)=>{
		if (err){
			console.log(err)
			res.send(results)
		}
		else{
			console.log(results)
			res.send(results)
		}
	})
});
module.exports = router;