<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { InboxOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons-vue'
import API from '~/api/requests'

const statistics = ref({
  totalPackages: 0,
  todayPackages: 0,
  totalOrders: 0,
  totalUsers: 0,
  weeklyData: { dates: [], values: [] },
  monthlyData: { months: [], values: [] },
  companyData: [],
})

onMounted(async () => {
  try {
    const res = await API({
      url: '/admin/statistics',
      method: 'get',
    })
    if (res.data.code === 200)
      statistics.value = res.data.data
  }
  catch (error) {
    console.error('获取统计数据失败:', error)
  }
})

const option = computed(() => ({
  title: {
    text: '近7天包裹统计',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: statistics.value.weeklyData.dates,
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: statistics.value.weeklyData.values,
      type: 'line',
    },
  ],
}))

const pieOption = computed(() => ({
  title: {
    text: '快递公司占比',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '快递公司',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
      data: statistics.value.companyData,
    },
  ],
}))

const barOption = computed(() => ({
  title: {
    text: '月度订单趋势',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: statistics.value.monthlyData.months,
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'bar',
      data: statistics.value.monthlyData.values,
      itemStyle: {
        color: '#1890ff',
      },
    },
  ],
}))
</script>

<template>
  <div class="dashboard">
    <div class="statistics">
      <a-card class="stat-card">
        <template #title>
          <span class="card-title">
            <InboxOutlined />
            总包裹数
          </span>
        </template>
        <div class="stat-value">
          {{ statistics.totalPackages }}
        </div>
      </a-card>

      <a-card class="stat-card">
        <template #title>
          <span class="card-title">
            <InboxOutlined />
            今日包裹
          </span>
        </template>
        <div class="stat-value">
          {{ statistics.todayPackages }}
        </div>
      </a-card>

      <a-card class="stat-card">
        <template #title>
          <span class="card-title">
            <ShoppingOutlined />
            总订单数
          </span>
        </template>
        <div class="stat-value">
          {{ statistics.totalOrders }}
        </div>
      </a-card>

      <a-card class="stat-card">
        <template #title>
          <span class="card-title">
            <UserOutlined />
            用户总数
          </span>
        </template>
        <div class="stat-value">
          {{ statistics.totalUsers }}
        </div>
      </a-card>
    </div>

    <div class="chart-container">
      <div class="chart-row">
        <v-chart class="chart" :option="option" />
        <v-chart class="chart" :option="pieOption" />
      </div>
      <div class="chart-row">
        <v-chart class="chart" :option="barOption" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #1890ff;
}

.chart-container {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.chart-row:last-child {
  grid-template-columns: 1fr;
  margin-bottom: 0;
}

.chart {
  height: 400px;
  width: 100%;
}
</style>
