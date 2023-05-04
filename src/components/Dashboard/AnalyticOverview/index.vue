<script setup>
import SmallBox from "src/components/Dashboard/AnalyticOverview/SmallBox.vue";
import BigBox from "src/components/Dashboard/AnalyticOverview/BigBox.vue";

const userStatuses = [
  {
    label: "New",
    value: 70,
    color: "#4a44ed",
  },
  {
    label: "Returning",
    value: 13,
    color: "#b0adf9",
  },
  {
    label: "Inactive",
    value: 23,
    color: "#eeeeee",
  },
];

const paymentStatuses = [
  {
    label: "Paid",
    value: 40,
    color: "#4a44ed",
  },
  {
    label: "Pending",
    value: 60,
    color: "#b0adf9",
  },
  {
    label: "Overdue",
    value: 24,
    color: "#e8e7fd",
  },
  {
    label: "Draft",
    value: 40,
    color: "#eeeeee",
  },
];

const chatStatuses = [
  {
    label: "Active",
    value: 40,
    color: "#4a44ed",
  },
  {
    label: "Closed",
    value: 13,
    color: "#b0adf9",
  },
  {
    label: "Ongoing",
    value: 23,
    color: "#eeeeee",
  },
];
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

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
    <SmallBox title="Current" title-color="text-primary" value="$2,545k" />
    <SmallBox title="Overdue" title-color="text-red-400" value="$3,356k" />
    <SmallBox title="Draft" title-color="text-gray-400" value="$30k" />
    <SmallBox
      title="Total Customers"
      title-color="text-gray-400"
      value="$20k"
    />
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
    <BigBox title="Users" value="4,209" :data="userStatuses" />
    <BigBox title="Payment Status" value="4,209" :data="paymentStatuses" />
    <BigBox title="Chat Status" value="4,209" :data="chatStatuses" />
  </div>
</template>
