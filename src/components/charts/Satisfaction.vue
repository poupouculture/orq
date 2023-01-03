<template>
  <div ref="rightContainer"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import echarts from "./charts";

const rightContainer = ref(null);

let chart = null,
  data = ["Pleased", "Satisfied", "Commonly", "Dissatisfied"];

onMounted(() => {
  chart = echarts.init(rightContainer.value);

  data = data.map((item) => ({
    name: item,
    itemStyle: item === "Pleased" ? { color: "blue" } : {},
  }));

  chart.setOption({
    title: {
      text: "Satisfaction survey",
      textStyle: {
        fontWeight: "600",
        fontSize: 14,
      },
    },
    legend: {
      icon: "roundRect",
      itemWidth: 18,
      itemHeight: 10,
      bottom: 10,
      textStyle: {
        fontWeight: 300,
      },
      data,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        label: {
          show: true,
        },
      },
    },
    series: [
      {
        name: "Pleased",
        type: "pie",
        selectedMode: "single",
        radius: [0, "45%"],
        label: {
          position: "center",
          color: "#333",
          lineHeight: 20,
          formatter: "{c}%\n{a}",
          fontSize: 15,
        },
        itemStyle: {
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: 2,
          color: "#fff",
        },
        labelLine: {
          show: false,
        },
        data: [{ value: 45, name: "Pleased" }],
      },
      {
        type: "pie",
        label: {
          show: false,
        },
        radius: ["67%", "60%"],
        data: [
          { value: 45, name: "Pleased" },
          { value: 40, name: "Satisfied" },
          { value: 38, name: "Commonly" },
          { value: 42, name: "Dissatisfied" },
        ],
      },
    ],
  });
});

onBeforeUnmount(() => {
  chart.dispose();
});
</script>
