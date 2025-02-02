<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import moment from 'moment'
import { SmileOutlined } from '@ant-design/icons-vue'
import { notification } from 'ant-design-vue'
import { useRouter } from 'vue-router'

// 表单内

import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type PackageType from '~/models/package'
import Package from '~/models/package'
import API from '~/api/requests'

const router = useRouter()
const route = useRoute('/hi/[name]')
const user = useUserStore()
const { t } = useI18n()

watchEffect(() => {
  user.setNewName(route.params.name)
})
const dataList: PackageType[] = ref(null)
const now = moment()
async function getPackageByUserPhone(user_phone: string) {
  await API({
    url: '/package/getPackageByUserPhone',
    method: 'post',
    data: {
      user_phone,
    },
  }).then((res) => {
    dataList.value = res.data
    // bool = res.data[0].user_phone !== undefined;
  })
}
async function putAdminOrderByAddressAndDate(user_phone: string, submitAddress: string, submitDate: dayjs) {
  await API({
    url: '/adminOrder/putAdminOrderByAddressAndDate',
    method: 'post',
    data: {
      user_phone,
      submitAddress,
      submitDate,
    },
  }).then((res) => {
    // dataList.value = res.data;
    console.log(res.data)
    // bool = res.data[0].user_phone !== undefined;
  })
}

onMounted(async () => {
  await getPackageByUserPhone(user.savedName)
})
const columns = [
  {
    title: '驿站点',
    className: 'column-money',
    dataIndex: 'package_address',
  },
  {
    title: '取件码',
    dataIndex: 'package_code',
  },
  {
    title: '收件人',
    dataIndex: 'consignee',
  },
  // {
  //   title: '手机号',
  //   dataIndex: 'consignee_phone',
  // },
  {
    title: '收件地址',
    dataIndex: 'consignee_address',
  },
  {
    title: '到站时间',
    dataIndex: 'create_time',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 120,
  },
]
const submitDate = ref<Dayjs>()
const submitAddress = ref<string>('')

// 寄件
const loading = ref<boolean>(false)
const open = ref<boolean>(false)
const paymentModalVisible = ref<boolean>(false)
const currentPackage = ref<PackageType | null>(null)
const deliveryFee = 2 // 配送费用，单位：元
const deliveryAddress = ref<string>('')


function showModal() {
  open.value = true
}

function handleOk() {
  loading.value = true
  console.log(submitDate.value)
  putAdminOrderByAddressAndDate(user.savedName, submitAddress.value, submitDate.value)
  console.log(1)
  setTimeout(() => {
    loading.value = false
    open.value = false
  }, 500)
  openNotification()
}

function handleCancel() {
  open.value = false
}
// 弹出框
function openNotification() {
  notification.open({
    message: '提示',
    description:
      '您的寄件信息已发送至快递员，静候快递员上门取件',
    icon: () => h(SmileOutlined, { style: 'color: #108ee9' }),
    duration: 4,
  })
}

function handleBack() {
  // 清除登录信息
  localStorage.removeItem('token')
  localStorage.removeItem('phone')
  localStorage.removeItem('user_id')
  // 返回登录页
  router.push('/')
}

// 送货上门
async function handleDelivery(record: PackageType) {
  try {
    await API({
      url: '/order/addDeliveryOrder',
      method: 'post',
      data: {
        package_id: record.package_id,
        user_phone: user.savedName,
        delivery_address: record.consignee_address,
      },
    })
    notification.success({
      message: '已预约送货',
      description: '快递员将在2小时内送达，请保持电话畅通',
      duration: 4,
    })
  }
  catch (error) {
    notification.error({
      message: '预约失败',
      description: error.message || '请稍后重试',
      duration: 4,
    })
  }
}

// 打开支付确认框
function showPaymentModal(record: PackageType) {
  currentPackage.value = record
  paymentModalVisible.value = true
}

// 确认支付并创建配送订单
async function handlePaymentConfirm() {
  if (!currentPackage.value)
    return

  try {
    loading.value = true
    // 调用送货上门接口
    await API({
      url: '/order/addDeliveryOrder',
      method: 'post',
      data: {
        package_id: currentPackage.value.package_id,
        user_phone: user.savedName,
        delivery_address: deliveryAddress.value,
      },
    })

    notification.success({
      message: '支付成功',
      description: '快递员将在2小时内送达，请保持电话畅通',
      duration: 4,
    })

    paymentModalVisible.value = false
  }
  catch (error) {
    notification.error({
      message: '支付失败',
      description: error.message || '请稍后重试',
      duration: 4,
    })
  }
  finally {
    loading.value = false
  }
}

// 取消支付
function handlePaymentCancel() {
  paymentModalVisible.value = false
  currentPackage.value = null
}
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-pedestrian inline-block />
    </div>
    <p>
      {{ t('intro.hi', { name: user.savedName }) }}
    </p>
    <p>
      <a-button m="3 t6" text-sm btn @click="showModal">
        寄包裹
      </a-button>

      <a-modal v-model:open="open" width="1000px" title="预约上门取件" @ok="handleOk">
        <template #footer>
          <a-button key="back" @click="handleCancel">
            Return
          </a-button>
          <a-button key="submit" :loading="loading" @click="handleOk">
            Submit
          </a-button>
        </template>
        <a-textarea
          v-model:value="submitAddress"
          placeholder="上门取件地址（注意：仅限校区内）"
          auto-size
        />
        <a-time-picker v-model:value="submitDate" :default-value="dayjs('00:00:00', 'HH:mm:ss')">
          <template #suffixIcon>
            <SmileOutlined />
          </template>
        </a-time-picker>

        <p>选择时间，快递员会在一小时内上门</p>
      </a-modal>

      <a-button
        m="3 t6" text-sm btn
        @click="handleBack"
      >
        {{ t('button.back') }}
      </a-button>
    </p>
  </div>
  <p />
  <a-divider orientation="left">
    到站包裹
  </a-divider>
  <a-table :columns="columns" :data-source="dataList" bordered>
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'package_code'">
        <a-tag
          color="blue" size="large"
        >
          {{ text }}
        </a-tag>
      </template>
      <template v-if="column.dataIndex === 'create_time'">
        {{ moment(text).format('yyyy-MM-DD HH:mm:ss') }}
      </template>
      <template v-if="column.key === 'action'">
        <a-button
          type="primary"
          size="small"
          @click="showPaymentModal(record)"
        >
          送货上门
        </a-button>
      </template>
    </template>
    <template #footer>
      Footer
    </template>
  </a-table>

  <!-- 支付确认模态框 -->
  <a-modal
    v-model:visible="paymentModalVisible"
    title="确认支付"
    :confirm-loading="loading"
    @ok="handlePaymentConfirm"
    @cancel="handlePaymentCancel"
  >
    <div class="payment-info">
      <p>配送费用：{{ deliveryFee }}元</p>
      <p>取件码：{{ currentPackage?.package_code }}</p>
      <a-input v-model:value="deliveryAddress" placeholder="请输入配送地址" style="width: 50%;" />
      <div class="payment-qrcode">
        <img src="\images\qr-code.png" alt="支付二维码">
        <p>请使用支付宝或微信扫码支付</p>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.payment-info {
  text-align: center;
}

.payment-qrcode {
  margin-top: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.payment-qrcode img {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  margin-bottom: 10px;
}

th.column-money,
td.column-money {
  text-align: right !important;
}
</style>
