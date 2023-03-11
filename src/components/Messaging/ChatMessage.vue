<template>
  <!-- devider -->
  <div
    v-if="message.label"
    class="table py-6 whitespace-nowrap before:table-cell before:content-[''] before:w-1/2 before:border-t before:translate-y-2/4 after:table-cell after:content-[''] after:w-1/2 after:border-t after:translate-y-2/4"
  >
    <div class="text-center inline-block text-xs px-1.5 text-[#9A9AAF]">
      {{ message.label }}
    </div>
  </div>

  <div class="flex pb-6" :class="{ 'flex-row-reverse': isSend }">
    <div
      class="relative rounded max-w-[60%]"
      :class="[
        isSend
          ? 'text-white rounded-br-none'
          : 'text-[#2E2E3A] rounded-tl-none',
        showBackground
          ? isSend
            ? 'bg-primary px-3 py-2'
            : 'bg-[#E8E7FB] px-3 py-2'
          : '',
      ]"
    >
      <MessageComponents :content="message.content" />
      <div
        class="absolute right-0 top-full whitespace-nowrap flex flex-nowrap justify-end items-center pb-2 scale-90 origin-top-right"
      >
        <small class="text-[#9A9AAF]">
          {{ stamp }}
        </small>
        <svg
          v-if="isSend"
          class="inline"
          width="14"
          height="10"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.5089 0.194653C10.7861 0.348235 10.8635 0.683145 10.6816 0.942697L6.95684 6.25975C6.77503 6.5193 6.40288 6.60522 6.12569 6.45164L5.48095 6.12457C5.20376 5.97099 4.75241 5.47943 4.93422 5.21988C5.11603 4.96033 5.53234 4.97345 5.80953 5.12703L6.26716 5.22527L9.67779 0.386541C9.8596 0.12699 10.2318 0.0410714 10.5089 0.194653Z"
            fill="#9A9AAF"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.71166 0.194816C7.98888 0.348392 8.0662 0.683303 7.88436 0.94286L4.15952 6.25992C3.97768 6.51948 3.60557 6.60539 3.32836 6.45181L1.20508 5.19434C0.927862 5.04076 0.52147 4.75956 0.703307 4.5C0.885144 4.24044 1.24807 4.34642 1.52529 4.5L3.46984 5.22544L6.8805 0.386705C7.06234 0.127149 7.43445 0.0412397 7.71166 0.194816Z"
            fill="#9A9AAF"
          />
        </svg>
      </div>
      <q-spinner-ios
        v-if="message.sendMessageStatus === SendMessageStatus.PENDING"
        class="absolute right-full top-1/2 -translate-y-2/4 pr-1"
        color="primary"
        size="1.2em"
      />
      <q-icon
        v-if="message.sendMessageStatus === SendMessageStatus.FAILURE"
        class="absolute right-full top-1/2 -translate-y-2/4 pr-1"
        name="warning"
        color="negative"
        size="1.2rem"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import {
  Message,
  Direction,
  MessageType,
  SendMessageStatus,
} from "src/types/MessagingTypes";
import { format } from "date-fns";
import MessageComponents from "./MessageComponents.vue";
const props = defineProps<{ message: Message }>();
const isSend = computed(() => props.message.direction === Direction.OUTGOING);
const showBackground = computed(
  () => props.message.content.type !== MessageType.IMAGE
);
const stamp = computed(() => {
  return format(new Date(props.message.date_created), "p");
});
</script>