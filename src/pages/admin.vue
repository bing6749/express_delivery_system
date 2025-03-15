<script lang="ts" setup>
import { h, ref, shallowRef } from 'vue'
import { AppstoreOutlined, CarOutlined, MailOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'
import Package from '~/components/package.vue'
import Order from '~/components/order.vue'
import Admin_order from '~/components/admin_order.vue'
import Dashboard from '~/components/Dashboard.vue'
import DeliveryOrder from '~/components/delivery_order.vue'
import MessageBoard from '~/components/MessageBoard.vue'

const comName = shallowRef<string>(Dashboard)
const handleClick: MenuProps['onClick'] = (e) => {
  comName.value = e.key
}

const current = ref<string[]>(['dashboard'])
const items = ref<MenuProps['items']>([
  {
    key: Dashboard,
    icon: () => h(AppstoreOutlined),
    label: '仪表盘',
    title: 'dashboard',
  },
  {
    key: Package,
    icon: () => h(MailOutlined),
    label: '包裹',
    title: '包裹',
  },
  {
    key: Order,
    icon: () => h(AppstoreOutlined),
    label: '订单',
    title: 'order',
  },
  {
    key: Admin_order,
    icon: () => h(SettingOutlined),
    label: '上门取件',
    title: 'admin_order',
  },
  {
    key: DeliveryOrder,
    icon: () => h(CarOutlined),
    label: '送货上门',
    title: 'delivery_order',
  },
  {
    key: MessageBoard,
    icon: () => h(MessageOutlined),
    label: '留言板',
    title: 'message_board',
  },
])

const router = useRouter()

// 获取存储的用户名
const username = ref(localStorage.getItem('username') || '管理员')

// 退出登录
function handleLogout() {
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      // 清除 token
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      // 跳转到登录页
      router.push('/adminLogin')
    },
  })
}
</script>

<template>
  <div class="logout-container">
    <span class="username">{{ username }}</span>
    <a-button type="link" @click="handleLogout">
      退出登录
    </a-button>
  </div>
  <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="handleClick" />
  <component :is="comName" />
</template>

<style scoped>
.logout-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 用户名样式 */
.username {
  color: #666;
  font-size: 14px;
}

/* 退出按钮样式 */
.logout-container :deep(.ant-btn-link) {
  color: #666;
  font-size: 14px;
}

.logout-container :deep(.ant-btn-link:hover) {
  color: #1677ff;
}
</style>
