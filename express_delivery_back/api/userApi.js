const express = require('express')
const mysql = require('mysql')
const dayjs = require('dayjs')
const models = require('../db/db')
const $sql = require('../db/sqlMap')
// import Result from '../result/result';
// const Result = require('../result/result')

const router = express.Router()

const conn = mysql.createConnection(models.mysql)
conn.connect()

// 登录接口
router.post('/login', (req, res) => {
  const user = req.body
  const sel_email = `${$sql.user.select} where email = '${user.email}'`
  conn.query(sel_email, user.email, (error, results) => {
    if (error)
      return res.status(500).json({ error: error.message })

    if (results[0] === undefined) {
      res.send('-1') // -1 表示查询不到，用户不存在，即邮箱填写错误
    }
    else {
      if (results[0].email === user.email && results[0].password === user.password)
        res.send('0') // 0 表示用户存在并且邮箱密码正确
      else
        res.send('1') // 1 表示用户存在，但密码不正确
    }
  })
})
// 登录
router.get('/getUser', (req, res) => {
  conn.query($sql.user.select, (err, results) => {
    if (err)
      return res.status(500).json({ error: err.message })

    res.send(results)
  })
})
// 根据手机号查找用户
router.post('/getUserByPhoneNumber', (req, res) => {
  const user = req.body
  conn.query(`${$sql.user.select} where user_phone = '${user.user_phone}'`, (err, results) => {
    if (err)
      return res.status(500).json({ error: err.message })

    res.send(results)
  })
})
// 注册接口
router.post('/add', (req, res) => {
  const params = req.body
  const sel_sql = `${$sql.user.select} where username = '${params.username}'`
  const add_sql = $sql.user.add

  conn.query(sel_sql, params.username, (error, results) => {
    if (error)
      return res.status(500).json({ error: error.message })

    if (results.length !== 0 && params.username === results[0].username) {
      res.send('-1') // -1 表示用户名已经存在
    }
    else {
      conn.query(add_sql, [params.username, params.email, params.password], (err, _rst) => {
        if (err) {
          return res.status(500).json({
            code: 500,
            message: err.message,
          })
        }
        res.send('0') // 0 表示用户创建成功
      })
    }
  })
})

// 检查并添加用户
router.post('/checkAndAddUser', async (req, res) => {
  const { user_phone } = req.body

  try {
    // 先检查用户是否存在
    const checkSql = $sql.user.selectUserIdByUserPhone
    conn.query(checkSql, [user_phone], (err, results) => {
      if (err) {
        console.error('查询用户错误:', err)
        return res.status(500).json({
          code: 500,
          message: '数据库查询错误',
        })
      }

      if (results.length > 0) {
        // 用户已存在，返回用户ID
        return res.json({
          code: 200,
          message: '用户已存在',
          data: {
            user_id: results[0].user_id,
          },
        })
      }

      // 用户不存在，添加新用户
      const addSql = $sql.user.addUserByPhone
      const currentTime = dayjs().format('YYYY-MM-DD')
      conn.query(addSql, [user_phone, currentTime], (err, result) => {
        if (err) {
          console.error('添加用户错误:', err)
          // 如果是主键冲突，说明用户已存在
          if (err.code === 'ER_DUP_ENTRY') {
            return res.json({
              code: 200,
              message: '用户已存在',
              data: {
                user_id: result.insertId,
              },
            })
          }
          return res.status(500).json({
            code: 500,
            message: '添加用户失败',
          })
        }

        res.json({
          code: 200,
          message: '用户添加成功',
          data: {
            user_id: result.insertId,
          },
        })
      })
    })
  }
  catch (error) {
    console.error('服务器错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
    })
  }
})

// 发送验证码
router.post('/sendVerifyCode', (req, res) => {
  const { phone } = req.body

  // TODO: 实际项目中应该对接短信服务商
  // 这里模拟发送验证码，固定返回123456
  res.json({
    code: 200,
    message: '验证码发送成功',
    data: {
      code: '123456',
    },
  })
})

// 手机号登录
router.post('/loginByPhone', (req, res) => {
  const { phone, code } = req.body

  // TODO: 实际项目中应该验证验证码是否正确
  // 这里简单判断验证码是否为123456
  if (code !== '123456') {
    return res.json({
      code: 400,
      message: '验证码错误',
    })
  }

  // 查询或创建用户
  const checkSql = $sql.user.selectUserIdByUserPhone
  conn.query(checkSql, [phone], (err, results) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        message: err.message,
      })
    }

    if (results.length > 0) {
      // 用户存在，直接登录
      return res.json({
        code: 200,
        message: '登录成功',
        data: {
          user_id: results[0].user_id,
          phone,
        },
      })
    }

    // 用户不存在，创建新用户
    const addSql = $sql.user.addUserByPhone
    const currentTime = dayjs().format('YYYY-MM-DD')
    conn.query(addSql, [phone, currentTime], (err, result) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          message: err.message,
        })
      }

      res.json({
        code: 200,
        message: '登录成功',
        data: {
          user_id: result.insertId,
          phone,
        },
      })
    })
  })
})

module.exports = router
