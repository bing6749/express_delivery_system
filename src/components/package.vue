<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import API from '~/api/requests'

// import { cloneDeep } from 'lodash-es';

interface DataItem {
  package_id: number
  package_code: string
  package_address: string
  consignee: string
  consignee_phone: string
  status: number
}

const dataSource: Ref<DataItem[]> = ref([
  {
    package_id: 1,
    package_code: '0',
    package_address: 'Edward King 0',
    consignee: '32',
    consignee_phone: 'London, Park Lane no. 0',
    status: 1,
  },
])

const searchValue = ref<string>('')
// 根据手机尾号搜索快递
async function findPackageByPhone(phone: string) {
  await API({
    url: '/package/findPackageByPhone',
    method: 'post',
    data: {
      user_phone: phone,
    },
  }).then((res) => {
    dataSource.value = res.data
  })
}
// 根据package_id签收包裹
async function signPackageById(package_id: string | number) {
  try {
    const res = await API({
      url: '/package/signPackageById',
      method: 'post',
      data: {
        package_id: Number(package_id),
      },
    })
    if (res.data.code === 200) {
      message.success('签收成功')
      // 刷新数据
      await findPackageByPhone('')
    }
    else {
      message.success('签收成功')
      // 刷新数据
      await findPackageByPhone('')
    }
  }
  catch (error) {
    message.error(`签收失败: ${error.message}`)
  }
}
function onSearch(searchValue: string) {
  findPackageByPhone(searchValue)
}

onMounted(() => {
  findPackageByPhone('')
})

const columns = [
  {
    title: 'id',
    dataIndex: 'package_id',
    width: '10%',
  },
  {
    title: '取件码',
    dataIndex: 'package_code',
    width: '30%',
  },
  {
    title: '取件地址',
    dataIndex: 'package_address',
  },
  {
    title: '收件人',
    dataIndex: 'consignee',
  },
  {
    title: '收件人手机号',
    dataIndex: 'consignee_phone',
  },
  {
    title: '签收',
    dataIndex: 'status',
    customRender: ({ text }: { text: number }) => {
      return text === 0 ? '未签收' : '已签收'
    },
  },
]

const formRef = ref()
const formState: Ref<DataItem> = ref(
  {
    package_code: '12-3-4444',
    package_address: '菜鸟驿站1',
    consignee: '马睿',
    consignee_phone: '17777777777',
    status: 0,
  },
)
// const count = computed(() => dataSource.value.length + 1);
// const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
//
// const edit = (key: string) => {
//   editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
// };
// const save = (key: string) => {
//   Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
//   delete editableData[key];
// };

function onSign(key: string) {
  if (key)
    signPackageById(key)
}
function handleAdd() {
  showModal()
}
const open = ref<boolean>(false)

function showModal() {
  open.value = true
}

// 对话框提交
function handleOk(_e: MouseEvent) {
  addPackage()
  open.value = false
}
// 根据formState对话框内容提交
async function addPackage() {
  try {
    // 先检查收件人手机号
    if (!formState.value.consignee_phone) {
      message.error('请输入收件人手机号')
      return
    }

    // 检查并添加收件人
    const userRes = await API({
      url: '/user/checkAndAddUser',
      method: 'post',
      data: {
        user_phone: String(formState.value.consignee_phone),
      },
    })

    if (userRes.data.code !== 200) {
      message.error('收件人信息处理失败')
      return
    }

    // 提交包裹信息
    const res = await API({
      url: '/package/add',
      method: 'post',
      data: {
        package_code: formState.value.package_code,
        package_address: formState.value.package_address,
        consignee: formState.value.consignee,
        consignee_phone: formState.value.consignee_phone,
        consignee_address: '温州商学院',
        status: 0,
        create_time: dayjs().format('YYYY-MM-DD'),
      },
    })

    if (res.data.code === 200) {
      message.success('包裹入库成功')
      // 重置表单
      formRef.value?.resetFields()
      // 刷新数据
      await findPackageByPhone('')
    }
    else {
      message.error('包裹入库失败')
    }
  }
  catch (error) {
    message.error(`入库错误: ${error.message}`)
  }
}
</script>

<template>
  <a-input-search
    v-model:value="searchValue"
    placeholder="search phone"
    enter-button="Search"
    style="width: 200px"
    @search="onSearch"
  />
  <a-button class="editable-add-btn" style="margin-bottom: 8px;margin-left: 50px" @click="handleAdd">
    入库
  </a-button>

  <!--  对话框 -->
  <a-modal v-model:open="open" title="入库单" @ok="handleOk">
    <a-form
      ref="formRef"
      :model="formState"
      name="nest-messages"
      :validate-messages="validateMessages"
    >
      <a-form-item :name="['consignee']" label="收件人" :rules="[{ required: true }]">
        <a-input v-model:value="formState.consignee" />
      </a-form-item>
      <a-form-item :name="['consignee_phone']" label="收件人手机号" :rules="[{ required: true }]">
        <a-input v-model:value="formState.consignee_phone" />
      </a-form-item>
      <a-form-item :name="['package_address']" label="收件地址" :rules="[{ required: true }]">
        <a-input v-model:value="formState.package_address" />
      </a-form-item>
      <a-form-item :name="['package_code']" label="收件码">
        <a-input v-model:value="formState.package_code" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-table bordered :data-source="dataSource" :columns="columns">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'status'">
        <template v-if="record.status === 0">
          <a-popconfirm
            title="确认签收这个包裹吗?"
            ok-text="确认"
            cancel-text="取消"
            @confirm="onSign(record.package_id)"
          >
            <a>签收</a>
          </a-popconfirm>
        </template>
        <template v-else>
          <span>已签收</span>
        </template>
      </template>
    </template>
  </a-table>
</template>

<style  scoped>
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
