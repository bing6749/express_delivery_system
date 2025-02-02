const axios = require('axios')

// 测试配置
const API_URL = 'http://localhost:3066/api/admin/login'
const TEST_ADMIN = {
  username: 'admin4', // 替换为实际的管理员用户名
  password: '123456', // 替换为实际的管理员密码
}

// 测试管理员登录
async function testAdminLogin() {
  console.log('开始测试管理员登录...')

  try {
    // 测试正确的用户名和密码
    const response = await axios.post(API_URL, TEST_ADMIN)
    console.log('\n1. 测试正确的用户名和密码:')
    console.log('状态码:', response.status)
    console.log('响应数据:', response.data)

    if (response.data.code === 200 && response.data.data.token)
      console.log('✅ 登录成功，获取到 token')

    else
      console.log('❌ 登录失败')

    // 测试错误的密码
    const wrongPasswordResponse = await axios.post(API_URL, {
      ...TEST_ADMIN,
      password: 'wrong_password',
    }).catch(err => err.response)

    console.log('\n2. 测试错误的密码:')
    console.log('状态码:', wrongPasswordResponse.status)
    console.log('响应数据:', wrongPasswordResponse.data)

    // 测试错误的用户名
    const wrongUsernameResponse = await axios.post(API_URL, {
      username: 'wrong_username',
      password: TEST_ADMIN.password,
    }).catch(err => err.response)

    console.log('\n3. 测试错误的用户名:')
    console.log('状态码:', wrongUsernameResponse.status)
    console.log('响应数据:', wrongUsernameResponse.data)
  }
  catch (error) {
    console.error('测试过程出错:', error.message)
  }
}

// 运行测试
testAdminLogin()
