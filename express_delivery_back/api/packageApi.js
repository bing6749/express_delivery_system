const express = require('express')
const mysql = require('mysql')
const models = require('../db/db')
const $sql = require('../db/sqlMap')

const router = express.Router()

const conn = mysql.createConnection(models.mysql)
conn.connect()

// 根据手机号查找包裹
router.post('/getPackageByUserPhone', (req, res) => {
  const params = req.body
  const sel_sql = `${$sql.package.select} where status = 0 and consignee_phone = ?`

  conn.query(sel_sql, [params.user_phone], (err, results) => {
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
  const sel_sql = `${$sql.package.select} where status = 0 and consignee_phone like ?`

  conn.query(sel_sql, [`%${params.user_phone}%`], (err, results) => {
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
  if (!params.package_id) {
    return res.status(400).json({
      code: 400,
      message: '包裹ID不能为空',
    })
  }

  const update_sql = `${$sql.package.sign} and package_id = ?`

  conn.query(update_sql, [params.package_id], (err, result) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        message: err.message,
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        message: '包裹不存在或已签收',
      })
    }

    res.json({
      code: 200,
      message: '签收成功',
      data: result,
    })
  })
})
// 增加package
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
