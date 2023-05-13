<script setup>
import SmallBox from "src/components/Dashboard/AnalyticOverview/SmallBox.vue";
import BigBox from "src/components/Dashboard/AnalyticOverview/BigBox.vue";
import { getDashboardAnalytics } from "src/api/dashboard";
import { onMounted, ref } from "vue";

const userStatuses = ref([
  {
    name: "New",
    value: 80,
    color: "#4a44ed",
  },
  {
    name: "Returning",
    value: 10,
    color: "#b0adf9",
  },
  {
    name: "Inactive",
    value: 10,
    color: "#eeeeee",
  },
]);

const paymentStatuses = ref([
  {
    name: "Paid",
    value: 70,
    color: "#4a44ed",
  },
  {
    name: "Pending",
    value: 10,
    color: "#b0adf9",
  },
  {
    name: "Overdue",
    value: 10,
    color: "#e8e7fd",
  },
  {
    name: "Draft",
    value: 10,
    color: "#eeeeee",
  },
]);

const chatStatuses = ref([
  {
    name: "Active",
    value: 10,
    color: "#4a44ed",
  },
  {
    name: "Closed",
    value: 10,
    color: "#b0adf9",
  },
  {
    name: "Ongoing",
    value: 80,
    color: "#eeeeee",
  },
]);

const totalUserStatuses = ref(0);
const totalPaymentStatuses = ref(0);
const totalChatStatuses = ref(0);

const totalUserStatusesPercentage = ref('0');

const totalCurrentAmount = ref(0);
const totalCurrentAmountColor = ref('#000000');

const totalOverdue = ref(0);
const totalOverdueColor = ref('#000000');

const totalDraft = ref(0);
const totalDraftColor = ref('#000000');

const totalCustomers = ref(0);
const totalCustomersColor = ref('#000000');
const totalCustomerPercentage = ref('0');

onMounted(async () => {
  const response = await getDashboardAnalytics({
    limit: -1,
    page: 1,
    search: '' 
  });

  if (response) {
    const tempData = response.data.data;

    const userStatusList = tempData.find((x) => x.name === "Total Users");
    if (userStatusList) {
      userStatuses.value = userStatusList.metrics?.data;
      totalUserStatuses.value = userStatusList.metrics?.total;
      totalUserStatusesPercentage.value = userStatusList.metrics?.percentage;
    }

    const paymentStatusList = tempData.find((x) => x.name === "Payment Status");
    if (paymentStatusList) {
      paymentStatuses.value = paymentStatusList.metrics?.data;
      totalPaymentStatuses.value = paymentStatusList.metrics?.total;
    }

    const chatStatusList = tempData.find((x) => x.name === "Chat Status");
    if (chatStatusList) {
      chatStatuses.value = chatStatusList.metrics?.data;
      totalChatStatuses.value = chatStatusList.metrics?.total;
    }

    const totalCurrentAmountMetrics = tempData.find((x) => x.name === "Current amount");
    if (totalCurrentAmountMetrics) {
      totalCurrentAmount.value = totalCurrentAmountMetrics.metrics?.total;
      totalCurrentAmountColor.value = totalCurrentAmountMetrics.metrics?.color;
    }

    const totalOverdueMetrics = tempData.find((x) => x.name === "Overdue");
    if (totalOverdueMetrics) {
      totalOverdue.value = totalOverdueMetrics.metrics?.total;
      totalOverdueColor.value = totalOverdueMetrics.metrics?.color;
    }

    const totalDraftMetrics = tempData.find((x) => x.name === "Draft");
    if (totalDraftMetrics) {
      totalDraft.value = totalDraftMetrics.metrics?.total;
      totalDraftColor.value = totalDraftMetrics.metrics?.color;
    }

    const totalCustomerMetrics = tempData.find((x) => x.name === "Total customers");
    if (totalCustomerMetrics) {
      totalCustomers.value = totalCustomerMetrics.metrics?.total;
      totalCustomersColor.value = totalCustomerMetrics.metrics?.color;
      totalCustomerPercentage.value = totalCustomerMetrics.metrics?.percentage;
    }
  }
});

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
    <SmallBox title="Current" :title-color="totalCurrentAmountColor" :value="totalCurrentAmount" />
    <SmallBox title="Overdue" :title-color="totalOverdueColor" :value="totalOverdue" />
    <SmallBox title="Draft" :title-color="totalDraftColor" :value="totalDraft" />
    <SmallBox title="Total Customers" :title-color="totalCustomersColor" :value="totalCustomers"
      :percentage="totalCustomerPercentage" />
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
    <BigBox title="Users" :value="totalUserStatuses" :data="userStatuses" :percentage="totalUserStatusesPercentage" />
    <BigBox title="Payment Status" :value="totalPaymentStatuses" :data="paymentStatuses" />
    <BigBox title="Chat Status" :value="totalChatStatuses" :data="chatStatuses" />
  </div>
</template>
