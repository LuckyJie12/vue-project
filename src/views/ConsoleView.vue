<template>
  <div class="chart-container">
    <div class="chart-item">
      <h3>访问来源统计</h3>
      <ECharts :options="pieOptions" width="500px" height="400px" />
    </div>
    <div class="chart-item">
      <h3>访问趋势</h3>
      <ECharts :options="barOptions" width="500px" height="400px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import ECharts from '@/components/ECharts.vue'

// 饼图配置
const pieOptions: EChartsOption = {
  tooltip: { trigger: 'item' },
  legend: { orient: 'horizontal', left: 'center', top: 'bottom' },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' }
      ],
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } }
    }
  ]
}

// 柱状图配置
const barOptions: EChartsOption = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], axisTick: { alignWithLabel: true } },
  yAxis: { type: 'value' },
  series: [
    { name: '访问量', type: 'bar', barWidth: '60%', data: [120, 200, 150, 80, 70, 110, 130], itemStyle: { borderRadius: [4, 4, 0, 0] } }
  ]
}
</script>

<style scoped>
.chart-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  flex-wrap: wrap;
}

.chart-item {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--el-box-shadow-lighter);
}

h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
}
</style>