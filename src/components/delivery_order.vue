<script setup lang="ts">
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import API from '~/api/requests'

interface DeliveryOrder {
  order_id: number
  user_phone: string
  package_id: string
  package_code: string
  delivery_address: string
  appointment_time: string
  create_time: string
  status: number // 0: 待配送, 1: 配送中, 2: 已完成
}

const dataSource = ref<DeliveryOrder[]>([])
const dateData = ['All', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']
const dateValue = ref(dateData[0])

// 查找订单
async function findDeliveryOrders(timeRange: string) {
  try {
    const res = await API({
      url: '/order/findDeliveryOrders',
      method: 'post',
      data: { timeRange },
    })
    if (res.data.code === 200)
      dataSource.value = res.data.data
  }
  catch (error) {
    console.error('获取配送订单失败:', error)
  }
}

function handleDateChange() {
  findDeliveryOrders(dateValue.value)
}

onMounted(() => {
  findDeliveryOrders(dateValue.value)
})

const columns = [
  {
    title: '订单号',
    dataIndex: 'order_id',
    width: '10%',
  },
  {
    title: '用户手机号',
    dataIndex: 'user_phone',
    width: '15%',
  },
  {
    title: '取件码',
    dataIndex: 'package_code',
    width: '15%',
    customRender: ({ text }: { text: string }) => {
      return h('a-tag', { color: 'blue' }, text)
    },
  },
  {
    title: '配送地址',
    dataIndex: 'delivery_address',
    width: '20%',
  },
  {
    title: '预约时间',
    dataIndex: 'appointment_time',
    width: '15%',
    customRender: ({ text }: { text: string }) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: '15%',
    customRender: ({ text }: { text: string }) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '10%',
    customRender: ({ text }: { text: number }) => {
      const statusMap = {
        0: { text: '待配送', color: 'blue' },
        1: { text: '配送中', color: 'orange' },
        2: { text: '已完成', color: 'green' },
      }
      return h('a-tag', { props: { color: statusMap[text].color } }, statusMap[text].text)
    },
  },
]
</script>

<template>
  <div class="delivery-order-container">
    <div class="header">
      <a-segmented
        v-model:value="dateValue"
        :options="dateData"
        @change="handleDateChange"
      />
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      bordered
      :scroll="{ x: 1000 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button
              v-if="record.status === 0"
              type="primary"
              size="small"
              @click="handleStart(record)"
            >
              开始配送
            </a-button>
            <a-button
              v-if="record.status === 1"
              type="primary"
              size="small"
              @click="handleComplete(record)"
            >
              完成配送
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.delivery-order-container {
  padding: 24px;
}

.header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
