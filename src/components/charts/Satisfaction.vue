<template>
  <div ref="rightContainer"></div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import echarts from './charts'

export default {
  name: 'SatifactionChart'
}
</script>

<script setup>
const rightContainer = ref(null)

let chart = null

onMounted(() => {
  chart = echarts.init(rightContainer.value)

  chart.setOption({
    title: {
      text: 'Satisfaction survey',
      textStyle: {
        fontWeight: '600',
        fontSize: 14
      }
    },
    legend: {
      icon: 'roundRect',
      itemWidth: 18,
      itemHeight: 10,
      data: ['Pleased', 'Satisfied', 'Commonly', 'Dissatisfied'],
      bottom: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          show: true
        }
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '45%'],
        label: {
          position: 'center',
          color: '#333',
          lineHeight: 18,
          formatter: '{c}%\n{a}'
        },
        itemStyle: {
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 1
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 45, name: 'Pleased' }
        ]
      },
      {
        type: 'pie',
        label: {
          show: false
        },
        radius: ['67%', '60%'],
        data: [
          { value: 45, name: 'Pleased' },
          { value: 40, name: 'Satisfied' },
          { value: 38, name: 'Commonly' },
          { value: 42, name: 'Dissatisfied' }
        ]
      }
    ]
  })
})

onBeforeUnmount(() => {
  chart.dispose()
})
</script>

<style lang="scss" scoped>

</style>
