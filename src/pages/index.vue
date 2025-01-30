<script setup lang="ts">
import { message } from 'ant-design-vue'
import API from '../api/requests'

defineOptions({
  name: 'IndexPage',
})
const user = useUserStore()
const name = ref(user.savedName)

const router = useRouter()
const [messageApi, contextHolder] = message.useMessage()

async function isCorrectPhoneNumber(user_phone: string): boolean {
  try {
    const res = await API({
      url: '/user/getUserByPhoneNumber',
      method: 'post',
      data: {
        user_phone,
      },
    })
    return !!res.data[0]
  }
  catch (error) {
    console.error('检查手机号错误:', error)
    return false
  }
}

async function go() {
  const bool = await isCorrectPhoneNumber(name.value)
  if (!bool)
    messageApi.info('请键入你正确的手机号！')
  else
    await router.push(`/hi/${encodeURIComponent(name.value)}`)
}

const { t } = useI18n()

function _isPhoneNumber(phoneNumber: string): boolean {
  const regExp = /^1[3-9]\d{9}$/
  return regExp.test(phoneNumber)
}
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-campsite inline-block />
    </div>
    <p>
      <context-holder />
    </p>
    <p>
      <em text-sm opacity-75>键入你的手机号</em>
    </p>

    <div py-4 />

    <TheInput
      v-model="name"
      :placeholder="t('intro.whats-your-name')"
      autocomplete="false"
      @keydown.enter="go"
    />
    <label class="hidden" for="input">{{ t('intro.whats-your-name') }}</label>

    <div>
      <button
        m-3 text-sm btn
        :disabled="!name"
        @click="go"
      >
        确认
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
