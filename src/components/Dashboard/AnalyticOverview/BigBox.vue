<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import echarts from "src/components/charts/charts";

const prop = defineProps({
  title: {
    type: String,
    default: () => "",
  },
  value: {
    type: String,
    default: () => "",
  },
  data: {
    type: Array,
    default: () => [],
  },
});

const chartDiv = ref(null);
let chart = null;
onMounted(() => {
  chart = echarts.init(chartDiv.value);

  chart.setOption({
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  });

  const baseWidth = 200,
    baseHeight = 200;

  chartDiv.value.setAttribute(
    "style",
    `width: ${baseWidth}px; height: ${baseHeight}px`
  );
  chartDiv.value.setAttribute("style", `width: ${null}; height: ${null}`);

  chart.resize({
    width: "auto",
    height: "auto",
  });
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
      <span class="my-4 text-2xl font-semibold"> {{ prop.value }} </span>
      <div
        class="w-full flex flex-col text-xs"
        v-for="(val, index) in prop.data"
        :key="index"
      >
        <div class="w-full flex items-center mb-2">
          <div
            class="w-5 h-3 rounded-sm mr-1"
            :style="'background:' + val.color"
          ></div>
          <div>
            {{ val.value.toString() + "% " + val.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-8/12 flex flex-col items-center">
      <div
        class="w-full flex text-sm justify-end"
        v-if="prop.title === 'Users'"
      >
        <img src="~/assets/images/stonk-icon.svg" />
        <span class="text-green-600 mr-1"> +10% </span>
        <span> Since last month </span>
      </div>
      <div
        class="w-full bottom q-pt-sm q-pl-sm q-pr-sm"
        style="flex: 1; border-radius: 20px"
      >
        <div ref="chartDiv" width="200px" height="200px"></div>
      </div>
    </div>
  </div>
</template>
