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
        {{ initialName(member.name) }}
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
        <q-infinite-scroll @load="loadMessage" reverse>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner color="primary" name="dots" size="40px" />
            </div>
          </template>
          <q-chat-message
            v-for="item in messages"
            :key="item.id"
            :sent="item.direction === Direction.OUTGOING"
            text-color="white"
            :bg-color="
              item.direction === Direction.OUTGOING ? 'primary' : 'grey-1'
            "
          >
            <template #default
              ><span>{{ item.content }}</span></template
            >
            <template v-slot:stamp>{{
              format(new Date(item.date_created), "p")
            }}</template>
            <template v-slot:avatar>
              <img
                class="q-message-avatar"
                :class="`q-message-avatar--${
                  item.direction === Direction.OUTGOING ? 'sent' : 'received'
                }`"
                src="https://cdn.quasar.dev/img/avatar4.jpg"
              />
            </template>
          </q-chat-message>
        </q-infinite-scroll>
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
          />
          <div class="row justify-end q-mt-md">
            <q-btn
              color="primary"
              label="Send"
              class="dark-btn"
              :disable="isChatExpired"
              @click="sendMessage"
              :loading="sendLoading"
            />
          </div>
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
// import { format, differenceInDays, isToday } from "date-fns";
import { differenceInDays, format } from "date-fns";
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
} from "src/types/MessagingTypes";
// import { Direction, Product, MessageType } from "src/types/MessagingTypes";
import { Loading, Notify } from "quasar";
import useUserInfoStore from "src/stores/modules/userInfo";
import MessageTemplateDialog from "src/components/Messaging/MessageTemplateDialog.vue";
import useCustomerStore from "src/stores/modules/customer";

interface Message {
  id: number;
  content: string;
  direction?: string;
  status: string;
  old_date_created: string | null;
  date_created: string;
}

interface ActionChat {
  index: number;
  top: number | undefined;
  left: number | undefined;
}

const scrollAreaRef = ref<HTMLDivElement>();
const message: Ref<string> = ref("");
const sendLoading: Ref<boolean> = ref(false);
const isChatExpired: Ref<boolean> = ref(true);
const isTemplate: Ref<boolean> = ref(false);
const templateName: Ref<string> = ref("");
const language: Ref<string> = ref("");
const isIncludeComponent: Ref<boolean> = ref(false);
const showMessageTemplate: Ref<boolean> = ref(false);
const activeAction: Ref<ActionChat | null> = ref(null);

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
    cachedMessage?.map((message, index) => ({
      id: message.id,
      content: message.content,
      direction: message.direction,
      status: message.status,
      old_date_created: cachedMessage[index - 1]?.date_created || null,
      date_created: message.date_created,
    })) || []
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
  messagingStore.setLeftDrawerOpen(true);
  messagingStore.setRightDrawerOpen(false);
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
  isChatExpired.value = false;
  try {
    if (sendLoading.value || message.value.length < 1) return;
    sendLoading.value = true;
    if (messages.value.length > 0) {
      const data = await messagingStore.sendChatTextMessage({
        chatId: getSelectedChatId.value,
        messageProduct: Product.WHATSAPP,
        to: chatNumber.value,
        type: isTemplate.value ? MessageType.TEMPLATE : MessageType.TEXT,
        messageBody: message.value,
        isTemplate: isTemplate.value,
        templateName: templateName.value,
        language: language.value,
        isIncludedComponent: isIncludeComponent.value,
      });

      if (!data.status) {
        Notify.create({
          position: "top",
          message: data.message,
          color: "purple",
        });
      }
    } else {
      // what this part for ???
      startNewChat(getCustomer.value.id);
      messagingStore.fetchChats();
      messagingStore.setSelectedTab(ChatTypes.ONGOING);
      // emit("newChatCreated", ChatTypes.ONGOING);
    }
    sendLoading.value = false;
    message.value = "";
    isTemplate.value = false;
  } catch (error) {
    sendLoading.value = false;
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

// const showActionChat = (index: number) => {
//   if (activeAction.value !== null && activeAction.value?.index === index) {
//     activeAction.value = null;
//   } else {
//     const rec = document
//       ?.getElementById(`chat-action-${index}`)
//       ?.getBoundingClientRect();

//     const rec2 = document
//       ?.getElementById(`parentChatList`)
//       ?.getBoundingClientRect();

//     activeAction.value = {
//       index,
//       top: rec?.top - 200 + scrollAreaRef.value?.scrollTop,
//       left: rec?.left - rec2?.left - 30,
//     };
//   }
// };

// const handleScroll = () => {
//   activeAction.value = null;
// };

const loadMessage = (index: number, done: () => void) => {
  console.log(index, done);
  // done();
};

onMounted(() => {
  scrollToBottom();
  // scrollAreaRef.value.addEventListener("scroll", handleScroll);
});

onUpdated(() => {
  // scrollAreaRef.value.addEventListener("scroll", handleScroll);
});
</script>
