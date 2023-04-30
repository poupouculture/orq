<script setup>
const prop = defineProps({
  title: {
    type: String,
    default: () => "",
  },
  titleColor: {
    type: String,
    default: () => "",
  },
  value: {
    type: String,
    default: () => "",
  },
});
</script>

<template>
  <div class="flex p-4 rounded-lg border border-primary">
    <div class="w-1/2 md:w-3/4 flex flex-col gap-2">
      <span class="text-sm" :class="prop.titleColor">{{ prop.title }}</span>
      <span class="text-3xl font-semibold">{{ prop.value }}</span>
      <div class="w-full flex text-sm" v-if="prop.title === 'Total Customers'">
        <img src="~/assets/images/stonk-icon.svg" />
        <span class="text-green-600 mr-1"> +10% </span>
        <span> Since last month </span>
      </div>
    </div>
    <div class="w-1/2 md:w-1/4 flex justify-center">
      <img
        src="~/assets/images/analytic-amount.svg"
        alt=""
        v-if="prop.title === 'Current'"
      />
      <img
        src="~/assets/images/overdue-icon.svg"
        alt=""
        v-if="prop.title === 'Overdue'"
      />
      <img
        src="~/assets/images/draft-icon.svg"
        alt=""
        v-if="prop.title === 'Draft'"
      />
      <img
        src="~/assets/images/customers-icon.svg"
        alt=""
        v-if="prop.title === 'Total Customers'"
      />
    </div>
  </div>
</template>
