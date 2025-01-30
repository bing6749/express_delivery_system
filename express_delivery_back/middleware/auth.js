const process = require('node:process')
const jwt = require('jsonwebtoken')
require('dotenv').config()

/**
 * JWT 认证中间件
 */
function authMiddleware(req, res, next) {
  // 获取 token
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未提供认证令牌',
    })
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  }
  catch (err) {
    return res.status(401).json({
      code: 401,
      message: '无效的认证令牌',
    })
  }
}

module.exports = authMiddleware
