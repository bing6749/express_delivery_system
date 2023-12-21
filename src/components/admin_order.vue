
<template>
  <p mt-10 ></p>
  <a-timeline text-left v-for="item in dataSource">
    <a-timeline-item>上门地址：{{ item.send_address }}   ----------  预约时间：{{ item.appointment_time }} ------------ 电话：18399999999 </a-timeline-item>
  </a-timeline>
</template>

<script setup lang="ts">
import type { Ref,onMounted } from 'vue';
import dayjs from "dayjs";
import API from "~/api/requests";

interface DataItem {
  send_address: string;
  appointment_time: Date;
  phone: string;
}
const dataSource: Ref<DataItem[]> = ref([
    {
        send_address: "浙江万里学院钱湖校区28幢",
        appointment_time: dayjs(),
        phone: '17777777777',
    },{
        send_address: "浙江万里学院钱湖校区28幢",
        appointment_time: dayjs(),
        phone: '17777777777',
    },{
        send_address: "浙江万里学院钱湖校区28幢",
        appointment_time: dayjs(),
        phone: '17777777777',
    },
]);
//get上门取件信息
async function getSignPackageInfo() {
    await API({
        url: '/adminOrder/getSignPackageInfo',
        method: 'get',
    }).then((res) => {
        console.log(res)
        dataSource.value = res.data;
    });

}
onMounted(()=>{
    getSignPackageInfo()
})
</script>

<style scoped>

</style>
