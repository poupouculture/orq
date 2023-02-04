<template>
  <div class="pt-4">
    <!-- Heading -->
    <div
      class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5 xl:mt-8"
    >
      <RouterLink
        :to="{ name: 'order.service-record' }"
        class="text-gray-400 gap-x-3 items-center flex"
      >
        <q-icon name="keyboard_backspace" class="text-gray-400" />
        <span>Service Record</span>
      </RouterLink>
      <span>/</span>
      <span>#1</span>
    </div>
    <div class="px-8 py-4 bg-white rounded-2xl">
      <template v-if="serviceRecordItems && serviceRecordItems.length">
        <ol class="relative border-l border-gray-200">
          <li
            class="mb-10 ml-10"
            v-for="(item, i) in serviceRecordItems"
            :key="i"
          >
            <span
              class="absolute flex items-center justify-center w-7 h-7 rounded-full -left-3.5 ring-8 ring-white"
              :class="[
                i !== 0
                  ? 'bg-[#F2F3F7] text-[#9A9AAF]'
                  : 'bg-[#4B44F6] text-white',
              ]"
              :style="{
                'box-shadow: 0px 4px 20px rgba(75, 68, 246, 0.3);': i == 0,
              }"
            >
              {{ i + 1 }}
            </span>
            <div class="font-medium text-lg mb-4">{{ item.name }}</div>
            <div class="bg-timeline-content px-5 py-3 rounded-xl">
              <template v-if="i !== 0 && i !== 2">
                <div class="mb-3">
                  <span class="text-[#4B44F6] ml-1 font-semibold">
                    {{ format(new Date(item.date_created), "Y-MM-d HH:mm:ss") }}
                  </span>
                </div>
                <div class="flex items-center gap-y-3 lg:gap-x-10 lg:gap-y-0">
                  <div class="flex flex-col w-1/2 lg:w-auto items-center">
                    <div class="font-medium">Assigned To</div>
                    <p class="text-[#9A9AAF] text-sm">
                      {{ item.employee.first_name }}
                      {{ item.employee.last_name }}
                    </p>
                  </div>
                  <div class="flex flex-col w-1/2 lg:w-auto items-center">
                    <div class="font-medium">Company</div>
                    <p class="text-[#9A9AAF] text-sm">
                      {{ item.company_name }}
                    </p>
                  </div>
                  <div class="flex flex-col w-1/2 lg:w-auto items-center">
                    <div class="font-medium">Service Result</div>
                    <p class="text-[#9A9AAF] text-sm">{{ item.status }}</p>
                  </div>
                  <div class="flex flex-col w-1/2 lg:w-auto items-center">
                    <div class="font-medium">Remark</div>
                    <p class="text-[#9A9AAF] text-sm">
                      {{ item.remarks || "-" }}
                    </p>
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
                    <div class="font-semibold lg:pl-4">
                      {{
                        format(new Date(item.date_created), "Y-MM-d HH:mm:ss")
                      }}
                    </div>
                    <div
                      class="font-semibold lg:pl-4"
                      v-if="item.type === 'convo'"
                    >
                      During Conversation
                    </div>
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
              </template>
              <template v-else>
                <div class="flex items-center">
                  <span class="mr-4 lg:mr-12">
                    {{ i == 2 ? "End Time :" : "Create Time :" }}
                    <span class="text-[#9A9AAF]">{{
                      format(new Date(item.date_created), "Y-MM-d HH:mm:ss")
                    }}</span>
                  </span>
                  <span>
                    Channel :
                    <span class="text-[#9A9AAF]">{{ item.channel }}</span>
                  </span>
                </div>
              </template>
            </div>
          </li>
        </ol>
      </template>
      <template v-else> No service record found. </template>
    </div>
    <ConversationLogDialog v-model="showConversationLog" />
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import ConversationLogDialog from "src/components/Dialogs/ConversationLogDialog.vue";
import useServiceRecordStore from "src/stores/modules/serviceRecord";
import { useRoute } from "vue-router";
import { format } from "date-fns";

const showConversationLog = ref(false);
const serviceRecordStore = useServiceRecordStore();
const serviceRecordItems = computed(() => serviceRecordStore.serviceRecords);
const route = useRoute();
const toggleConvertationLog = () => {
  showConversationLog.value = !showConversationLog.value;
};
onMounted(async () => {
  await serviceRecordStore.getServiceRecords(route.params.id);
});
</script>
<style scoped>
.bg-timeline-content {
  background-color: #f2f3f7;
}
</style>
