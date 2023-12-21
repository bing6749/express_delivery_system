<template>
  <a-input-search
    v-model:value="searchValue"
    placeholder="search phone"
    enter-button="Search"
    style="width: 200px"
    @search="onSearch"
  />
  <a-button class="editable-add-btn"  style="margin-bottom: 8px;margin-left: 50px" @click="handleAdd">入库</a-button>

<!--  对话框-->
  <a-modal v-model:open="open" title="入库单" @ok="handleOk">
    <a-form
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
    <template #bodyCell="{ column, text, record }">
<!--      <template v-if="column.dataIndex === 'name'">-->
<!--        <div class="editable-cell">-->
<!--          <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">-->
<!--            <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />-->
<!--            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />-->
<!--          </div>-->
<!--          <div v-else class="editable-cell-text-wrapper">-->
<!--            {{ text || ' ' }}-->
<!--            <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />-->
<!--          </div>-->
<!--        </div>-->
<!--      </template>-->
      <template v-if="column.dataIndex === 'status'">
        <a-popconfirm
          v-if="dataSource.length"
          title="Sure to sign?"
          @confirm="onSign(record.package_id)"
        >
          <a>Sign</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import type { Ref, UnwrapRef } from 'vue';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import API from "~/api/requests";
// import { cloneDeep } from 'lodash-es';

const searchValue = ref<string>('');
//根据手机尾号搜索快递
async function findPackageByPhone(phone: string) {
  await API({
    url: '/package/findPackageByPhone',
    method: 'post',
    data: {
      user_phone: phone,
    },
  }).then((res) => {
    dataSource.value = res.data;
  });
}
//根据package_id签收包裹
async function signPackageById(package_id: number) {
  await API({
    url: '/package/signPackageById',
    method: 'post',
    data: {
      package_id: package_id,
    },
  }).then((res) => {
    console.log(res)
  });
}
const onSearch = (searchValue: string) => {
  findPackageByPhone(searchValue);
};

onMounted(()=>{
  findPackageByPhone('')
})
interface DataItem {
  package_id: number;
  package_code: string;
  package_address: string;
  consignee: string;
  consignee_phone: string;
  status: number;
}

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
  },
];
const dataSource: Ref<DataItem[]> = ref([
  {
    package_id: 1,
    package_code: '0',
    package_address: 'Edward King 0',
    consignee: '32',
    consignee_phone: 'London, Park Lane no. 0',
    status: 1,
  }
]);
const formState: Ref<DataItem> = ref(
  {
    package_code: '12-3-4444',
    package_address: '菜鸟驿站1',
    consignee: '马睿',
    consignee_phone: '17777777777',
    status: 0,
  }
);
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

const onSign = (key: string) => {
  console.log(key)
  signPackageById(key)
  findPackageByPhone('')
  // dataSource.value = dataSource.value.filter(item => item.key !== key);
};
const handleAdd = () => {
  showModal()
};
const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

//对话框提交
const handleOk = (e: MouseEvent) => {
  console.log(formState.value);
  addPackage()
  open.value = false;
};
//根据formState对话框内容提交
async function addPackage() {
  await API({
    url: '/package/addPackage',
    method: 'post',
    data: {
      consignee: formState.value.consignee,
      consignee_phone: formState.value.consignee_phone,
      package_address: formState.value.package_address,
      package_code: formState.value.package_code,
    },
  }).then((res) => {
    console.log(res)
  });
}
</script>
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
