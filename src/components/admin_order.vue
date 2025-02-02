
<template>
  <p mt-10 ></p>
  <a-timeline text-left v-for="item in dataSource">
    <a-timeline-item>上门地址：{{ item.send_address }}   ----------  预约时间：{{ dayjs(item.appointment_time).format('YYYY-MM-DD HH:mm:ss') }}
      <a-statistic-countdown
        :value="item.appointment_time"
        style="margin-right: 50px"
      />
      电话：{{item.user_phone}}
    </a-timeline-item>

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

]);
//get上门取件信息
async function getSignPackageInfo() {
    await API({
        url: '/adminOrder/getSignPackageInfo',
        method: 'get',
    }).then((res) => {
        console.log(res)
        dataSource.value = res.data;
      // 对 dataSource 按 appointment_time 排序
      dataSource.value.sort((a, b) => new Date(a.appointment_time).getTime() - new Date(b.appointment_time).getTime());
    });
}

onMounted(()=>{
    getSignPackageInfo()

})
</script>

<style scoped>

</style>
