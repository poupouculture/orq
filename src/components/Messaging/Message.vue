<template>
  <div
    v-if="getSelectedChat?.id"
    class="h-full w-full flex flex-col"
    id="parentChatList"
  >
    <header
      class="pt-1 pb-2 px-2 bg-white w-full justify-between items-center flex"
    >
      <div
        class="flex items-center space-x-3"
        @click="showCustomerInfoInMobile"
      >
        <q-avatar class="rounded-avatar">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
        <div class="flex flex-col">
          <p class="font-semibold text-lg">{{ name }}</p>
          <p class="text-gray-500">{{ chatNumber }}</p>
        </div>
      </div>
      <!-- Close button -->
      <div class="cursor-pointer">
        <q-btn
          @click="closeChat"
          style="color: #64748b"
          flat
          round
          icon="close"
        />
      </div>
    </header>
    <div class="text-gray-400">Members</div>
    <div class="flex p-2">
      <div
        class="w-10 h-10 flex justify-center mr-2 items-center rounded-full bg-gray-200"
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
    <ChatConversationButton
      v-if="getSelectedChat.status !== ChatTypes.CLOSED"
    />
    <!-- message content -->
    <main class="flex-1 relative z-10 w-full h-full">
      <div
        class="absolute top-0 scrollbar h-full overflow-y-auto w-full z-50 pt-3 px-2"
        ref="scrollAreaRef"
      >
        <div v-for="(message, i) in messages" :key="message.id">
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
            <div
              class="w-1/12 flex items-center px-2 text-lg text-gray-400 order-last"
            >
              <q-icon name="fa-solid fa-face-smile" class="cursor-pointer" />
            </div>
            <div class="flex flex-col max-w-[60%] mb-2">
              <div
                class="rounded-md pb-3 whitespace-pre-wrap block break-words w-full"
                :class="[
                  message.direction === Direction.OUTGOING
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-[#E8E7FB] text-[#2E2E3A] rounded-tl-none',
                ]"
              >
                <div
                  class="w-full flex justify-end pt-1 pr-1 hover:cursor-pointer text-gray-400"
                >
                  <q-icon
                    name="expand_more"
                    :id="`chat-action-${i}`"
                    @click="showActionChat(i)"
                  />
                </div>
                <div class="mx-4">
                  <!-- {{ message.content }} -->
                  <MessageItem
                    :content="message.content"
                    :sendMessageStatus="message.sendMessageStatus"
                  />
                </div>
              </div>
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
        <div
          v-if="activeAction !== null"
          class="px-4 py-2 absolute rounded-lg shadow-md top-0 bg-gray-200"
          :style="`margin-left: ${activeAction.left}px; margin-top: ${activeAction.top}px`"
        >
          Reply
        </div>
      </div>
    </main>
    <!-- footer -->
    <footer class="q-pa-xs q-pb-xs bg-white w-full px-2 pt-2.5">
      <div v-if="getSelectedChat.status === ChatTypes.ONGOING">
        <q-input
          v-model="message"
          placeholder="Enter reply information"
          dense
          borderless
          bg-color="grey-2"
          type="textarea"
          input-class="px-4 py-4 h-10 sm:h-auto"
          class="rounded-xl overflow-hidden"
          @keypress.enter.prevent="sendMessage"
          :disable="isChatExpired"
        />
        <div class="row justify-end">
          <q-btn
            :flat="!isChatExpired"
            round
            :color="isChatExpired ? 'primary' : 'grey'"
            icon="insert_comment"
            size="md"
            class="q-mt-md"
            @click="showMessageTemplate = true"
          />
          <q-btn
            flat
            round
            color="grey"
            icon="image"
            size="md"
            class="q-mt-md"
            @click="uplader?.pickFiles"
          >
            <q-uploader
              ref="uplader"
              class="hidden invisible"
              url="http://localhost:4444/upload"
              style="max-width: 300px"
            />
          </q-btn>
          <q-btn
            flat
            round
            color="grey"
            icon="mic"
            size="md"
            class="q-mt-md active:bg-primary"
            @mousedown="Recorder.play"
            @mouseup="Recorder.recStop"
          />

          <q-btn
            color="primary"
            label="Send"
            class="dark-btn q-mt-md"
            :disable="isChatExpired"
            @click="sendMessage"
          />
        </div>
      </div>
      <div v-else>
        <div class="w-full p-4 flex gap-2 items-center bg-gray-200 rounded-md">
          <p class="text-gray-400 text-xs w-7/12">
            You are in preview mode of this chat
          </p>
          <button
            class="w-4/12 bg-primary text-white p-2 rounded-md shadow-md"
            @click="activateChat"
          >
            <q-icon name="message" />
            Take it
          </button>
        </div>
      </div>
    </footer>
  </div>
  <div v-else class="flex flex-col justify-center items-center h-full">
    <img class="" src="~assets/images/startchat.png" />
    <p class="text-[#9A9AAF] font-medium text-base">
      Choose a contact to start your conversation
    </p>
  </div>
  <MessageTemplateDialog
    v-model="showMessageTemplate"
    @hide="showMessageTemplate = false"
    @send="sendMessageTemplate"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUpdated } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import { format, differenceInDays, isToday } from "date-fns";
import useMessagingStore from "src/stores/modules/messaging";
import { getChatName } from "src/utils/trim-word";
import { updateChatStatus, startNewChat } from "src/api/messaging";
import { ChatTypes } from "src/constants/ChatKeyword";
import ChatConversationButton from "./ChatConversationButton.vue";
import {
  Direction,
  Product,
  MessageType,
  Member,
  Message,
  MessageStatus,
  SendMessageStatus,
} from "src/types/MessagingTypes";
import { Loading, Notify } from "quasar";
import useUserInfoStore from "src/stores/modules/userInfo";
import MessageTemplateDialog from "src/components/Messaging/MessageTemplateDialog.vue";
import useCustomerStore from "src/stores/modules/customer";
import MessageItem from "./MessageItem.vue";
import Recorder from "./Recorder";
console.log(Recorder);

interface ActionChat {
  index: number;
  top: number | undefined;
  left: number | undefined;
}

const scrollAreaRef = ref<HTMLDivElement>();
const message: Ref<string> = ref("");
// const sendLoading: Ref<boolean> = ref(false);
const isChatExpired: Ref<boolean> = ref(true);
const isTemplate: Ref<boolean> = ref(false);
const templateName: Ref<string> = ref("");
const language: Ref<string> = ref("");
const isIncludeComponent: Ref<boolean> = ref(false);
const showMessageTemplate: Ref<boolean> = ref(false);
const activeAction: Ref<ActionChat | null> = ref(null);
const uplader: any = ref(null);
// const newMessage: Ref<Message> = ref(null);
// const { recOpen, recStart, recStop } = recorder();
// recOpen();
const messagingStore = useMessagingStore();
const userInfoStore = useUserInfoStore();
const customerStore = useCustomerStore();
const { getCustomer } = storeToRefs(customerStore);

const { getSelectedChat, getSelectedChatId, cachedChatMessages } =
  storeToRefs(messagingStore);

const name = computed<string>(() => {
  return getChatName(getSelectedChat.value);
});

const chatNumber = computed<string>(() =>
  getSelectedChat.value.name.replace(/[^\d]/g, "")
);

const members = computed<Member[]>(() =>
  JSON.parse(getSelectedChat.value.members)
);

const messages = computed<Message[]>(() => {
  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  return (
    cachedMessage?.map((message, index) => {
      return {
        ...message,
        content:
          typeof message.content === "object"
            ? message.content
            : {
                text: message.content,
                type: message.type,
              },
        old_date_created: cachedMessage[index - 1]?.date_created || null,
      };
    }) || []
  );
});

// Watch
watch(messages, () => {
  scrollToBottom();
});

watch(
  () => getSelectedChat.value,
  (val) => {
    const lastMessage = JSON.parse(val?.last_message);
    if (lastMessage.date_created) {
      const differenceDate: number = differenceInDays(
        new Date(lastMessage.date_created),
        new Date()
      );

      isChatExpired.value = differenceDate < 0;
      message.value = "";
    }
  }
);

const scrollToBottom = async () => {
  await nextTick();
  if (!scrollAreaRef.value) return;
  scrollAreaRef.value.scrollTop = scrollAreaRef.value?.scrollHeight;
};

const closeChat = async () => {
  messagingStore.setSelectedChatId("");
  messagingStore.setLeftDrawerOpen(true);
};

const initialName = (name: string) => {
  const firstName = name.split(" ")[0];
  let initial = firstName.charAt(0).toUpperCase();

  if (name.split(" ").length !== 1) {
    const lastName = name.split(" ")[1];
    initial += lastName.charAt(0).toUpperCase();
  }
  return initial;
};

const showCustomerInfoInMobile = () => {
  if (window.innerWidth < 1024) {
    messagingStore.setRightDrawerOpen(false);
  }
};

const sendMessage = async () => {
  // need opimise
  if (!message.value.length) return;
  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  const tempId = Date.now();
  const newMessage = {
    id: tempId,
    content: message.value,
    status: MessageStatus.SENT,
    type: MessageType.TEXT,
    direction: Direction.OUTGOING,
    date_created: new Date().toUTCString(),
    sendMessageStatus: SendMessageStatus.PENDING,
  };
  cachedMessage.push(newMessage);
  message.value = "";
  isChatExpired.value = false;
  try {
    if (messages.value.length > 0) {
      const { data, status } = await messagingStore.sendChatTextMessage({
        chatId: getSelectedChatId.value,
        messageProduct: Product.WHATSAPP,
        to: chatNumber.value,
        type: isTemplate.value ? MessageType.TEMPLATE : MessageType.TEXT,
        messageBody: newMessage.content,
        isTemplate: isTemplate.value,
        templateName: templateName.value,
        language: language.value,
        isIncludedComponent: isIncludeComponent.value,
      });
      const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
      const addMessage: any = cachedMessage.find((item) => item.id === tempId);
      if (!status) {
        addMessage.sendMessageStatus = SendMessageStatus.FAILURE;
        Notify.create({
          position: "top",
          message: data.message,
          color: "purple",
        });
      } else {
        addMessage.id = data.derp_chats_messages_id;
        addMessage.sendMessageStatus = SendMessageStatus.DEFAULT;
        // may need date_created backend
        let lastmessage: any = getSelectedChat.value.last_message;
        if (lastmessage) {
          lastmessage = JSON.parse(lastmessage);
          lastmessage.content = newMessage.content;
          lastmessage.date_created = new Date().toUTCString();
          getSelectedChat.value.last_message = JSON.stringify(lastmessage);
        }
      }
    } else {
      // what this part for ???
      startNewChat(getCustomer.value.id);
      messagingStore.fetchChats();
      messagingStore.setSelectedTab(ChatTypes.ONGOING);
      // emit("newChatCreated", ChatTypes.ONGOING);
    }
    isTemplate.value = false;
  } catch (error) {
    const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
    const addMessage: any = cachedMessage.find((item) => item.id === tempId);
    addMessage.sendMessageStatus = SendMessageStatus.FAILURE;
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
    console.log(error);
  }
};

const activateChat = async () => {
  try {
    const chatId = getSelectedChat.value.id;
    const userId: any | null = userInfoStore.getUserProfile;
    Loading.show();
    await updateChatStatus(chatId, userId?.id);
    Notify.create({
      position: "top",
      message:
        "The chat has been taken by you, now you can message the customer",
      color: "primary",
      type: "positive",
    });
    Loading.hide();
    messagingStore.setSelectedTab(ChatTypes.ONGOING);
    messagingStore.setChatStatus(getSelectedChatId.value, ChatTypes.ONGOING);
    // emit("newChatCreated", ChatTypes.ONGOING);
  } catch (e) {
    Loading.hide();
  }
};

const sendMessageTemplate = (
  name: string,
  msg: string,
  lang: string,
  isIncComponent: boolean
) => {
  templateName.value = name;
  message.value = msg;
  language.value = lang;
  isTemplate.value = true;
  isIncludeComponent.value = isIncComponent;
  sendMessage();
};

const showActionChat = (index: number) => {
  if (activeAction.value !== null && activeAction.value?.index === index) {
    activeAction.value = null;
  } else {
    const rec = document
      ?.getElementById(`chat-action-${index}`)
      ?.getBoundingClientRect();

    const rec2 = document
      ?.getElementById(`parentChatList`)
      ?.getBoundingClientRect();

    activeAction.value = {
      index,
      top: rec?.top - 200 + scrollAreaRef.value?.scrollTop,
      left: rec?.left - rec2?.left - 30,
    };
  }
};

const handleScroll = () => {
  activeAction.value = null;
};

onMounted(() => {
  scrollToBottom();
  scrollAreaRef.value.addEventListener("scroll", handleScroll);
});

onUpdated(() => {
  scrollAreaRef.value.addEventListener("scroll", handleScroll);
});
</script>
