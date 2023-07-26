<template>
  <div
    :class="{ 'bg-primary': active }"
    class="flex w-full contact-card q-pa-sm relative"
  >
    <q-avatar class="rounded-avatar q-mr-sm">
      <img :src="profileIcon" />
      <q-icon
        v-if="errorLastMessageType.status"
        class="absolute right-full top-1/2 -translate-y-2/4 pr-1"
        name="warning"
        color="negative"
        size="1.2rem"
      />
    </q-avatar>
    <q-item-section>
      <q-item-label :class="{ 'text-white': active }" class="text-h6 truncate">
        {{ name }}
      </q-item-label>
      <q-item-label :class="{ 'text-white': active }" class="text-h8 truncate">
        {{ nameContact !== "Visitor" ? nameContact : "" }}
      </q-item-label>
      <q-item-label caption lines="1" :class="{ 'text-white': active }">
        <!-- {{ message ? decodeURIComponent(message) : message }} -->
        {{ getUserBySelectedChat?.first_name }}
        {{ getUserBySelectedChat?.last_name }}
      </q-item-label>
    </q-item-section>
    <q-item-section side top class="justify-between q-pb-sm">
      <q-item-label caption :class="{ 'text-white': active }">
        {{ time }}
      </q-item-label>
      <div
        class="flex items-center gap-x-1"
        :class="[
          nameContact.length && nameContact !== 'Visitor' ? 'mb-3.5' : 'mb-1.5',
        ]"
      >
        <svg
          v-if="data.admin === getUserProfile?.id"
          xmlns="http://www.w3.org/2000/svg"
          :class="[active ? 'text-gray-100' : 'text-gray-600']"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M15.113 3.21l.094 .083l5.5 5.5a1 1 0 0 1 -1.175 1.59l-3.172 3.171l-1.424 3.797a1 1 0 0 1 -.158 .277l-.07 .08l-1.5 1.5a1 1 0 0 1 -1.32 .082l-.095 -.083l-2.793 -2.792l-3.793 3.792a1 1 0 0 1 -1.497 -1.32l.083 -.094l3.792 -3.793l-2.792 -2.793a1 1 0 0 1 -.083 -1.32l.083 -.094l1.5 -1.5a1 1 0 0 1 .258 -.187l.098 -.042l3.796 -1.425l3.171 -3.17a1 1 0 0 1 1.497 -1.26z"
            stroke-width="0"
            fill="currentColor"
          ></path>
        </svg>
        <q-badge
          v-show="props.data.totalUnread"
          rounded
          color="red"
          :label="props.data.totalUnread"
        />
      </div>
      <div
        class="absolute flex items-center text-xs gap-x-1"
        :class="[
          {
            '-bottom-1': props.data.totalUnread,
          },
          waitingTimeStatus,
          [nameContact !== 'Visitor' ? 'bottom-2' : 'bottom-1'],
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
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  differenceInMinutes,
  format,
  intlFormatDistance,
  isToday,
} from "date-fns";
import { storeToRefs } from "pinia";
// import { IChat, MessageType } from "src/types/MessagingTypes";
import { IChat } from "src/types/MessagingTypes";
import useMessagingStore from "src/stores/modules/messaging";
import profileIcon from "src/assets/images/profileicon.svg";
import { getChatNameEn, getContactNameEn } from "src/utils/trim-word";
import { ChatTypes } from "src/constants/ChatKeyword";
import useUserInfoStore from "src/stores/modules/userInfo";

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
const userInfoStore = useUserInfoStore();
const { selectedChatId, selectedTab, getUserBySelectedChat } =
  storeToRefs(messagingStore);
const { getUserProfile } = storeToRefs(userInfoStore);

const active = computed<boolean>(() => props.data.id === selectedChatId.value);
const errorLastMessageType = computed(() => {
  const { last_message: lastMessage } = props.data;
  // console.log(lastMessage);
  const errObj = messagingStore.parseLastMessageError(lastMessage);
  if (errObj.conversation_type) {
    console.log("isErrorLastMessage");
    messagingStore.setConversationType(props.data, errObj.conversation_type);
  }
  return errObj;
  // return messagingStore.parseError(lastMessage);
});

const name = computed(() => getChatNameEn(props.data));
const nameContact = computed(() => getContactNameEn(props.data));

let dateTimer: any;
const now = ref(new Date());
onMounted(() => {
  dateTimer = setInterval(() => {
    // console.log("1");
    now.value = new Date();
  }, 30000);
});

onUnmounted(() => clearInterval(dateTimer));

// const messageTemplate = (content: any) => {
//   const components = content?.template?.components ?? content?.components;
//   if (components) {
//     const component = components?.find(
//       (component: any) => component?.type === "body"
//     );
//     if (component) return component?.parameters[0].text;
//   }

//   return content?.template_content || content?.template?.text;
// };
// const message = computed<string>(() => {
//   const { last_message: lastMessage } = props.data;
//   if (!lastMessage) return;
//   switch (lastMessage?.content?.type) {
//     case MessageType.IMAGE:
//       return "[pic]";
//     case MessageType.AUDIO:
//       return "[audio]";
//     case MessageType.TEXT:
//       return lastMessage?.content?.text;
//     case MessageType.TEMPLATE:
//       return messageTemplate(lastMessage.content);
//     case MessageType.DOCUMENT:
//       return "[file]";
//     case MessageType.UNSUPPORTED:
//       return "[unsupported]";
//     default:
//       return lastMessage?.content?.file_name;
//   }
// });

const time = computed<string>(() => {
  const { last_message: lastMessage } = props.data;
  const dateCreated = lastMessage?.date_created;
  if (isToday(new Date(dateCreated))) {
    return dateCreated && format(new Date(dateCreated), "p") + ", Today";
  }
  return dateCreated && format(new Date(dateCreated), "p, d MMM");
});
const waitingTime = computed(() => {
  const { last_message: lastMessage } = props.data;
  // const dateCreated = lastMessage?.date_created;
  const dateCreated = lastMessage?.date_created ?? now.value;

  return intlFormatDistance(new Date(dateCreated), now.value);
});
const waitingTimeStatus = computed(() => {
  const { last_message: lastMessage } = props.data;
  const dateCreated = lastMessage?.date_created;
  const minutes = differenceInMinutes(now.value, new Date(dateCreated));
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
