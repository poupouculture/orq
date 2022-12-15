<template>
  <div ref="leftContainer">
    <div
      class="selectInterval flex absolute bg-grey-2"
      style="top: 20px; right: 20px; border-radius: 5px; padding: 3px;"
    >
      <div
        v-for="(item, i) in selectInterval"
        :key="i"
        :class="{ active: activeIndex === i }"
      >{{ item }}/{{ item === 1 ? 'h' : 'm' }}</div>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import echarts from './charts'

export default {
  name: 'StatisitcsChart'
}
</script>

<script setup>
const leftContainer = ref(null),
  selectInterval = [15, 30, 1],
  activeIndex = ref(2),
  categroy = ['Facebook', 'Telegram', 'Instagram', 'WhatsApp', 'Viber', 'Line', 'Email', 'Immediately']

let chart = null

onMounted(() => {
  chart = echarts.init(leftContainer.value)

  const series = categroy.map(item => ({
    name: item,
    type: 'line',
    smooth: true,
    symbolSize: 10,
    showSymbol: false,
    xAxisIndex: 0,
    yAxisIndex: 0,
    label: {
      show: true,
      color: '#333',
      formatter: '{c}%'
    },
    lineStyle: {
      width: 3,
      cap: 'round',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 3
    },
    data: (i => {
      const arr = []
      while (arr.length < i) {
        arr.push(Math.floor(Math.random() * (31)))
      }
      return arr
    })(9)
  }))

  // const img = 'path://M 104,1 205,60 205,180 104,237 3,180 3,60 Z'
  // const getData = function GetData () {
  //   const arr = []
  //   for (let i = 5; i > 0; i--) {
  //     for (let j = 0; j < 55; j++) {
  //       arr.push({
  //         symbol: img,
  //         symbolSize: 20,
  //         itemStyle: {
  //           color: 'blue',
  //           opacity: 1
  //         },
  //         value: [j * 5 + (j % 2 ? 8 : 4), i * 5],
  //         x: 0,
  //         y: 0
  //       })
  //     }
  //   }

  //   return arr
  // }

  // series.push({
  //   name: 'honeycomb',
  //   type: 'graph',
  //   draggable: false,
  //   coordinateSystem: 'cartesian2d',
  //   xAxisIndex: 1,
  //   yAxisIndex: 1,
  //   data: getData()
  // })

  chart.setOption({
    title: {
      left: 20,
      text: 'Statistics of services sources',
      textStyle: {
        fontWeight: '600'
      }
    },
    // grid: [
    //   {
    //     left: 60,
    //     right: 30,
    //     height: 270
    //   },
    //   {
    //     left: 30,
    //     right: 30,
    //     top: 380,
    //     height: 100
    //   }
    // ],
    xAxis: [
      {
        type: 'category',
        gridIndex: 0,
        boundaryGap: false,
        data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00'],
        axisLine: {
          lineStyle: {
            width: 1.5
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
      // {
      //   type: 'value',
      //   gridIndex: 1,
      //   boundaryGap: false,
      //   axisLine: {
      //     show: false
      //   },
      //   axisTick: {
      //     length: 8
      //   },
      //   axisLabel: {
      //     margin: 12
      //   },
      //   minorTick: {
      //     show: true,
      //     length: 8,
      //     color: '#ddd'
      //   }
      // }
    ],
    yAxis: [
      {
        type: 'value',
        gridIndex: 0,
        axisLabel: {
          formatter: '{value}%'
        }
      }
      // {
      //   show: false,
      //   gridIndex: 1
      // }
    ],
    legend: {
      icon: 'roundRect',
      itemWidth: 18,
      itemHeight: 10,
      data: categroy,
      bottom: 10,
      selected: { Facebook: true, Telegram: true, Instagram: true, WhatsApp: true, Viber: false, Line: false, Email: false, Immediately: false }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          show: true
        }
      }
    },
    series
  })
})

onBeforeUnmount(() => {
  chart.dispose()
})
</script>

<style lang="scss" scoped>
.selectInterval {
  > div {
    border-radius: 4px;
    width: 35px;
    height: 22px;
    margin: 0 3px;
    font-size: 12px;
    color: #333;
    line-height: 25px;
    text-align: center;

    &.active {
      background-color: white;
    }
  }
}
</style>
