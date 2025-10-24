<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useDark } from '@vueuse/core'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = withDefaults(defineProps<{
  options: EChartsOption
  width?: string
  height?: string
}>(), {
  width: '100%',
  height: '100%'
})

const chartRef = ref<HTMLElement>()
const isDark = useDark()
let chartInstance: echarts.ECharts | undefined

const observer = new ResizeObserver(() => {
  if (chartInstance && !chartInstance.isDisposed()) {
    chartInstance.resize()
  }
})

const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value, isDark.value ? 'dark' : undefined)
    chartInstance.setOption(props.options, { replaceMerge: ['series'] })
  }
}

const handleThemeChange = () => {
  if (chartInstance && chartRef.value) {
    observer.unobserve(chartRef.value)
    chartInstance.dispose()
    chartInstance = echarts.init(chartRef.value, isDark.value ? 'dark' : undefined)
    chartInstance.setOption(props.options, { replaceMerge: ['series'] })
    observer.observe(chartRef.value)
  }
}

watch(isDark, handleThemeChange)

watch(() => props.options, (newOptions) => {
  if (chartInstance && !chartInstance.isDisposed()) {
    chartInstance.setOption(newOptions)
  }
}, { deep: true })

onMounted(() => {
  initChart()
  if (chartRef.value) observer.observe(chartRef.value)
})

onUnmounted(() => {
  if (chartRef.value) observer.unobserve(chartRef.value)
  if (chartInstance && !chartInstance.isDisposed()) chartInstance.dispose()
})
</script>
