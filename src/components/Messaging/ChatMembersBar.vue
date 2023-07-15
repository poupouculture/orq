<template>
  <div class="items-center p-3">
    <div class="flex row items-center justify-between">
      <div
        class="col-grow flex justify-between"
        :class="{
          row: showChatOption,
          column: !showChatOption,
          'items-center': showChatOption,
          'items-start': !showChatOption,
        }"
      >
        <div class="text-gray-400">Members</div>
        <div
          class="flex justify-between py-2 items-center col-grow"
          :class="{ 'ml-3': showChatOption, 'full-width': !showChatOption }"
        >
          <div class="flex">
            <div
              class="w-10 h-10 flex justify-center mr-1 items-center rounded-full bg-gray-200"
              v-for="(member, index) of members.slice(0, 3)"
              :key="index"
            >
              {{ initialName(member?.name) }}
            </div>
            <div
              class="w-10 h-10 flex justify-center mr-2 items-center rounded-full bg-gray-300"
              v-if="members.length > 3"
            >
              {{ members.length - 3 }} +
            </div>
          </div>
          <q-space />
          <ChatConversationButton
            v-if="!isMobile && selectedChat?.status !== ChatTypes.CLOSED"
          />
          <q-btn
            v-if="
              selectedChat?.status !== ChatTypes.CLOSED &&
              !showChatOption &&
              isMobile
            "
            flat
            padding="0"
            color="primary"
            @click="$emit('update:showChatOption', true)"
            >Show Actions</q-btn
          >
        </div>
      </div>
    </div>
  </div>
  <div v-if="selectedChat?.status !== ChatTypes.CLOSED">
    <div
      v-if="showChatOption"
      class="p-3 flex justify-between items-center row"
    >
      <ChatConversationButton />
      <q-btn
        v-if="isMobile"
        padding="none"
        flat
        color="primary"
        @click="$emit('update:showChatOption', false)"
      >
        Hide Actions
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatTypes } from "src/constants/ChatKeyword";
import { toRefs } from "vue";
import ChatConversationButton from "./ChatConversationButton.vue";

const props = defineProps({
  members: {
    type: Array,
    default: () => [],
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
  showChatOption: {
    type: Boolean,
    default: false,
  },
  selectedChat: {
    type: Object,
  },
});

defineEmits(["update:showChatOption"]);

const { members, showChatOption, selectedChat } = toRefs(props);

const initialName = (name: string) => {
  const firstName = name.split(" ")[0];
  let initial = firstName.charAt(0).toUpperCase();

  if (name.split(" ").length !== 1) {
    const lastName = name.split(" ")[1];
    initial += lastName.charAt(0).toUpperCase();
  }
  return initial;
};
</script>
