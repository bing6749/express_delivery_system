<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { message } from 'ant-design-vue'
import API from '~/api/requests'

// import { cloneDeep } from 'lodash-es';

interface DataItem {
  order_num: string
  send_name: number
  send_address: string
  send_phone: string
  send_company: string
  consignee: string
  consignee_phone: number
  consignee_address: string
  weight: number
  price: number
}

const dataSource: Ref<DataItem[]> = ref([
  {
    order_num: 1,
    send_company: 'sf',
    send_name: 'Edward King 0',
    send_address: '32鬼地方鬼地方高浮雕三个规范的是个发动机广泛认同',
    send_phone: '17799999999',
    consignee_address: '32',
    weight: 3.4,
    price: 10,
  },
])

const _searchValue = ref<string>('')
const accountBalance = ref<number>(0)
const dateData = reactive(['All', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'])
const dateValue = ref(dateData[0])
function dataChange() {
  findOrder(dateValue.value)
}
// 查找订单
async function findOrder(count: string) {
  await API({
    url: '/order/findOrder',
    method: 'post',
    data: { count },
  }).then((res) => {
    dataSource.value = res.data
    accountBalance.value = dataSource.value.reduce((acc, cur) => acc + cur.price, 0)
  })
}

onMounted(() => {
  findOrder(dateValue)
})

const columns = [
  {
    title: '快递公司',
    dataIndex: 'send_company',
    width: '5%',
  },
  {
    title: '订单号',
    dataIndex: 'order_num',
    width: '15%',
  },
  {
    title: '寄件人',
    dataIndex: 'send_name',
  },
  {
    title: '寄件人地址',
    dataIndex: 'send_address',
  },
  {
    title: '寄件人手机号',
    dataIndex: 'send_phone',
  },
  {
    title: '收件人地址',
    dataIndex: 'consignee_address',
  },
  {
    title: '包裹重量（kg）',
    dataIndex: 'weight',
  },
  {
    title: '价格（元）',
    dataIndex: 'price',
  },
]
const formState: Ref<DataItem> = ref(
  {
    order_num: '3888303241694',
    send_name: 'Lai Wai San',
    send_address: '浙江万里学院钱湖校区',
    send_phone: 18399999999,
    send_company: 'SF',
    consignee: 'Rui Ma',
    consignee_phone: 13678907890,
    consignee_address: '东城区东单王府井东街12号',
    weight: 3,
    price: 12,
  },
)
function handleAdd() {
  showModal()
}
const open = ref<boolean>(false)

function showModal() {
  open.value = true
}

// 对话框提交
function handleOk(_e: MouseEvent) {
  addOrder()
  open.value = false
}

// 根据formState对话框内容提交
async function addOrder() {
  try {
    const res = await API({
      url: '/order/addOrder',
      method: 'post',
      data: {
        order_num: formState.value.order_num,
        send_name: formState.value.send_name,
        send_address: formState.value.send_address,
        send_phone: formState.value.send_phone,
        send_company: formState.value.send_company,
        consignee: formState.value.consignee,
        consignee_phone: formState.value.consignee_phone,
        consignee_address: formState.value.consignee_address,
        weight: formState.value.weight,
        price: formState.value.price,
      },
    })
    if (res.data.code === 200)
      message.success('订单添加成功')
    else
      message.error(res.data.message || '订单添加失败')
  }
  catch (error) {
    message.error(`添加订单错误: ${error.message}`)
  }
}
</script>

<template>
  <a-segmented v-model:value="dateValue" :options="dateData" @change="dataChange" />
  <a-button class="editable-add-btn" style="margin-bottom: 8px;margin-left: 50px" @click="handleAdd">
    新增订单
  </a-button>
  <a-statistic title="Account Balance (CNY)" :precision="2" :value="accountBalance" />

  <!--  对话框 -->
  <a-modal v-model:open="open" title="寄件信息填写" @ok="handleOk">
    <a-form
      :model="formState"
      name="nest-messages"
      :validate-messages="validateMessages"
    >
      <a-form-item :name="['send_company']" label="快递公司" :rules="[{ required: true }]">
        <a-input v-model:value="formState.send_company" />
      </a-form-item>
      <a-form-item :name="['order_num']" label="订单号" :rules="[{ required: true }]">
        <a-input v-model:value="formState.order_num" />
      </a-form-item>
      <a-form-item :name="['consignee']" label="寄件人">
        <a-input v-model:value="formState.consignee" />
      </a-form-item>
      <a-form-item :name="['send_phone']" label="寄件人手机号">
        <a-input v-model:value="formState.send_phone" />
      </a-form-item>
      <a-form-item :name="['send_address']" label="寄件地址" :rules="[{ required: true }]">
        <a-input v-model:value="formState.send_address" />
      </a-form-item>
      <a-form-item :name="['consignee_phone']" label="收件人手机号">
        <a-input v-model:value="formState.consignee_phone" />
      </a-form-item>
      <a-form-item :name="['consignee_address']" label="收件人地址">
        <a-input v-model:value="formState.consignee_address" />
      </a-form-item>
      <a-form-item :name="['weight']" label="包裹重量（kg）">
        <a-input v-model:value="formState.weight" />
      </a-form-item>
      <a-form-item :name="['price']" label="寄件价格（元）">
        <a-input v-model:value="formState.price" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-table bordered :data-source="dataSource" :columns="columns" />
</template>

<style scoped>
.editable-cell {
  position: relative;

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
