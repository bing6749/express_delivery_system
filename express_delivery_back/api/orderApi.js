const models = require('../db/db')
const express = require('express')

const router = express.Router()
const mysql = require('mysql')
const dayjs = require('dayjs')
const $sql = require('../db/sqlMap')

const conn = mysql.createConnection(models.mysql)
conn.connect()

// 查找订单
router.post('/findOrder', (req, res) => {
  const params = req.body
  console.log(params.count)
  let sel_sql = $sql.order.select
  const count = params.count
  switch (count) {
    case 'All':
      sel_sql += ' where 1=1 '
      break
    case 'Daily':
      sel_sql += ' where date(create_time) = date(now()) '
      break
    case 'Weekly':
      sel_sql += ' where date(create_time) >= date(now()) - interval 7 day '
      break
    case 'Monthly':
      sel_sql += ' where date(create_time) >= date(now()) - interval 1 month '
      break
    case 'Quarterly':
      sel_sql += ' where date(create_time) >= date(now()) - interval 3 month '
      break
    case 'Yearly':
      sel_sql += ' where date(create_time) >= date(now()) - interval 1 year '
      break
  }
  console.log(params.count)
  conn.query(sel_sql, (err, results) => {
    if (err) {
      console.log(err)
      res.send(results)
    }
    else {
      res.send(results)
    }
  })
})
// 查找订单
router.post('/addOrder', (req, res) => {
  const params = req.body
  const sel_sql = $sql.order.add
  console.log(params)
  conn.query(sel_sql, [params.order_num, params.send_name, params.send_address, params.send_phone, params.send_company, params.consignee, params.consignee_phone, params.consignee_address, params.weight, params.price, dayjs().format('YYYY-MM-DD HH:mm:ss')], (err, results) => {
    if (err) {
      console.log(err)
      res.send(results)
    }
    else {
      res.send(results)
    }
  })
})

// 添加送货上门订单
router.post('/addDeliveryOrder', (req, res) => {
  const { package_id, user_phone, delivery_address } = req.body

  if (!package_id || !user_phone || !delivery_address) {
    return res.status(400).json({
      code: 400,
      message: '缺少必要参数',
    })
  }

  const add_sql = $sql.order.addDeliveryOrder
  conn.query(add_sql, [package_id, user_phone, delivery_address], (err, result) => {
    if (err) {
      console.error('添加送货订单错误:', err)
      return res.status(500).json({
        code: 500,
        message: '添加送货订单失败',
      })
    }

    res.json({
      code: 200,
      message: '添加送货订单成功',
      data: {
        order_id: result.insertId,
      },
    })
  })
})

// 查询配送订单
router.post('/findDeliveryOrders', async (req, res) => {
  const { timeRange } = req.body
  let timeCondition = ''

  switch (timeRange) {
    case 'Daily':
      timeCondition = 'AND DATE(create_time) = CURDATE()'
      break
    case 'Weekly':
      timeCondition = 'AND create_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)'
      break
    case 'Monthly':
      timeCondition = 'AND create_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)'
      break
    case 'Quarterly':
      timeCondition = 'AND create_time >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)'
      break
    case 'Yearly':
      timeCondition = 'AND create_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)'
      break
    default:
      timeCondition = ''
  }

  const sql = `
    SELECT d.*, p.package_code 
    FROM delivery_order d
    LEFT JOIN package p ON d.package_id = p.package_id
    WHERE 1=1 ${timeCondition}
    ORDER BY create_time DESC
  `

  try {
    conn.query(sql, (err, results) => {
      if (err) {
        console.error('查询配送订单错误:', err)
        return res.status(500).json({
          code: 500,
          message: '查询失败',
        })
      }

      res.json({
        code: 200,
        data: results,
      })
    })
  }
  catch (error) {
    console.error('查询配送订单失败:', error)
    res.status(500).json({
      code: 500,
      message: '查询失败',
    })
  }
})

module.exports = router
