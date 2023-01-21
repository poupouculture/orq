<template>
  <div class="pt-4">
    <!-- Search -->
    <div class="flex items-center justify-between">
      <div class="w-52 ml-3">
        <q-input
          placeholder="Search Items..."
          bg-color="transparent"
          outlined
          dense
          class="border-gray-400"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-gray-400" />
          </template>
          <template v-slot:append>
            <q-icon name="filter_list" class="text-gray-400" />
          </template>
        </q-input>
      </div>
    </div>
    <BaseTimeline :items="[{ id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }]">
      <div class="bg-timeline-content px-5 py-3 rounded-2xl -mt-7">
        <div class="mb-3">
          <span>#3</span>
          <span class="text-[#4B44F6] ml-1 font-semibold">
            2022-12-11 13:42:01
          </span>
        </div>
        <div class="flex items-center gap-y-3 lg:gap-x-10 lg:gap-y-0">
          <div class="flex flex-col w-1/2 lg:w-auto items-center">
            <div class="font-medium">Assigned To</div>
            <p class="text-[#9A9AAF] text-sm">CS001</p>
          </div>
          <div class="flex flex-col w-1/2 lg:w-auto items-center">
            <div class="font-medium">Company</div>
            <p class="text-[#9A9AAF] text-sm">TOA Limited</p>
          </div>
          <div class="flex flex-col w-1/2 lg:w-auto items-center">
            <div class="font-medium">Service Result</div>
            <p class="text-[#9A9AAF] text-sm">-</p>
          </div>
          <div class="flex flex-col w-1/2 lg:w-auto items-center">
            <div class="font-medium">Remark</div>
            <p class="text-[#9A9AAF] text-sm">Exchange of goods</p>
          </div>
        </div>
        <div
          @click="toggleConvertationLog()"
          class="flex items-center justify-between bg-white rounded-md py-3 lg:py-2 px-4 mt-4 last:mb-2 cursor-pointer"
        >
          <div
            class="lg:divide-x lg:gap-x-4 gap-y-1 flex flex-col lg:flex-row items-start lg:items-center"
          >
            <div class="flex gap-x-4 lg:divide-x items-center">
              <div
                class="bg-timeline-content p-1.5 rounded-md bg-primary inline-flex"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 3C1 1.89543 1.89543 1 3 1H6.27924C6.70967 1 7.09181 1.27543 7.22792 1.68377L8.72574 6.17721C8.88311 6.64932 8.66938 7.16531 8.22427 7.38787L5.96701 8.5165C7.06925 10.9612 9.03878 12.9308 11.4835 14.033L12.6121 11.7757C12.8347 11.3306 13.3507 11.1169 13.8228 11.2743L18.3162 12.7721C18.7246 12.9082 19 13.2903 19 13.7208V17C19 18.1046 18.1046 19 17 19H16C7.71573 19 1 12.2843 1 4V3Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="font-semibold lg:pl-4">Dial Out</div>
            </div>
            <div class="font-semibold lg:pl-4">2022-12-11 13:42:01</div>
            <div class="font-semibold lg:pl-4">2022-12-11 13:42:01</div>
          </div>
          <div
            class="flex px-2 py-1 rounded-sm bg-timeline-content items-center gap-x-2 mt-1 lg:mt-0"
            style="box-shadow: 0px 4px 15px rgba(75, 68, 246, 0.2)"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 8H17M7 12H11M12 20L8 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H16L12 20Z"
                stroke="#2E2E3A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Contact</span>
          </div>
        </div>
      </div>
    </BaseTimeline>
    <ConversationLogDialog v-model="showConversationLog" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import BaseTimeline from "src/components/BaseTimeline.vue";
import ConversationLogDialog from "src/components/Dialogs/ConversationLogDialog.vue";

const showConversationLog = ref(false);
const toggleConvertationLog = () => {
  showConversationLog.value = !showConversationLog.value;
};
</script>
<style scoped>
.bg-timeline-content {
  background-color: #f2f3f7;
}
</style>
