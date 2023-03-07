<template>
  <div
    v-if="getSelectedChatId"
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
      class="pb-2 border-b"
      v-if="getSelectedChat.status !== ChatTypes.CLOSED"
    />
    <!-- message content -->
    <main class="flex-1 relative z-10 w-full h-full">
      <div
        class="absolute top-0 scrollbar h-full overflow-y-auto w-full z-50 pt-3 px-2"
        ref="scrollAreaRef"
      >
        <q-infinite-scroll
          :key="getSelectedChatId"
          ref="infiniteScrollRef"
          @load="loadMore"
          :initialIndex="0"
          :reverse="true"
          :scroll-target="scrollAreaRef"
        >
          <q-chat-message
            v-for="item in messages"
            :key="item.id"
            class="pb-4"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            :sent="item.direction === Direction.OUTGOING"
          >
            <MessageItem
              :content="item.content"
              :sendMessageStatus="item.sendMessageStatus"
            />
            <template #label>{{ item.label }}</template>
            <template #stamp>
              <span>{{ format(new Date(item.date_created), "p") }}</span>
            </template>
          </q-chat-message>
          <template #loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots
                color="primary"
                name="dots"
                size="40px"
              ></q-spinner-dots>
            </div>
          </template>
        </q-infinite-scroll>
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
              accept=".gif, .jpg, .jpeg, .png, image/*"
              class="hidden invisible"
              @added="upload"
            />
          </q-btn>
          <q-btn
            flat
            round
            color="grey"
            icon="mic"
            size="md"
            class="q-mt-md active:bg-primary mic-recorder"
            @touchstart.prevent="recStart"
            @touchend.prevent="recStop"
            @mousedown="recStart"
            @mouseup="recStop"
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
  <div
    v-show="!getSelectedChatId"
    class="flex flex-col justify-center items-center h-full"
  >
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
import {
  computed,
  ref,
  watch,
  nextTick,
  // onMounted,
  // onUpdated,
  onBeforeUnmount,
} from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import { format, isSameDay, differenceInDays, isToday } from "date-fns";
// import { format, differenceInDays, isToday } from "date-fns";
import Recorder from "recorder-core";
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";
import useMessagingStore from "src/stores/modules/messaging";
import { getChatName } from "src/utils/trim-word";
import { updateChatStatus, startNewChat, uploadMedia } from "src/api/messaging";
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
// interface ActionChat {
//   index: number;
//   top: number | undefined;
//   left: number | undefined;
// }

const scrollAreaRef = ref<HTMLDivElement>();
const infiniteScrollRef = ref<HTMLDivElement>();

const message: Ref<string> = ref("");
// const sendLoading: Ref<boolean> = ref(false);
const isChatExpired: Ref<boolean> = ref(true);
const isTemplate: Ref<boolean> = ref(false);
const templateName: Ref<string> = ref("");
const language: Ref<string> = ref("");
const isIncludeComponent: Ref<boolean> = ref(false);
const showMessageTemplate: Ref<boolean> = ref(false);
// const activeAction: Ref<ActionChat | null> = ref(null);
const uplader: any = ref(null);
const rec: any = ref(null);
const audioData = ref();
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
        label: isSameDay(
          new Date(message.date_created),
          new Date(cachedMessage[index + 1]?.date_created)
        )
          ? ""
          : isToday(new Date(message.date_created))
          ? "Today"
          : format(new Date(message.date_created), "eee, d MMM"),
      };
    }) || []
  );
});

const loadMore = async (index: number, done: (stop: boolean) => void) => {
  const limit = 15;
  const length = await messagingStore.fetchChatMessagesById(
    getSelectedChatId.value,
    index,
    limit
  );
  const stop = length < limit;
  done(stop);
};

// Watch
// watch(
//   () => getSelectedChatId.value,
//   async () => {
//     await nextTick();
//     infiniteScrollRef.value?.resume();
// infiniteScrollRef.value?.reset();
//   }
// );

watch(
  () => getSelectedChat.value,
  (val) => {
    const lastMessage = val?.last_message;
    if (lastMessage?.date_created) {
      const differenceDate: number = differenceInDays(
        new Date(lastMessage.date_created),
        new Date()
      );

      isChatExpired.value = differenceDate < 0;
      message.value = "";
    } else {
      isChatExpired.value = false;
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
  scrollToBottom();
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
        addMessage.id = data.derp_chats_messages_id ?? data;
        addMessage.sendMessageStatus = SendMessageStatus.DEFAULT;
      }
    } else {
      startNewChat(getCustomer.value.id);
      messagingStore.fetchChats();
      messagingStore.setSelectedTab(ChatTypes.ONGOING);
    }
    isTemplate.value = false;
  } catch (error) {
    const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
    const addMessage: any = cachedMessage.find((item) => item.id === tempId);
    addMessage.sendMessageStatus = SendMessageStatus.FAILURE;
    isTemplate.value = false;
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

const sendMedia = async (blob: Blob) => {
  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  const tempId = Date.now();
  const newMessage = {
    id: tempId,
    content: {
      url: audioData.value,
      type: MessageType.AUDIO,
    },
    status: MessageStatus.SENT,
    type: MessageType.AUDIO,
    direction: Direction.OUTGOING,
    date_created: new Date().toUTCString(),
    sendMessageStatus: SendMessageStatus.PENDING,
  };
  cachedMessage.push(newMessage);
  scrollToBottom();
  const bodyFormData = new FormData();
  const file = new window.File([blob], "test.mp3", { type: "audio/mpeg" });
  bodyFormData.append("caption", "test.mp3");
  bodyFormData.append("file", file);

  const data = await uploadMedia(getSelectedChatId.value, bodyFormData);
  const cm: any = cachedMessage.find((item) => item.id === tempId);
  cm.sendMessageStatus = SendMessageStatus.DEFAULT;
  cm.id = data.derp_chats_messages_id;
};

const recOpen = function (success?: () => void) {
  rec.value = Recorder({
    type: "mp3",
    sampleRate: 16000,
    bitRate: 16,
    onProcess: function () // buffers: Buffer,
    // powerLevel: number,
    // bufferDuration: number,
    // bufferSampleRate: number,
    // newBufferIdx: Buffer,
    // asyncEnd: any
    {
      console.log(
        "录制过程"
        // buffers,
        // powerLevel,
        // bufferDuration,
        // bufferSampleRate,
        // newBufferIdx,
        // asyncEnd
      );
    },
  });

  rec.value.open(
    function () {
      success && success();
    },
    function (msg: string, isUserNotAllow: string) {
      Notify.create({
        message: isUserNotAllow
          ? "Please turn on the recording permission of the browser"
          : msg,
        type: "negative",
        color: "purple",
      });
    }
  );
};

/** start recorder **/
function recStart() {
  rec.value.start();
}

/** stop recorder **/
function recStop() {
  rec.value.stop(
    function (blob: Blob, duration: number) {
      console.log(
        blob,
        (window.URL || window.webkitURL).createObjectURL(blob),
        "时长:" + duration + "ms"
      );
      audioData.value = (window.URL || window.webkitURL).createObjectURL(blob);
      sendMedia(blob);
    },
    function (msg: string) {
      console.log("recording error:" + msg);
      rec.value.close();
      rec.value = null;
    }
  );
}
/** close recorder **/
function recClose() {
  rec.value.close();
  rec.value = null;
}
recOpen();

const upload = ([file]: any) => {
  const bodyFormData = new FormData();
  bodyFormData.append("caption", "Fred");
  bodyFormData.append("file", file);
  uploadMedia(getSelectedChatId.value, bodyFormData);
  uplader.value.reset();
};

// onMounted(() => {
//   scrollToBottom();
//   scrollAreaRef.value.addEventListener("scroll", handleScroll);
// });

// onUpdated(() => {
// scrollAreaRef.value.addEventListener("scroll", handleScroll);
// });

onBeforeUnmount(() => {
  recClose();
});
</script>

<style lang="scss" scoped>
.mic-recorder {
  -webkit-touch-callout: none !important;
  -webkit-user-select: none;
}
</style>
