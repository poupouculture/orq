<template>
  <div
    v-if="getSelectedChatId"
    class="h-full w-full flex flex-col q-pa-md bg-white"
  >
    <header
      class="pt-1 pb-2 px-2 bg-white w-full justify-between items-center flex"
    >
      <div
        class="flex items-center space-x-3 cursor-pointer"
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
      <q-btn
        class="cursor-pointer lg:hidden max-[1023]:block"
        @click="closeChat"
        style="color: #64748b"
        flat
        round
        icon="close"
      />
    </header>
    <div class="p-2 text-gray-400">Members</div>
    <div class="flex p-2 justify-between">
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
      <ChatConversationButton
        v-if="getSelectedChat.status !== ChatTypes.CLOSED"
      />
    </div>
    <q-separator class="mx-2" size="1px" inset />
    <!-- message content -->
    <main class="flex-1 relative z-10 w-full h-full">
      <div
        class="absolute top-0 scrollbar h-full overflow-y-auto w-full z-50 pt-3 px-2 scroll_area"
        ref="scrollAreaRef"
      >
        <q-infinite-scroll
          :key="getSelectedChatId"
          ref="infiniteScrollRef"
          @load="loadMore"
          :initial-index="0"
          reverse
          :offset="300"
          scroll-target=".scroll_area"
        >
          <ChatMessage
            v-for="item in messages"
            :key="item.id"
            :message="item"
          />
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
        <div class="relative rounded-xl overflow-hidden">
          <q-input
            v-model="message"
            placeholder="Enter reply information"
            dense
            borderless
            bg-color="grey-2"
            type="textarea"
            input-class="px-4 py-4 h-10 sm:h-auto"
            :class="{ invisible: showAudio }"
            @keypress.enter.prevent="sendMessage"
            :disable="isChatExpired"
          />
          <div
            ref="waveRef"
            :class="{ invisible: !showAudio }"
            class="absolute inset-0 bg-primary"
          ></div>
          <span
            class="absolute right-0 bottom-0 text-white p-2"
            :class="{ invisible: !showAudio }"
            >{{ time }} ms</span
          >
        </div>
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
              :filter="imageSizeFilter"
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
  <!-- empty -->
  <div v-else class="flex flex-col justify-center items-center h-full">
    <img class="" src="~assets/images/startchat.png" />
    <p class="text-[#9A9AAF] font-medium text-base">
      Choose a contact to start your conversation
    </p>
  </div>
  <!-- template -->
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
  onBeforeUnmount,
  reactive,
  inject,
} from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import { format, isSameDay, isToday, differenceInDays } from "date-fns";
import Recorder from "recorder-core";
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";
import "recorder-core/src/extensions/wavesurfer.view.js";
import useMessagingStore from "src/stores/modules/messaging";
import { getChatName, uuid } from "src/utils/trim-word";
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
import ChatMessage from "./ChatMessage.vue";
interface HasMore {
  [key: string]: boolean;
}
const scrollAreaRef = ref<HTMLDivElement>();
const infiniteScrollRef = ref<HTMLDivElement>();
const message: Ref<string> = ref("");
const isChatExpired: Ref<boolean> = ref(true);
const isTemplate: Ref<boolean> = ref(false);
const templateName: Ref<string> = ref("");
const language: Ref<string> = ref("");
const isIncludeComponent: Ref<boolean> = ref(false);
const showMessageTemplate: Ref<boolean> = ref(false);
const uplader: any = ref(null);
const rec: any = ref(null);
const wave: any = ref(null);
const waveRef: any = ref(null);
const showAudio = ref(false);
const time = ref(0);
const audioData = ref();
const messagingStore = useMessagingStore();
const userInfoStore = useUserInfoStore();
const customerStore = useCustomerStore();
const { getCustomer } = storeToRefs(customerStore);
const hasMoreMessage: HasMore = reactive({});
const rightDrawerOpen: any = inject("rightDrawerOpen");
const leftDrawerOpen: any = inject("leftDrawerOpen");
const { getSelectedChat, getSelectedChatId, cachedChatMessages } =
  storeToRefs(messagingStore);

const name = computed<string>(() => {
  return getChatName(getSelectedChat.value);
});

const chatNumber = computed<string>(() =>
  getSelectedChat.value.name.replace(/[^\d]/g, "")
);

const members = computed<Member[]>(
  () => JSON.parse(getSelectedChat.value.members) || []
);

const messages = computed<Message[]>(() => {
  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  return (
    cachedMessage?.map((message, index) => {
      return {
        ...message,
        label:
          index > 0 &&
          isSameDay(
            new Date(message.date_created),
            new Date(cachedMessage[index - 1]?.date_created)
          )
            ? ""
            : isToday(new Date(message.date_created))
            ? "Today"
            : format(new Date(message.date_created), "eee, d MMM"),
      };
    }) || []
  );
});

const loadMore = async (index: number, done: (stop?: boolean) => void) => {
  if (hasMoreMessage?.[getSelectedChatId.value] === false) {
    infiniteScrollRef.value?.stop();
    return;
  }
  const hasmore = await messagingStore.fetchChatMessagesById(
    getSelectedChatId.value,
    index
  );
  hasMoreMessage[getSelectedChatId.value] = !!hasmore;
  done(!hasmore);
};

watch(
  () => getSelectedChat.value?.last_message,
  async (val) => {
    message.value = "";
    const createDate = val?.date_created;
    if (createDate) {
      isChatExpired.value =
        differenceInDays(new Date(), new Date(createDate)) > 0;
    } else {
      isChatExpired.value = true;
    }
  }
);

watch(
  () => getSelectedChat.value.status,
  async (val) => {
    if (val === ChatTypes.ONGOING) {
      await nextTick();
      wave.value = Recorder.WaveSurferView({
        elem: waveRef.value,
        scale: 1,
      });
      recOpen();
    }
  }
);

const scrollToBottom = async () => {
  await nextTick();
  if (!scrollAreaRef.value) return;
  scrollAreaRef.value.scrollTop = scrollAreaRef.value?.scrollHeight;
};

const closeChat = async () => {
  leftDrawerOpen.value = true;
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
  rightDrawerOpen.value = !rightDrawerOpen.value;
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
      const data = await messagingStore.sendChatTextMessage({
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
      if (!data.status) {
        addMessage.sendMessageStatus = SendMessageStatus.FAILURE;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
        // Notify.create({
        //   message: data.message,
        //   type: "negative",
        //   color: "purple",
        //   position: "top",
        // });
      } else {
        addMessage.id = data.data.derp_chats_messages_id;
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
  message.value = msg.replace("\n", "");
  language.value = lang;
  isTemplate.value = true;
  isIncludeComponent.value = isIncComponent;
  sendMessage();
};

const sendMedia = async (blob: Blob) => {
  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  const tempId = Date.now();
  const newMessage = {
    id: tempId,
    content: {
      url: audioData.value,
      type: MessageType.AUDIO,
      duration: time.value,
      local: true,
    },
    status: MessageStatus.SENT,
    type: MessageType.AUDIO,
    direction: Direction.OUTGOING,
    date_created: new Date().toUTCString(),
    sendMessageStatus: SendMessageStatus.PENDING,
  };
  cachedMessage.push(newMessage);
  scrollToBottom();
  const filename = uuid();
  const bodyFormData = new FormData();
  const file = new window.File([blob], filename, { type: "audio/ogg" });
  bodyFormData.append("caption", filename);
  bodyFormData.append("file", file);
  const data = await uploadMedia(getSelectedChatId.value, bodyFormData);
  const cm: any = cachedMessage.find((item) => item.id === tempId);
  cm.sendMessageStatus = SendMessageStatus.DEFAULT;
  cm.id = data.derp_chats_messages_id;
  console.log(2);
};

const recOpen = function (success?: () => void) {
  if (rec.value) return;
  rec.value = Recorder({
    type: "mp3",
    sampleRate: 16000,
    bitRate: 16,
    onProcess: (
      buffers: Buffer,
      powerLevel: number,
      bufferDuration: number,
      sampleRate: number // buffers: Buffer, // powerLevel: number, // bufferDuration: number, // bufferSampleRate: number, // newBufferIdx: Buffer, // asyncEnd: any
    ) => {
      wave.value.input(buffers[buffers.length - 1], powerLevel, sampleRate);
      time.value = bufferDuration;
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
  showAudio.value = true;
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
      showAudio.value = false;
      time.value = duration;
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

const upload = async (fileList: any) => {
  const file = fileList[0];
  const url = (window.URL || window.webkitURL).createObjectURL(file);
  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  const tempId = Date.now();
  const newMessage = {
    id: tempId,
    content: {
      url,
      type: MessageType.IMAGE,
      duration: time.value,
      local: true,
    },
    status: MessageStatus.SENT,
    type: MessageType.IMAGE,
    direction: Direction.OUTGOING,
    date_created: new Date().toUTCString(),
    sendMessageStatus: SendMessageStatus.PENDING,
  };
  cachedMessage.push(newMessage);
  scrollToBottom();
  const bodyFormData = new FormData();
  bodyFormData.append("caption", file.name);
  bodyFormData.append("file", file);
  uplader.value.reset();
  const data = await uploadMedia(getSelectedChatId.value, bodyFormData);
  const cm: any = cachedMessage.find((item) => item.id === tempId);
  cm.sendMessageStatus = SendMessageStatus.DEFAULT;
  cm.id = data.derp_chats_messages_id;
};

const imageSizeFilter = (files: any[]) => {
  const filterFiles = files.filter((file) => file.size <= 1024 * 1024 * 5);
  if (!filterFiles.length) {
    Notify.create({
      message: "Image cannot exceed 5M",
      type: "negative",
      color: "purple",
      position: "top",
    });
  }

  return filterFiles;
};

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
