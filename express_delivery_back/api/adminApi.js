const models = require('../db/db')
const express = require('express')

const router = express.Router()
const mysql = require('mysql')
const dayjs = require('dayjs')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const $sql = require('../db/sqlMap')
require('dotenv').config()

const conn = mysql.createConnection(models.mysql)
conn.connect()

/**
 * 生成 JWT token
 * @param {object} admin 管理员信息
 * @returns {string} token
 */
function generateToken(admin) {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables')
    throw new Error('JWT configuration error')
  }
  return jwt.sign(
    { id: admin.admin_id, username: admin.admin_name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
  )
}

// 登录接口
router.post('/login', async (req, res) => {
  const admin = req.body
  try {
    // 查询管理员
    const sel_sql = `${$sql.admin.select} where admin_name = ?`
    conn.query(sel_sql, [admin.username], async (error, results) => {
      if (error) {
        console.error('数据库查询错误:', error)
        return res.status(500).json({
          code: 500,
          message: '服务器内部错误，请稍后重试',
        })
      }

      if (!results[0]) {
        return res.status(401).json({
          code: 401,
          message: '该用户不存在，请先注册',
        })
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(
        admin.password,
        results[0].password,
      )

      if (!isValidPassword) {
        return res.status(401).json({
          code: 401,
          message: '密码错误，请重新输入',
        })
      }

      try {
        // 生成 token
        const token = generateToken(results[0])

        res.json({
          code: 200,
          message: '登录成功',
          data: {
            token,
            admin: {
              username: results[0].admin_name,
            },
          },
        })
      }
      catch (tokenError) {
        console.error('Token 生成错误:', tokenError)
        return res.status(500).json({
          code: 500,
          message: '登录验证失败，请重新登录',
        })
      }
    })
  }
  catch (err) {
    console.error('登录过程错误:', err)
    res.status(500).json({
      code: 500,
      message: '系统繁忙，请稍后再试',
    })
  }
})

/**
 * 管理员注册接口
 * 仅供系统内部使用，不对外开放
 */
router.post('/register', async (req, res) => {
  const admin = req.body
  const secretKey = req.headers['x-admin-secret']

  console.log('收到的密钥:', secretKey)
  console.log('环境变量密钥:', process.env.ADMIN_REGISTER_SECRET)

  // 验证特殊密钥
  if (secretKey !== process.env.ADMIN_REGISTER_SECRET) {
    console.log('密钥不匹配')
    return res.status(403).json({
      code: 403,
      message: '无权访问此接口',
    })
  }

  console.log('注册请求数据:', admin)
  try {
    // 1. 检查用户名是否已存在
    const checkSql = `${$sql.admin.select} where admin_name = ?`
    conn.query(checkSql, [admin.username], async (error, results) => {
      if (error) {
        console.error('查询用户错误:', error)
        return res.status(500).json({
          code: 500,
          message: '服务器错误',
        })
      }

      if (results[0]) {
        console.log('用户名已存在:', admin.username)
        return res.status(400).json({
          code: 400,
          message: '用户名已存在',
        })
      }

      // 2. 对密码进行加密
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(admin.password, salt)
      console.log('密码加密完成')

      // 3. 插入新管理员记录
      const insertSql = $sql.admin.register
      console.log('执行SQL:', insertSql)
      conn.query(
        insertSql,
        [
          admin.username,
          hashedPassword,
          dayjs().format('YYYY-MM-DD HH:mm:ss'),
          dayjs().format('YYYY-MM-DD HH:mm:ss'),
        ],
        (err, result) => {
          if (err) {
            console.error('插入用户错误:', err)
            return res.status(500).json({
              code: 500,
              message: '注册失败',
            })
          }

          console.log('注册成功:', result)
          res.json({
            code: 200,
            message: '注册成功',
            data: {
              admin_id: result.insertId,
              username: admin.username,
            },
          })
        },
      )
    })
  }
  catch (err) {
    console.error('注册过程错误:', err)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
    })
  }
})

module.exports = router
