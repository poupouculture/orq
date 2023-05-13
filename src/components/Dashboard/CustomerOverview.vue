<script setup>
import { getDashboardAnalytics } from "src/api/dashboard";
import { numberFormat } from "src/utils/number-format";
import { onMounted, ref } from "vue";

const customers = ref([]);
const tags = ref([]);

onMounted(async() => {
  const response = await getDashboardAnalytics({ limit: -1, page: 1, search: '' });

  if (response) {
    const tempData = response.data.data;
    
    const customer = tempData?.find(
      (x) => 
        x.name === "Customer Group with most Customer count"
    );

    if (customer) customers.value = customer.metrics;

    const tag = tempData?.find(
      (x) => 
        x.name === "Top 5 Tags with most count of customers"
    );

    if (tag) tags.value = tag.metrics;
  }
});
</script>

<template>
  <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
    <div class="flex p-4 rounded-lg bg-white shadow-md">
      <div class="w-8/12 md:w-10/12 flex flex-col gap-2">
        <div class="w-full flex flex-col border-b">
          <span class="text-lg">Customer Groups</span>
          <span class="text-sm text-gray-400">Most customers</span>
        </div>
        <table class="table">
          <tr v-for="(customer, index) in customers" :key="index">
            <td>
              <img src="~/assets/images/angliss.svg" alt="" />
            </td>
            <td>{{ customer.name }}</td>
            <td class="font-semibold">{{ numberFormat(customer.customer_count) }}</td>
          </tr>
        </table>
      </div>
      <div class="w-4/12 md:w-2/12 flex flex-col justify-start">
        <img src="~/assets/images/rocket.svg" alt="" />
      </div>
    </div>
    <div class="flex p-4 rounded-lg bg-primary text-white shadow-md">
      <div class="w-full flex flex-col gap-2">
        <div class="w-full flex border-b">
          <div class="w-9/12 flex flex-col">
            <span class="text-lg">Top 5 Tags</span>
            <span class="text-sm">Customer Count</span>
          </div>
          <div class="w-3/12 flex items-center">
            <img src="~/assets/images/star.svg" alt="" />
          </div>
        </div>

        <table class="table">
          <tr v-for="(tag, index) in tags" :key="index">
            <td>{{ tag.name }}</td>
            <td class="font-semibold">{{ numberFormat(tag.customer_count) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
