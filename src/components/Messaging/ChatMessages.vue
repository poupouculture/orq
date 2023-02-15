<template>
  <q-drawer
    side="right"
    show-if-above
    bordered
    :breakpoint="0"
    :model-value="true"
    :width="450"
    class="bg-white q-pa-md"
  >
    <div v-if="getSelectedChat.id" class="h-full w-full flex flex-col">
      <header
        class="pt-1 pb-2 px-2 bg-white w-full justify-between items-center flex"
      >
        <div class="flex items-center space-x-3">
          <q-avatar class="rounded-avatar">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <div class="flex flex-col">
            <p class="font-semibold text-lg">{{ getCustomerName }}</p>
            <p class="text-gray-500">{{ getContactNumber }}</p>
          </div>
        </div>
        <!-- Close button -->
        <div v-if="getContactNumber" class="cursor-pointer">
          <svg
            @click="closeChat()"
            xmlns="http://www.w3.org/2000/svg"
            class="text-gray-600 cursor-pointer"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M18 6l-12 12"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </div>
      </header>
      <chat-conversation-buttton
        v-if="getSelectedChat.status !== ChatTypes.CLOSED"
      />
      <main class="flex-1 relative z-10 w-full h-full">
        <div
          class="absolute top-0 h-full overflow-y-auto w-full z-50 pt-3 px-2"
          ref="scrollAreaRef"
        >
          <div v-for="(message, i) in messages" :key="i">
            <div
              v-if="
                message.old_date_created == null ||
                differenceInDays(
                  new Date(message.date_created),
                  new Date(message.old_date_created)
                ) > 0
              "
              class="text-center py-4 text-[#9A9AAF] date"
            >
              {{
                isToday(new Date(message.date_created))
                  ? "Today"
                  : format(new Date(message.date_created), "eee, d MMM")
              }}
            </div>
            <!-- Chat Items -->
            <div
              class="flex"
              :class="[
                message.direction === Direction.OUTGOING
                  ? 'justify-end'
                  : 'justify-start',
              ]"
            >
              <div class="flex flex-col max-w-[60%] mb-2">
                <span
                  class="rounded-md px-4 py-3 whitespace-pre-wrap block break-words w-full"
                  :class="[
                    message.direction === Direction.OUTGOING
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-[#E8E7FB] text-[#2E2E3A] rounded-tl-none',
                  ]"
                >
                  {{ message.content }}
                </span>
                <!-- Time and Check icon (read) -->
                <div class="flex items-center ml-auto mr-0.5 mt-1 space-x-1">
                  <small class="text-[#9A9AAF]" style="font-size: 10px">
                    {{ format(new Date(message.date_created), "p") }}
                  </small>
                  <svg
                    v-if="message.direction === Direction.OUTGOING"
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
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer class="q-pa-xs q-pb-md bg-white w-full px-2 pt-2.5">
        <div v-if="getSelectedChat.status === ChatTypes.ONGOING">
          <q-input
            v-model="message"
            placeholder="Enter reply information"
            dense
            borderless
            bg-color="grey-2"
            type="textarea"
            input-class="px-4 py-4"
            class="rounded-xl overflow-hidden"
            @keydown.enter.prevent="sendMessage"
          />
          <div class="row justify-end">
            <q-btn
              flat
              round
              color="grey"
              icon="insert_comment"
              size="md"
              class="q-mt-md"
              @click="showMessageTemplate = true"
            />
            <!-- <q-btn
              flat
              round
              color="grey"
              icon="mic"
              size="md"
              class="q-mt-md"
            /> -->
            <q-btn
              flat
              round
              color="grey"
              icon="image"
              size="md"
              class="q-mt-md"
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                color="primary"
                label="Send"
                class="dark-btn"
                @click="sendMessage"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div
            class="w-full p-4 flex gap-2 items-center bg-gray-200 rounded-md"
          >
            <p class="text-gray-400 text-xs w-7/12">
              You are in preview mode of this chat
            </p>
            <button
              class="w-4/12 bg-primary text-white p-2 rounded-md shadow-md"
              @click="activateChat"
            >
              <q-icon name="message"></q-icon>
              Take it
            </button>
          </div>
        </div>
      </footer>
    </div>
  </q-drawer>
  <MessageTemplateDialog
    v-model="showMessageTemplate"
    @hide="showMessageTemplate = false"
    @send="sendMessageTemplate"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import useMessagingStore from "src/stores/modules/messaging";
import useCustomerStore from "src/stores/modules/customer";
import {
  IMessage,
  Direction,
  Product,
  MessageType,
} from "../../types/MessagingTypes";
import MessageTemplateDialog from "./MessageTemplateDialog.vue";
import { startNewChat, updateChatStatus } from "src/api/messaging";
import { ChatTypes } from "src/constants/ChatKeyword";
import { format, differenceInDays, isToday } from "date-fns";
import useUserInfoStore from "src/stores/modules/userInfo";
import ChatConversationButtton from "src/components/Messaging/ChatConversationButtton.vue";
import Swal from "sweetalert2";

const messagingStore = useMessagingStore();
const customerStore = useCustomerStore();
const userInfoStore = useUserInfoStore();

const props = defineProps({
  currentChatId: {
    type: String,
    default: () => "",
  },
});
const emit = defineEmits(["newChatCreated"]);

const templateName: Ref<string> = ref("");
const message: Ref<string> = ref("");
const language: Ref<string> = ref("");
const showMessageTemplate: Ref<boolean> = ref(false);
const isTemplate: Ref<boolean> = ref(false);
const { getContactNumber, getCustomerName, getSelectedChat } =
  storeToRefs(messagingStore);
const { getCustomer } = storeToRefs(customerStore);

const messages = computed<unknown[]>(() => {
  const arr: Array<IMessage> = messagingStore.getChatMessages;
  return arr.map((item: IMessage, index: number) => {
    const last = index - 1;
    return {
      content: item.content,
      direction: item.direction,
      status: item.status,
      old_date_created: arr[last]?.date_created || null,
      date_created: item.date_created,
    };
  });
});

const scrollAreaRef = ref<HTMLDivElement>();
watch(messages, async () => {
  // scroll to end bottom
  await nextTick();
  if (!scrollAreaRef.value) return;
  scrollAreaRef.value.scrollTop = scrollAreaRef.value?.scrollHeight;
});

watch(
  () => getSelectedChat.value.id,
  () => {
    message.value = "";
  }
);
const closeChat = () => {
  customerStore.$reset();
  messagingStore.closeChat();
};
const sendMessage = async () => {
  try {
    if (message.value.length < 1) return;
    if (messages.value.length > 0) {
      // const chat = getChats.value[getSelectedChatIndex.value];
      // const chatId = chat.id;
      const chatId = props.currentChatId;

      const contactNumber = getContactNumber.value;

      await messagingStore.sendChatTextMessage({
        chatId,
        messageProduct: Product.WHATSAPP,
        to: contactNumber as string,
        type: isTemplate.value ? MessageType.TEMPLATE : MessageType.TEXT,
        messageBody: message.value,
        isTemplate: isTemplate.value,
        templateName: templateName.value,
        language: language.value,
      });

      messagingStore.fetchChatMessagesByChatId(chatId, true);
    } else {
      startNewChat(getCustomer.value.id, message.value);
      messagingStore.fetchChats();
      messagingStore.setSelectedTab(ChatTypes.ONGOING);
      emit("newChatCreated", ChatTypes.ONGOING);
    }
    message.value = "";
    isTemplate.value = false;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
    console.log(error);
  }
};

const activateChat = async () => {
  const chatId = getSelectedChat.value.id;
  const userId: any | null = userInfoStore.getUserProfile;
  await updateChatStatus(chatId, userId?.id);
  emit("newChatCreated", ChatTypes.ONGOING);
};

const sendMessageTemplate = (name: string, msg: string, lang: string) => {
  templateName.value = name;
  message.value = msg;
  language.value = lang;
  isTemplate.value = true;
  sendMessage();
};
</script>

<style scoped lang="scss">
:deep(.q-drawer) {
  @media screen and (max-width: 1024px) {
    width: 100% !important;
  }
}
.date {
  position: relative;
  @apply text-xs;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    bottom: 0;
    height: 1px;
    background-color: #e6e6ec;
    @apply left-0 w-[30%] md:w-[38%];
  }
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    bottom: 0;
    height: 1px;
    background-color: #e6e6ec;
    @apply right-0 w-[30%] md:w-[38%];
  }
}
.rounded-avatar {
  border-radius: 50% !important;
}
</style>
