const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

const userApi = require('./api/userApi.js')
const packageApi = require('./api/packageApi.js')
const adminOrderApi = require('./api/adminOrderApi.js')
const adminApi = require('./api/adminApi.js')
const orderApi = require('./api/orderApi.js')
const authMiddleware = require('./middleware/auth')

// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// 解析 application/json
app.use(bodyParser.json())

app.use(cors())

// 不需要验证的路由
const publicRoutes = [
  '/api/user/loginByPhone',
  '/api/user/sendVerifyCode',
  '/api/package/getPackageByUserPhone',
  '/api/package/findPackageByPhone',
]

// 验证中间件
app.use((req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    next()
    return
  }
  authMiddleware(req, res, next)
})

// 设置跨域请求
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.use('/api/user', userApi)
app.use('/api/package', packageApi)
app.use('/api/adminOrder', adminOrderApi)
app.use('/api/admin', adminApi)
app.use('/api/order', orderApi)

app.listen(3066)
console.log('success')
