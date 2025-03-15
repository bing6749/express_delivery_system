<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
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
const replyVisible = ref(false)
const currentMessage = ref<Message | null>(null)
const replyContent = ref('')

// 获取留言列表
async function getMessageList() {
  try {
    const res = await API({
      url: '/messageBoard/list',
      method: 'get',
    })
    if (res.data.code === 200)
      dataSource.value = res.data.data
  }
  catch (error) {
    console.error('获取留言列表失败:', error)
    message.error('获取留言列表失败')
  }
}

// 回复留言
async function handleReply(record: Message) {
  currentMessage.value = record
  replyVisible.value = true
}

// 提交回复
async function submitReply() {
  if (!currentMessage.value || !replyContent.value) {
    message.error('请输入回复内容')
    return
  }

  try {
    const res = await API({
      url: '/messageBoard/reply',
      method: 'post',
      data: {
        message_id: currentMessage.value.message_id,
        reply: replyContent.value,
      },
    })

    if (res.data.code === 200) {
      message.success('回复成功')
      replyVisible.value = false
      replyContent.value = ''
      getMessageList()
    }
  }
  catch (error) {
    console.error('回复留言失败:', error)
    message.error('回复留言失败')
  }
}

// 删除留言
async function handleDelete(record: Message) {
  try {
    const res = await API({
      url: '/messageBoard/delete',
      method: 'post',
      data: {
        message_id: record.message_id,
      },
    })

    if (res.data.code === 200) {
      message.success('删除成功')
      getMessageList()
    }
  }
  catch (error) {
    console.error('删除留言失败:', error)
    message.error('删除留言失败')
  }
}

onMounted(() => {
  getMessageList()
})

const columns = [
  {
    title: '用户手机号',
    dataIndex: 'user_phone',
    width: '15%',
  },
  {
    title: '留言内容',
    dataIndex: 'content',
    width: '25%',
  },
  {
    title: '留言时间',
    dataIndex: 'create_time',
    width: '15%',
    customRender: ({ text }: { text: string }) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '回复内容',
    dataIndex: 'reply',
    width: '25%',
  },
  {
    title: '回复时间',
    dataIndex: 'reply_time',
    width: '15%',
    customRender: ({ text }: { text: string }) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    fixed: 'right',
    customRender: ({ record }: { record: Message }) => {
      return h('div', { class: 'action-buttons' }, [
        record.status === 0 && h('a-button', {
          type: 'primary',
          size: 'small',
          onClick: () => handleReply(record),
        }, '回复'),
        h('a-button', {
          type: 'primary',
          danger: true,
          size: 'small',
          onClick: () => handleDelete(record),
        }, '删除'),
      ])
    },
  },
]
</script>

<template>
  <div class="message-board-container">
    <a-table
      :columns="columns"
      :data-source="dataSource"
      bordered
      :scroll="{ x: 1200 }"
    />

    <a-modal
      v-model:open="replyVisible"
      title="回复留言"
      @ok="submitReply"
    >
      <a-form layout="vertical">
        <a-form-item label="留言内容">
          <a-input
            :value="currentMessage?.content"
            disabled
          />
        </a-form-item>
        <a-form-item label="回复内容">
          <a-textarea
            v-model:value="replyContent"
            :rows="4"
            placeholder="请输入回复内容"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.message-board-container {
  padding: 24px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
