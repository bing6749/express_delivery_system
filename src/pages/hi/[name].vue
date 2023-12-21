<script setup lang="ts">
import API from "~/api/requests";
import Package from "~/models/package";
import { onMounted, ref, h } from 'vue'
import PackageType from "~/models/package";
import moment from "moment";
import { SmileOutlined } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';

const router = useRouter()
const route = useRoute('/hi/[name]')
const user = useUserStore()
const { t } = useI18n()

watchEffect(() => {
  user.setNewName(route.params.name)
})
const dataList :PackageType[] = ref(null)
const now = moment();
async function getPackageByUserPhone(user_phone: string) {
  await API({
    url: '/package/getPackageByUserPhone',
    method: 'post',
    data: {
      user_phone: user_phone
    }
  }).then((res) => {
    dataList.value = res.data;
    // bool = res.data[0].user_phone !== undefined;
  });
}
async function putAdminOrderByAddressAndDate(user_phone: string, submitAddress: string, submitDate: dayjs) {
  await API({
    url: '/adminOrder/putAdminOrderByAddressAndDate',
    method: 'post',
    data: {
      user_phone: user_phone,
      submitAddress: submitAddress,
      submitDate: submitDate
    }
  }).then((res) => {
    // dataList.value = res.data;
    console.log(res.data)
    // bool = res.data[0].user_phone !== undefined;
  });
}

onMounted(async () =>{
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
  {
    title: '手机号',
    dataIndex: 'consignee_phone',
  },
  {
    title: '收件地址',
    dataIndex: 'consignee_address',
  },
  {
    title: '到站时间',
    dataIndex: 'create_time',
  },
];

//表单内

import dayjs, { Dayjs } from 'dayjs';
const submitDate = ref<Dayjs>();
const submitAddress = ref<string>('');

//寄件
const loading = ref<boolean>(false);
const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const handleOk = () => {
  loading.value = true;
  console.log(submitDate.value)
   putAdminOrderByAddressAndDate(user.savedName, submitAddress.value, submitDate.value)
  console.log(1)
  setTimeout(() => {
    loading.value = false;
    open.value = false;
  }, 500);
  openNotification()
};

const handleCancel = () => {
  open.value = false;
};
//弹出框
const openNotification = () => {
  notification.open({
    message: '提示',
    description:
      '您的寄件信息已发送至快递员，静候快递员上门取件',
    icon: () => h(SmileOutlined, { style: 'color: #108ee9' }),
    duration: 4,
  });
};
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-pedestrian inline-block />
    </div>
    <p>
      {{ t('intro.hi', { name: user.savedName }) }}</p>
    <p>
        <a-button  m="3 t6" text-sm btn @click="showModal">寄包裹</a-button>


        <a-modal v-model:open="open" width="1000px" title="预约上门取件" @ok="handleOk">
          <template #footer>
            <a-button key="back" @click="handleCancel">Return</a-button>
            <a-button key="submit" :loading="loading" @click="handleOk">Submit</a-button>
          </template>
          <a-textarea
            v-model:value="submitAddress"
            placeholder="上门取件地址（注意：仅限校区内）"
            auto-size
          />
            <a-time-picker v-model:value="submitDate" :default-value="dayjs('00:00:00', 'HH:mm:ss')">
              <template #suffixIcon> <smile-outlined /></template>
            </a-time-picker>

            <p>选择时间，快递员会在一小时内上门</p>
        </a-modal>


      <a-button
        m="3 t6" text-sm btn
        @click="router.back()"
      >
        {{ t('button.back') }}
      </a-button>
    </p>




  </div>
  <p></p>
  <a-divider orientation="left">到站包裹</a-divider>
  <a-table :columns="columns" :data-source="dataList" bordered>
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'package_code'">
        <a-tag
          color="blue" size="large" >{{ text }}</a-tag>
      </template>
      <template v-if="column.dataIndex === 'create_time'">
        {{ moment(text).format('yyyy-MM-DD HH:mm:ss') }}
      </template>
    </template>
    <template #footer>Footer</template>
  </a-table>
</template>


<style scoped>
th.column-money,
td.column-money {
  text-align: right !important;
}
</style>
