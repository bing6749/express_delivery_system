<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import API from '~/api/requests'

interface Message {
  message_id: number
  user_phone: string
  content: string
  create_time: string
  reply?: string
  reply_time?: string
  status: number
}

const dataSource = ref<Message[]>([])
const addVisible = ref(false)
const messageContent = ref('')
const userPhone = localStorage.getItem('phone')

if (!userPhone)
  message.error('未找到用户信息，请重新登录')

// 获取当前用户的留言列表
async function getMyMessages() {
  try {
    const res = await API({
      url: '/messageBoard/listByUser',
      method: 'post',
      data: {
        user_phone: userPhone,
      },
    })
    if (res.data.code === 200)
      dataSource.value = res.data.data
  }
  catch (error) {
    console.error('获取留言列表失败:', error)
    message.error('获取留言列表失败')
  }
}

// 添加留言
async function submitMessage() {
  if (!messageContent.value) {
    message.error('请输入留言内容')
    return
  }

  try {
    const res = await API({
      url: '/messageBoard/add',
      method: 'post',
      data: {
        user_phone: userPhone,
        content: messageContent.value,
      },
    })

    if (res.data.code === 200) {
      message.success('留言成功')
      addVisible.value = false
      messageContent.value = ''
      getMyMessages()
    }
  }
  catch (error) {
    console.error('添加留言失败:', error)
    message.error('添加留言失败')
  }
}

onMounted(() => {
  getMyMessages()
})

const columns = [
  {
    title: '留言内容',
    dataIndex: 'content',
    width: '30%',
  },
  {
    title: '留言时间',
    dataIndex: 'create_time',
    width: '20%',
    customRender: ({ text }: { text: string }) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '回复内容',
    dataIndex: 'reply',
    width: '30%',
    customRender: ({ text }: { text: string }) => text || '暂无回复',
  },
  {
    title: '回复时间',
    dataIndex: 'reply_time',
    width: '20%',
    customRender: ({ text }: { text: string }) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
  },
]
</script>

<template>
  <div class="user-message-board">
    <div class="header">
      <h2>我的留言</h2>
      <a-button type="primary" @click="addVisible = true">
        新增留言
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      bordered
      :scroll="{ x: 1000 }"
    />

    <a-modal
      v-model:open="addVisible"
      title="新增留言"
      @ok="submitMessage"
    >
      <a-form layout="vertical">
        <a-form-item label="留言内容">
          <a-textarea
            v-model:value="messageContent"
            :rows="4"
            placeholder="请输入留言内容"
            :maxlength="200"
            show-count
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.user-message-board {
  padding: 24px;
}

.header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
  color: #1890ff;
}
</style>
