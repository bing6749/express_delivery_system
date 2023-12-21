<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal"  @click="handleClick" :items="items" />
  <component :is="comName"/>
</template>


<script lang="ts" setup>
import { h, ref,shallowRef } from 'vue';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import Package from "~/components/package.vue";
import Order from "~/components/order.vue";
import Admin_order from "~/components/admin_order.vue";


const comName = shallowRef<string>(Package);
const handleClick: MenuProps['onClick'] = e => {
  comName.value = e.key
  console.log(comName.value);
};

const current = ref<string[]>(['package']);
const items = ref<MenuProps['items']>([
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
]);

</script>

