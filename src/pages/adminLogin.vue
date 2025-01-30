<script setup lang="ts">
// const route = useRoute('/adminLogin')
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Modal, message } from 'ant-design-vue'
import API from '~/api/requests'

const router = useRouter()
const [_messageApi, contextHolder] = message.useMessage()

interface FormState {
  username: string
  password: string
  remember: boolean
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
})

const loading = ref(false)

async function onFinish(_values: FormState) {
  try {
    loading.value = true
    // 表单验证
    if (!formState.username || !formState.password) {
      Modal.error({
        title: '输入错误',
        content: '请输入用户名和密码',
      })
      return
    }

    const res = await API({
      url: '/admin/login',
      method: 'post',
      data: {
        username: formState.username,
        password: formState.password,
      },
    })

    if (res.data.code === 200) {
      // 保存 token
      localStorage.setItem('token', res.data.data.token)
      // 保存用户名
      localStorage.setItem('username', res.data.data.admin.username)
      Modal.success({
        title: '登录成功',
        content: '欢迎回来！',
        onOk: () => {
          router.push('/admin')
        },
      })
    }
  }
  catch (err: any) {
    console.error('登录错误:', err)
    // 根据不同的错误类型显示不同的提示
    if (err.response) {
      switch (err.response.status) {
        case 401:
          Modal.error({
            title: '登录失败',
            content: err.response.data.message || '用户名或密码错误',
          })
          break
        case 500:
          Modal.error({
            title: '服务器错误',
            content: err.response.data.message || '服务器错误，请稍后重试',
          })
          break
        default:
          Modal.error({
            title: '登录失败',
            content: '登录失败，请稍后重试',
          })
      }
    }
    else if (err.request) {
      Modal.error({
        title: '网络错误',
        content: '网络连接失败，请检查网络设置',
      })
    }
    else {
      Modal.error({
        title: '登录失败',
        content: '登录失败，请稍后重试',
      })
    }
    // 清空密码输入
    formState.password = ''
  }
  finally {
    loading.value = false
  }
}

function onFinishFailed(_errorInfo: any) {
  Modal.error({
    title: '表单验证失败',
    content: '请检查输入是否符合要求',
  })
}
</script>

<template>
  <div i-carbon-user-admin class="m-auto text-4xl -mb-6" />
  <component :is="contextHolder" />
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 8 }"
    autocomplete="off"
    style="margin-top: 100px"
    class="m-auto"
    @finish="onFinish"
    @finish-failed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[
        { required: true, message: '请输入用户名!' },
        { min: 3, message: '用户名至少3个字符' },
      ]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="Password"
      name="password"
      :rules="[
        { required: true, message: '请输入密码!' },
        { min: 6, message: '密码至少6个字符' },
      ]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 7, span: 10 }">
      <a-checkbox v-model:checked="formState.remember">
        Remember me
      </a-checkbox>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 7, span: 10 }">
      <a-button
        type="primary"
        html-type="submit"
        :loading="loading"
      >
        登录
      </a-button>
    </a-form-item>
  </a-form>
</template>
