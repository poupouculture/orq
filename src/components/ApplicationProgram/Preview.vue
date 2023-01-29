<template>
  <div>
    <div class="w-full flex justify-end mt-4">
      <div class="w-10/12 flex flex-col bg-primary rounded-lg p-4 text-white">
        <div
          class="w-full bg-gray-300 py-8 flex justify-center"
          v-if="props.header === 'Media'"
        >
          <img
            src="../../assets/images/image-active.svg"
            v-if="props.media === 'image'"
          />
          <img
            src="../../assets/images/video-active.svg"
            v-if="props.media === 'video'"
          />
          <img
            src="../../assets/images/document-active.svg"
            v-if="props.media === 'document'"
          />
        </div>
        <h5 class="font-semibold">{{ props.headerMessage }}</h5>
        <p>{{ props.bodyMessage }}</p>
        <p class="text-gray-400">{{ props.footerMessage }}</p>
        <div v-if="props.actionCategory === 'Call To Action'">
          <button class="w-full bg-white py-2 mt-2 text-center text-gray-600">
            <q-icon
              name="fa fa-phone"
              v-if="actions[0].type === at.CALL_PHONE"
            ></q-icon>
            <q-icon name="fa fa-link" v-else></q-icon>
            {{ actions[0].label }}
          </button>
          <button class="w-full bg-white py-2 mt-2 text-center text-gray-600">
            <q-icon
              name="fa fa-phone"
              v-if="actions[1].type === at.CALL_PHONE"
            ></q-icon>
            <q-icon name="fa fa-link" v-else></q-icon>
            {{ actions[1].label }}
          </button>
        </div>
        <div v-if="props.actionCategory === 'Quick Reply'">
          <button
            class="w-full bg-white py-2 mt-2 text-center text-gray-600"
            v-for="(replyText, index) of props.replies"
            :key="index"
          >
            {{ replyText }}
          </button>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-end">
      <span class="text-xs">11:42 AM</span>
    </div>
  </div>
</template>

<script setup>
import { actionType as at } from "../../constants/messageTemplate.js";

const props = defineProps({
  header: {
    type: String,
    default: () => "",
  },
  headerMessage: {
    type: String,
    default: () => "",
  },
  media: {
    type: String,
    default: () => "",
  },
  bodyMessage: {
    type: String,
    default: () => "",
  },
  footerMessage: {
    type: String,
    default: () => "",
  },
  actionCategory: {
    type: String,
    default: () => "",
  },
  actions: {
    type: Array,
    default: () => [],
  },
  replies: {
    type: Array,
    default: () => [],
  },
});
</script>
