const express = require('express')
const mysql = require('mysql')
const dayjs = require('dayjs')
const models = require('../db/db')
const $sql = require('../db/sqlMap')

const router = express.Router()
const conn = mysql.createConnection(models.mysql)
conn.connect()

// 获取留言列表
router.get('/list', (req, res) => {
  conn.query($sql.messageBoard.list, (err, results) => {
    if (err) {
      console.error('获取留言列表错误:', err)
      return res.status(500).json({
        code: 500,
        message: '获取留言列表失败',
      })
    }
    res.json({
      code: 200,
      data: results,
    })
  })
})

// 添加留言
router.post('/add', (req, res) => {
  const { user_phone, content } = req.body

  if (!user_phone || !content) {
    return res.status(400).json({
      code: 400,
      message: '缺少必要参数',
    })
  }

  conn.query($sql.messageBoard.add, [user_phone, content], (err, result) => {
    if (err) {
      console.error('添加留言错误:', err)
      return res.status(500).json({
        code: 500,
        message: '添加留言失败',
      })
    }
    res.json({
      code: 200,
      message: '添加留言成功',
      data: { message_id: result.insertId },
    })
  })
})

// 回复留言
router.post('/reply', (req, res) => {
  const { message_id, reply } = req.body

  if (!message_id || !reply) {
    return res.status(400).json({
      code: 400,
      message: '缺少必要参数',
    })
  }

  conn.query($sql.messageBoard.reply, [reply, message_id], (err) => {
    if (err) {
      console.error('回复留言错误:', err)
      return res.status(500).json({
        code: 500,
        message: '回复留言失败',
      })
    }
    res.json({
      code: 200,
      message: '回复留言成功',
    })
  })
})

// 删除留言
router.post('/delete', (req, res) => {
  const { message_id } = req.body

  if (!message_id) {
    return res.status(400).json({
      code: 400,
      message: '缺少必要参数',
    })
  }

  conn.query($sql.messageBoard.delete, [message_id], (err) => {
    if (err) {
      console.error('删除留言错误:', err)
      return res.status(500).json({
        code: 500,
        message: '删除留言失败',
      })
    }
    res.json({
      code: 200,
      message: '删除留言成功',
    })
  })
})

// 获取用户的留言列表
router.post('/listByUser', (req, res) => {
  const { user_phone } = req.body

  if (!user_phone) {
    return res.status(400).json({
      code: 400,
      message: '缺少必要参数',
    })
  }

  const sql = 'SELECT * FROM message_board WHERE user_phone = ? ORDER BY create_time DESC'

  conn.query(sql, [user_phone], (err, results) => {
    if (err) {
      console.error('获取用户留言列表错误:', err)
      return res.status(500).json({
        code: 500,
        message: '获取留言列表失败',
      })
    }
    res.json({
      code: 200,
      data: results,
    })
  })
})

module.exports = router
