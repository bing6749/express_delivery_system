const models = require('../db/db')
const express = require('express')

const router = express.Router()
const mysql = require('mysql')
const dayjs = require('dayjs')
const $sql = require('../db/sqlMap')

const conn = mysql.createConnection(models.mysql)
conn.connect()

// 注册接口
router.post('/putAdminOrderByAddressAndDate', (req, res) => {
  const { user_phone, submitAddress, submitDate } = req.body
  const sel_sql = `SELECT user_id FROM user WHERE user_phone = ?`

  conn.query(sel_sql, [user_phone], (err, result) => {
    if (err) {
      console.error('查询用户ID错误:', err)
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      })
    }

    if (!result || result.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
      })
    }

    const user_id = result[0].user_id
    // 格式化日期时间
    const formattedDate = dayjs(submitDate).format('YYYY-MM-DD HH:mm:ss')

    const insert_sql = `
			INSERT INTO admin_order 
			(user_id, user_phone, send_address, appointment_time, create_time) 
			VALUES (?, ?, ?, ?, NOW())
		`

    conn.query(
      insert_sql,
      [user_id, user_phone, submitAddress, formattedDate],
      (error, results) => {
        if (error) {
          console.error('添加上门取件订单错误:', error)
          return res.status(500).json({
            code: 500,
            message: '添加订单失败',
          })
        }

        res.json({
          code: 200,
          message: '添加订单成功',
          data: results,
        })
      },
    )
  })
})

// 注册接口
router.get('/getSignPackageInfo', (req, res) => {
  // 查询手机号对应的user_id
  const sel_sql = `${$sql.adminOrder.select} where appointment_time > '${dayjs().format('YYYY-MM-DD HH:mm:ss')}'`
  console.log(sel_sql)
  conn.query(sel_sql, (err, results) => {
    if (err) {
      console.log(results)
      res.send(results)
    }
    else {
      res.send(results)
    }
  })
})
module.exports = router
