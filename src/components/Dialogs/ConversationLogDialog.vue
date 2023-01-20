<template>
  <!-- Modal / Dialog Conversation Log -->
  <q-dialog v-model="showConversationLog">
    <div
      class="h-full bg-white w-full !rounded-2xl px-7 py-4 overflow-y-auto lg:overflow-y-hidden"
    >
      <!-- Header Title -->
      <div class="flex items-center justify-between border-b pb-4">
        <h5 class="text-xl font-semibold">Conversation Log</h5>
        <div class="cursor-pointer">
          <svg
            @click="toggleConvertationLog()"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 13L13 1M1 1L13 13"
              stroke="#9CA3AF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <!-- Content -->
      <div class="lg:divide-x lg:flex lg:flex-row w-full h-full">
        <div class="lg:w-1/2 flex lg:pr-4 py-5">
          <div
            class="flex flex-col w-1/2"
            v-for="(menu, i) in menuLeft"
            :key="i"
          >
            <div class="font-semibold lg:text-lg">{{ menu.title }}</div>
            <div class="text-gray-700 text-xs lg:text-sm">
              {{ menu.desc }}
            </div>
          </div>
        </div>
        <!-- Chats -->
        <div class="h-full w-full lg:w-1/2 lg:pl-4 flex flex-col">
          <header class="py-3 lg:px-4 bg-white w-full">
            <div class="flex items-center space-x-3">
              <img
                src="https://cdn.quasar.dev/img/parallax2.jpg"
                alt="user"
                class="w-12 h-12 rounded-full"
              />
              <div class="flex flex-col">
                <p class="font-semibold text-lg">Rido Ananda</p>
                <p class="text-gray-500">Live chat 1</p>
              </div>
            </div>
          </header>
          <main class="flex-1 relative z-10 w-full h-full">
            <div
              class="absolute top-0 h-full overflow-y-auto w-full z-50 pb-10 pt-3 space-y-3"
            >
              <template v-for="i in 30" :key="i">
                <div
                  v-if="i == 6 || i == 20"
                  class="text-center py-4 text-[#9A9AAF] date"
                >
                  Wed, 14 Dec
                </div>
                <div
                  class="flex"
                  :class="[i % 2 == 0 ? 'justify-end' : 'justify-start']"
                >
                  <div
                    class="rounded-lg px-4 py-3 text-slate-800 text-md flex flex-col max-w-[60%]"
                    :class="[
                      i % 2 == 0
                        ? 'bg-primary text-white rounded-br-none lg:mr-4'
                        : 'bg-[#E8E7FB] text-[#2E2E3A] rounded-tl-none lg:ml-4',
                    ]"
                  >
                    <span class="whitespace-pre-wrap block break-words w-full">
                      Lorem, ipsum dolor sit amet
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </main>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { computed, reactive } from "vue";

const props = defineProps({
  modelValue: Boolean,
});
const emits = defineEmits(["close", "update:modelValue"]);
const showConversationLog = computed({
  set: (val) => emits("update:modelValue", val),
  get: () => props.modelValue,
});
const toggleConvertationLog = () => {
  showConversationLog.value = !showConversationLog.value;
  if (!showConversationLog.value) emits("close");
};

const menuLeft = reactive([
  {
    title: "Start Time",
    desc: "2022-12-11 13:42:01",
  },
  {
    title: "End Time",
    desc: "",
  },
  {
    title: "Dail-in/Dail-out",
    desc: "Dait out",
  },
  {
    title: "Assigned To",
    desc: "livechat01",
  },
  {
    title: "Customer",
    desc: "Chester Buchanan",
  },
  {
    title: "Channel",
    desc: "Whatsapp",
  },
  {
    title: "Company",
    desc: "TOA Limited",
  },
  {
    title: "Service Records",
    desc: "#3",
  },
]);
</script>
<style lang="scss" scoped>
.date {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    bottom: 0;
    height: 1px;
    background-color: #e6e6ec;
    @apply left-0 lg:left-4 w-[30%] md:w-[38%];
  }
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    bottom: 0;
    height: 1px;
    background-color: #e6e6ec;
    @apply right-0 lg:right-4 w-[30%] md:w-[38%];
  }
}
.q-dialog__inner--minimized > div {
  max-width: 100vw;
}
</style>
