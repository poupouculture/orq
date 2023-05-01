<script setup>
import SmallBox from "src/components/Dashboard/AnalyticOverview/SmallBox.vue";
</script>

<template>
  <div class="w-full flex justify-between my-4">
    <span class="text-xl">Analytics Overview</span>
    <div class="flex p-2 bg-gray-200 rounded-md">
      <span class="text-gray-500"> Show: </span>
      <select class="bg-transparent">
        <option value="">Last month</option>
      </select>
    </div>
  </div>

  <div class="grid grid-cols-4 gap-3 mb-4">
    <SmallBox title="Current" title-color="text-primary" value="$2,545k" />
    <SmallBox title="Overdue" title-color="text-red-400" value="$3,356k" />
    <SmallBox title="Draft" title-color="text-gray-400" value="$30k" />
    <SmallBox
      title="Total Customers"
      title-color="text-gray-400"
      value="$20k"
    />
  </div>
</template>
