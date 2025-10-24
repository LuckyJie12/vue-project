<template>
  <ECharts :options="chartOptions" width="500px" height="400px" />
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import ECharts from '@/components/ECharts.vue'

const chartOptions: EChartsOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
}
</script>