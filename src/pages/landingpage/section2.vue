<script setup lang="ts">
import { ref } from "vue";
import chatIcon from "src/assets/images/chatIcon.png";
import orderIcon from "src/assets/images/orderIcon.png";
import paymentIcon from "src/assets/images/paymentIcon.png";
const weDo = ref([
  {
    title: "Chat",
    icon: chatIcon,
    subtitle: "Create chats with customers and Build customer profiles",
  },
  {
    title: "order",
    icon: orderIcon,
    subtitle:
      "create and manage invoices. We customize and integrate into your ordering system.",
  },
  {
    title: "payment",
    icon: paymentIcon,
    subtitle:
      "Customers pay with Ease. process and reconcile payments in dashboard",
  },
]);
</script>

<template>
  <div class="mt-36">
    <div class="pl-5 flex flex-col">
      <span class="text-[#E12179] tracking-wide text-[23px] font-normal">
        WHAT WE DO
      </span>

      <p
        class="text-black text-4xl sm:text-[40px] font-black sm:w-[602px] leading-[57px]"
      >
        What Makes Us UniQue
      </p>
    </div>

    <div class="w-full mt-20 flex justify-center">
      <div class="grid gap-10 lg:grid-cols-3">
        <div
          v-for="(data, index) in weDo"
          :key="index"
          class="flex rounded-lg drop-shadow-2xl bg-white w-[380px] py-10 gap-10 items-center flex-col"
        >
          <span
            class="font-semibold mt-10 bg-[#4B44F6] text-white text-[40px] rounded-full w-20 h-20 ring-[20px] ring-[#4B44F680] flex justify-center items-center"
          >
            {{ index + 1 }}
          </span>

          <p
            class="mb-0 text-[#403F3F] flex gap-3 items-center uppercase text-[32px]"
          >
            <img :src="data.icon" class="w-7 h-7" alt="" />
            <span>{{ data.title }}</span>
          </p>

          <span
            class="font-normal w-[243px] capitalize text-[#5C5A8F] text-center leading-10 text-lg"
          >
            {{ data.subtitle }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
