<template>
  <div
    :class="{ 'bg-primary': active }"
    class="flex w-full contact-card q-pa-sm relative"
  >
    <q-avatar class="rounded-avatar q-mr-sm">
      <img :src="profileIcon" />
    </q-avatar>
    <q-item-section>
      <q-item-label :class="{ 'text-white': active }" class="text-h6 truncate">
        {{ name }}
      </q-item-label>
      <q-item-label :class="{ 'text-white': active }" class="text-h8 truncate">
        {{ nameContact !== "Visitor" ? nameContact : "" }}
      </q-item-label>
      <q-item-label caption lines="1" :class="{ 'text-white': active }">
        {{ message ? decodeURIComponent(message) : message }}
      </q-item-label>
    </q-item-section>
    <q-item-section side top class="justify-between q-pb-sm">
      <q-item-label caption :class="{ 'text-white': active }">
        {{ time }}
      </q-item-label>
      <q-badge
        :class="{ 'mb-3.5': nameContact !== 'Visitor' && nameContact.length }"
        v-show="props.data.totalUnread"
        rounded
        color="red"
        :label="props.data.totalUnread"
      />
      <div
        class="absolute bottom-2 flex items-center text-xs gap-x-1"
        :class="[
          {
            '-bottom-1': props.data.totalUnread && nameContact == 'Visitor',
          },
          waitingTimeStatus,
          { '-bottom-0.5': nameContact !== 'Visitor' && nameContact.length },
        ]"
        v-if="selectedTab === ChatTypes.PENDING"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z"
          ></path>
          <path
            d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z"
          ></path>
        </svg>
        {{ waitingTime }}
      </div>
    </q-item-section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { differenceInMinutes, format, intlFormatDistance } from "date-fns";
import { storeToRefs } from "pinia";
import { IChat, MessageType } from "src/types/MessagingTypes";
import useMessagingStore from "src/stores/modules/messaging";
import profileIcon from "src/assets/images/profileicon.svg";
import { getChatNameEn, getContactNameEn } from "src/utils/trim-word";
import { ChatTypes } from "src/constants/ChatKeyword";

export interface Props {
  data?: IChat;
}

// const contactNameGet = computed<string>(() => {
//   return (
//     getSelectedChat.value.contact_first_name +
//     " " +
//     getSelectedChat.value.contact_last_name
//   );
// });

const props = withDefaults(defineProps<Props>(), {
  data: () => ({} as IChat),
});
const messagingStore = useMessagingStore();
const { selectedChatId, selectedTab } = storeToRefs(messagingStore);

const active = computed<boolean>(() => props.data.id === selectedChatId.value);
const name = computed(() => getChatNameEn(props.data));
const nameContact = computed(() => getContactNameEn(props.data));

const messageTemplate = (content: any) => {
  const components = content?.template?.components ?? content?.components;
  if (components) {
    const component = components?.find(
      (component: any) => component?.type === "body"
    );
    if (component) return component?.parameters[0].text;
  }

  return content?.template_content || content?.template?.text;
};

const message = computed<string>(() => {
  const { last_message: lastMessage } = props.data;
  if (!lastMessage) return;
  switch (lastMessage?.content?.type) {
    case MessageType.IMAGE:
      return "[pic]";
    case MessageType.AUDIO:
      return "[audio]";
    case MessageType.TEXT:
      return lastMessage?.content?.text;
    case MessageType.TEMPLATE:
      return messageTemplate(lastMessage.content);
    case MessageType.DOCUMENT:
      return "[file]";
    default:
      return lastMessage?.content?.file_name;
  }
});

const time = computed<string>(() => {
  const { last_message: lastMessage } = props.data;
  const dateCreated = lastMessage?.date_created;
  return dateCreated && format(new Date(dateCreated), "p, d LLL");
});
const waitingTime = computed(() => {
  const { last_message: lastMessage } = props.data;
  const dateCreated = lastMessage?.date_created;
  return intlFormatDistance(new Date(dateCreated), new Date());
});
const waitingTimeStatus = computed(() => {
  const { last_message: lastMessage } = props.data;
  const dateCreated = lastMessage?.date_created;
  const minutes = differenceInMinutes(new Date(), new Date(dateCreated));
  switch (true) {
    case minutes > 60 && minutes < 120:
      return "orange-status";
    case minutes > 120:
      return "red-status";
    default:
      return "green-status";
  }
});
</script>

<style scoped lang="scss">
.green-status {
  @apply text-green-500;
}
.orange-status {
  @apply text-orange-400;
}
.red-status {
  @apply text-red-600;
}
.rounded-avatar {
  border-radius: 50% !important;
}
.contact-card {
  border-radius: 10px;
}
</style>
