const express = require('express')
const mysql = require('mysql')
const models = require('../db/db')
const $sql = require('../db/sqlMap')

const router = express.Router()

const conn = mysql.createConnection(models.mysql)
conn.connect()

// 注册接口
router.post('/getPackageByUserPhone', (req, res) => {
  const params = req.body
  const sel_sql = `${$sql.package.select} where consignee_phone = '${params.user_phone}'`

  conn.query(sel_sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        message: err.message,
      })
    }

    res.send(results)
  })
})
// 手机号模糊查找包裹
router.post('/findPackageByPhone', (req, res) => {
  const params = req.body
  const sel_sql = `${$sql.package.select} where status = 0 and consignee_phone like '%${params.user_phone}%'`

  conn.query(sel_sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        message: err.message,
      })
    }

    res.send(results)
  })
})
// 根据package_id签收包裹signPackageById
router.post('/signPackageById', (req, res) => {
  const params = req.body
  const sel_sql = `${$sql.package.sign} where package_id = '${params.package_id}'`

  conn.query(sel_sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        message: err.message,
      })
    }

    res.send(results)
  })
})// 增加package
router.post('/add', (req, res) => {
  const params = req.body
  const add_sql = $sql.package.add

  conn.query(add_sql, [
    params.package_code,
    params.package_address,
    params.consignee,
    params.consignee_phone,
    params.consignee_address,
    params.status,
    params.create_time,
  ], (err, result) => {
    if (err) {
      console.error('添加包裹错误:', err)
      return res.status(500).json({
        code: 500,
        message: '添加包裹失败',
      })
    }

    res.json({
      code: 200,
      message: '添加包裹成功',
      data: {
        package_id: result.insertId,
      },
    })
  })
})
module.exports = router
