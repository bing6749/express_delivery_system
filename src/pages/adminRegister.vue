<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import API from '~/api/requests';

const router = useRouter()
const [messageApi, contextHolder] = message.useMessage();

interface FormState {
  username: string
  password: string
  confirmPassword: string
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  confirmPassword: '',
})

const validatePassword = async (_rule: any, value: string) => {
  if (value === '') {
    return Promise.reject('请输入密码');
  }
  if (value.length < 6) {
    return Promise.reject('密码长度不能小于6位');
  }
  return Promise.resolve();
};

const validateConfirmPassword = async (_rule: any, value: string) => {
  if (value === '') {
    return Promise.reject('请确认密码');
  }
  if (value !== formState.password) {
    return Promise.reject('两次输入的密码不一致');
  }
  return Promise.resolve();
};

const onFinish = async () => {
  try {
    console.log('提交注册表单:', formState);
    const res = await API({
      url: '/admin/register',
      method: 'post',
      data: {
        username: formState.username,
        password: formState.password,
      },
    });

    console.log('注册响应:', res.data);
    if (res.data.code === 200) {
      messageApi.success('注册成功');
      router.push('/adminLogin');
    }
  } catch (err: any) {
    console.error('注册错误:', err);
    messageApi.error(
      err.response?.data?.message || 
      err.message || 
      '注册失败，请稍后重试'
    );
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<template>
  <div i-carbon-user-admin class="text-4xl -mb-6 m-auto" />
  <component :is="contextHolder" />
  <a-form
    :model="formState"
    name="register"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 8 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
    style="margin-top: 100px"
    class="m-auto"
  >
    <a-form-item
      label="用户名"
      name="username"
      :rules="[{ required: true, message: '请输入用户名!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="密码"
      name="password"
      :rules="[{ validator: validatePassword }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item
      label="确认密码"
      name="confirmPassword"
      :rules="[{ validator: validateConfirmPassword }]"
    >
      <a-input-password v-model:value="formState.confirmPassword" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">注册</a-button>
      <a-button style="margin-left: 10px" @click="router.push('/adminLogin')">
        返回登录
      </a-button>
    </a-form-item>
  </a-form>
</template> 