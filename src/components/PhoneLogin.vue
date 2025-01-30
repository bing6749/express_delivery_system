<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import API from '~/api/requests'

const router = useRouter()
const user = useUserStore()
const name = ref(user.savedName)

const phoneNumber = ref('')
const verifyCode = ref('')
const agreed = ref(false)
const loading = ref(false)

// 发送验证码
async function sendCode() {
  if (!phoneNumber.value) {
    message.error('请输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
    message.error('请输入正确的手机号')
    return
  }

  try {
    loading.value = true
    await API({
      url: '/user/sendVerifyCode',
      method: 'post',
      data: {
        phone: phoneNumber.value,
      },
    })
    message.success('验证码已发送')
  }
  catch (error) {
    message.error('验证码发送失败')
  }
  finally {
    loading.value = false
  }
}

// 登录
async function handleLogin() {
  if (!phoneNumber.value || !verifyCode.value) {
    message.error('请输入手机号和验证码')
    return
  }
  if (!agreed.value) {
    message.error('请阅读并同意用户协议和隐私政策')
    return
  }

  try {
    loading.value = true
    const res = await API({
      url: '/user/loginByPhone',
      method: 'post',
      data: {
        phone: phoneNumber.value,
        code: verifyCode.value,
      },
    })
    if (res.data.code === 200) {
      message.success('登录成功')
      // 跳转到首页
      router.push(`/hi/${encodeURIComponent(phoneNumber.value)}`)
    }
    else {
      message.error(res.data.message || '登录失败')
    }
  }
  catch (error) {
    message.error('登录失败')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <h2 class="title">
        手机号登录
      </h2>
      <div class="input-group">
        <div class="phone-input">
          <span class="prefix">+86</span>
          <a-input
            v-model:value="phoneNumber"
            placeholder="请输入手机号"
            :max-length="11"
          />
        </div>
        <div class="verify-input">
          <a-input
            v-model:value="verifyCode"
            placeholder="请输入验证码"
            :max-length="6"
          />
          <a-button
            :disabled="loading"
            @click="sendCode"
          >
            发送验证码
          </a-button>
        </div>
      </div>
      <div class="agreement">
        <a-checkbox v-model:checked="agreed">
          我已阅读并同意
          <a href="#" target="_blank">用户协议</a>
          与
          <a href="#" target="_blank">隐私政策</a>
          ，未注册的手机号将自动注册
        </a-checkbox>
      </div>
      <a-button
        type="primary"
        block
        :loading="loading"
        :disabled="!agreed"
        @click="handleLogin"
      >
        登录
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: #ffffff;
}

.login-form {
  width: 80%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
}

.phone-input {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.prefix {
  padding: 0 12px;
  color: #666;
  background: #fafafa;
  border-right: 1px solid #d9d9d9;
  height: 32px;
  line-height: 32px;
}

.phone-input :deep(.ant-input) {
  border: none;
}

.verify-input {
  display: flex;
  gap: 8px;
}

.agreement {
  margin-bottom: 24px;
}

.agreement a {
  color: #1890ff;
}
</style>
