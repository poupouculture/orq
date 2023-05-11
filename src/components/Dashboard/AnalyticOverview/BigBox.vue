<script setup>
import { onMounted, onBeforeUnmount, ref, onUpdated } from "vue";
import echarts from "src/components/charts/charts";
import { numberFormat } from "src/utils/number-format";

const prop = defineProps({
  title: {
    type: String,
    default: () => "",
  },
  value: {
    type: Number,
    default: () => "",
  },
  data: {
    type: Array,
    default: () => [],
  },
  percentage: {
    type: String,
    default: () => "",
  },
});

const chartDiv = ref(null);
let chart = null;

const loadChart = (() => {
  chart = echarts.init(chartDiv.value);

  chart.setOption({
    tooltip: {
      trigger: "item",
    },
    color: prop.data.map((d) => d.color),
    series: [
      {
        name: prop.title,
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: prop.data,
      },
    ],
  });
});

onMounted(() => {
  loadChart();
});

onUpdated(() => {
  loadChart();
});

onBeforeUnmount(() => {
  chart.dispose();
});
</script>

<template>
  <div class="flex p-4 rounded-lg border border-primary">
    <div class="w-4/12 flex flex-col">
      <span class="w-full">
        {{ prop.title }}
      </span>
      <span class="my-4 text-2xl font-semibold"> {{ numberFormat(prop.value) }} </span>
      <div class="w-full flex flex-col text-xs" v-for="(val, index) in prop.data" :key="index">
        <div class="w-full flex items-center mb-2">
          <div class="w-5 h-3 rounded-sm mr-1" :style="'background:' + val.color"></div>
          <div>
            {{ val.value.toString() + "% " + val.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-8/12 flex flex-col items-center">
      <div class="w-full flex text-sm justify-end" v-if="prop.title === 'Users'">
        <img src="~/assets/images/stonk-icon.svg" />
        <span class="text-green-600 mr-1"> {{ prop.percentage }} </span>
        <span> Since last month </span>
      </div>
      <div class="w-full bottom q-pt-sm q-pl-sm q-pr-sm" style="flex: 1; border-radius: 20px">
        <div ref="chartDiv" style="width: 100%; height: 100%"></div>
      </div>
    </div>
  </div>
</template>
