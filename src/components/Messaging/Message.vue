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
          <img :src="profileIcon" />
        </q-avatar>
        <div class="flex flex-col">
          <p class="font-semibold text-lg">{{ nameEn }}</p>
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
    <template v-if="isBot">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-3 cursor-pointer p-2">
          <q-avatar size="md" class="rounded-avatar">
            <img src="~assets/images/bot.svg" />
          </q-avatar>
          <div class="flex flex-col">
            <p class="font-semibold text-lg">Chatbot</p>
            <p class="flex items-center text-gray-500">
              <q-badge
                class="mr-1 scale-75 origin-center"
                rounded
                color="green"
              />
              online
            </p>
          </div>
        </div>
        <q-btn color="primary" label="End Bot" @click="confirmCloseBot()" />
      </div>
    </template>
    <template v-else>
      <div class="p-2 text-gray-400">Members</div>
      <div class="flex justify-between p-2">
        <div class="flex">
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
      </div>
    </template>

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
              <q-spinner-dots color="primary" name="dots" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </main>
    <!-- footer -->
    <footer class="q-pa-xs q-pb-xs bg-white w-full px-2 pt-2.5">
      <div v-if="getSelectedChat.status === ChatTypes.ONGOING">
        <div
          class="relative rounded-xl overflow-hidden px-4 py-4 sm:h-auto bg-grey-2"
        >
          <ChatMessage
            v-if="replayMessage?.id"
            :message="replayMessage"
            isReply
          />
          <q-input
            v-model="message"
            placeholder="Enter reply information"
            dense
            borderless
            type="textarea"
            :class="{ invisible: showAudio }"
            input-class="h-10"
            @keypress.enter.prevent="sendMessage"
            :disable="isChatExpired"
            @paste="onPast"
          />
          <div
            ref="waveRef"
            :class="{ invisible: !showAudio }"
            class="absolute inset-0 bg-primary"
          />
          <span
            class="absolute right-0 bottom-0 text-white p-2"
            :class="{ invisible: !showAudio }"
            >{{ time }} ms</span
          >
        </div>

        <div class="row justify-end">
          <div class="flex gap-3">
            <q-btn
              flat
              round
              size="md"
              class="q-mt-md"
              :disable="isChatExpired"
            >
              <img src="~assets/images/bot.svg" />
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <q-item
                    v-for="item in botList"
                    :key="item.text"
                    clickable
                    v-close-popup
                    @click="selectBot(item)"
                  >
                    <q-item-section>{{ item.name }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <q-btn
            flat
            round
            color="grey"
            icon="mic"
            size="md"
            :disable="isChatExpired"
            class="q-mt-md active:bg-primary mic-recorder"
            @mousedown.prevent="recStart"
            @touchstart.prevent="recStart"
            @mouseup.prevent="recStop"
            @touchend.prevent="recStop"
          />
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
            :disable="isChatExpired"
            @click="showMessageImage = true"
          />

          <q-btn
            flat
            round
            color="grey"
            size="md"
            class="q-mt-md"
            :disable="isChatExpired"
            @click="fileUplader?.pickFiles"
          >
            <img src="~assets/images/pin.svg" />
            <q-uploader
              ref="fileUplader"
              accept="*"
              class="hidden invisible"
              :filter="fileFilter"
              @added="uploadFile"
            />
          </q-btn>
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
  <MessageImageDialog
    ref="messageImageDialogRef"
    v-model="showMessageImage"
    @hide="showMessageImage = false"
    @send="upload"
  />
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  nextTick,
  onBeforeUnmount,
  onMounted,
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
import { getChatNameEn, uuid, blobToBase64 } from "src/utils/trim-word";
import {
  updateChatStatus,
  uploadMedia,
  chatbots,
  initiateBot,
  closeBot,
} from "src/api/messaging";
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
import { Dialog, Loading, Notify } from "quasar";
import useUserInfoStore from "src/stores/modules/userInfo";
import MessageTemplateDialog from "src/components/Messaging/MessageTemplateDialog.vue";
import MessageImageDialog from "src/components/Messaging/MessageImageDialog.vue";
import ChatMessage from "./ChatMessage.vue";
import profileIcon from "src/assets/images/profileicon.svg";

interface HasMore {
  [key: string]: boolean;
}

const FileLimit = [
  {
    name: "Image",
    type: "image/",
    limit: 5,
  },
  {
    name: "Video",
    type: "video/",
    limit: 16,
  },
  {
    name: "Audio",
    type: "audio/",
    limit: 16,
  },
  // others
  // {
  //   name: "Document",
  //   type: "document",
  //   limit: 100,
  // },
];

// State
const scrollAreaRef = ref<HTMLDivElement>();
const infiniteScrollRef = ref<any>();
const message: Ref<string> = ref("");
const isChatExpired: Ref<boolean> = ref(true);
const isTemplate: Ref<boolean> = ref(false);
const templateName: Ref<string> = ref("");
const language: Ref<string> = ref("");
const isIncludeComponent: Ref<boolean> = ref(false);
const showMessageTemplate: Ref<boolean> = ref(false);
const showMessageImage: Ref<boolean> = ref(false);
const paramsCount: Ref<any[]> = ref([]);
const headerType: Ref<string> = ref("TEXT");
const fileUplader: any = ref(null);
const rec: any = ref(null);
const wave: any = ref(null);
const waveRef: any = ref(null);
const showAudio = ref(false);
const time = ref(0);
const audioData = ref();
const messagingStore = useMessagingStore();
const userInfoStore = useUserInfoStore();
const hasMoreMessage: HasMore = reactive({});
const rightDrawerOpen: any = inject("rightDrawerOpen");
const leftDrawerOpen: any = inject("leftDrawerOpen");
const botList: Ref<any[]> = ref([]);
const messageImageDialogRef = ref();
const {
  getSelectedChat,
  getSelectedChatId,
  cachedChatMessages,
  replayMessage,
} = storeToRefs(messagingStore);

const nameEn = computed<string>(() => {
  return getChatNameEn(getSelectedChat.value);
});

const chatNumber = computed<string>(() =>
  getSelectedChat.value.name.replace(/[^\d]/g, "")
);

const members = computed<Member[]>(
  () => JSON.parse(getSelectedChat.value.members) || []
);

const messages = computed<Message[]>(() => {
  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  scrollToBottom();
  return cachedMessage?.map((message, index) => {
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
  });
});

const isBot = computed<boolean>(() => getSelectedChat.value.mode === "Bot");

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

watch(getSelectedChatId, () => {
  messagingStore.setReplayMessage();
  message.value = "";
});

watch(
  () => getSelectedChat.value?.last_message,
  async (val) => {
    const createDate = val?.date_created;
    if (createDate) {
      isChatExpired.value =
        differenceInDays(new Date(), new Date(createDate)) > 0;
    } else {
      isChatExpired.value = true;
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

const messageCallback = async (data: any, newMessage: any) => {
  if (!data.status) {
    newMessage.sendMessageStatus = SendMessageStatus.FAILURE;
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: data.message,
    });
  } else {
    const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
    const index = cachedMessage.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      cachedMessage.splice(index, 1);
    }
    if (cachedMessage) data = data.data || data;
    newMessage.id = data.derp_chats_messages_id;
    newMessage.sendMessageStatus = SendMessageStatus.DEFAULT;
    newMessage.waba_message_id = data.waba_message_id;
  }
};

const sendMessage = async () => {
  if (!message.value.length) return;
  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  const tempId = Date.now();
  const newMessage = reactive({
    id: tempId,
    content: message.value,
    status: MessageStatus.SENT,
    type: MessageType.TEXT,
    direction: Direction.OUTGOING,
    date_created: new Date().toUTCString(),
    sendMessageStatus: SendMessageStatus.PENDING,
    waba_message_id: "",
  });
  cachedMessage.push(newMessage);
  const wabaMessageId =
    replayMessage.value?.waba_message_id || replayMessage.value?.message_id;

  scrollToBottom();
  messagingStore.setReplayMessage();
  message.value = "";
  isChatExpired.value = false;

  try {
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
      countParams: paramsCount.value,
      headerType: headerType.value,
      messageId: wabaMessageId,
    });
    messageCallback(data, newMessage);
    isTemplate.value = false;
  } catch (error) {
    newMessage.sendMessageStatus = SendMessageStatus.FAILURE;
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
    // Notify.create({
    //   position: "top",
    //   message:
    //     "The chat has been taken by you, now you can message the customer",
    //   color: "primary",
    //   type: "positive",
    // });

    Loading.hide();
    messagingStore.setSelectedTab(ChatTypes.ONGOING);
    // messagingStore.setChatStatus(getSelectedChatId.value, ChatTypes.ONGOING);
    // emit("newChatCreated", ChatTypes.ONGOING);
  } catch (e) {
    Loading.hide();
  }
};

const sendMessageTemplate = (
  name: string,
  msg: string,
  lang: string,
  isIncComponent: boolean,
  componentCount: any[],
  headType: string
) => {
  templateName.value = name;
  message.value = msg.replace("\n", "");
  language.value = lang;
  isTemplate.value = true;
  isIncludeComponent.value = isIncComponent;
  paramsCount.value = componentCount;
  headerType.value = headType;
  sendMessage();
};

const sendMedia = async (blob: Blob) => {
  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  const tempId = Date.now();
  const newMessage = reactive({
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
  });
  cachedMessage.push(newMessage);
  scrollToBottom();
  messagingStore.setReplayMessage();
  const filename = uuid();
  const bodyFormData = new FormData();
  const file = new window.File([blob], filename, { type: "audio/mpeg" });
  // bodyFormData.append("caption", filename);
  bodyFormData.append("file", file);
  const data = await uploadMedia(getSelectedChatId.value, bodyFormData);
  messageCallback(data, newMessage);
};

const recStart = function () {
  showAudio.value = true;
  if (!wave.value) {
    wave.value = Recorder.WaveSurferView({
      elem: waveRef.value,
    });
  }
  rec.value = Recorder({
    type: "mp3",
    sampleRate: 16000,
    bitRate: 16,
    onProcess: (
      buffers: Buffer,
      powerLevel: number,
      bufferDuration: number,
      sampleRate: number
    ) => {
      console.log(11111);

      wave.value.input(buffers[buffers.length - 1], powerLevel, sampleRate);
      time.value = bufferDuration;
    },
  });

  rec.value.open(function () {
    console.log(22222);
    rec.value.start();
  });
};

function recStop() {
  rec.value.stop(
    function (blob: Blob, duration: number) {
      rec.value.close();
      showAudio.value = false;
      if (duration < 500) return;
      time.value = duration;
      audioData.value = (window.URL || window.webkitURL).createObjectURL(blob);
      sendMedia(blob);
      // wave.value?.ctx2.clearRect(
      //   0,
      //   0,
      //   wave.value?.canvas2.width,
      //   wave.value?.canvas2.height
      // );
    },
    function () {
      showAudio.value = false;
      rec.value.close();
      rec.value = null;
    }
  );
}
/** close recorder **/
function recClose() {
  rec.value && rec.value.close();
  rec.value = null;
  showAudio.value = false;
}

const upload = async (fileList: readonly File[], caption: string) => {
  const file = fileList[0];
  const url = await blobToBase64(file);
  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  const newMessage = reactive({
    id: Date.now(),
    content: {
      url,
      type: MessageType.IMAGE,
      duration: time.value,
      local: true,
      caption,
    },
    status: MessageStatus.SENT,
    direction: Direction.OUTGOING,
    date_created: new Date().toUTCString(),
    sendMessageStatus: SendMessageStatus.PENDING,
  });

  cachedMessage.push(newMessage);
  scrollToBottom();
  messagingStore.setReplayMessage();
  const bodyFormData = new FormData();
  bodyFormData.append("caption", caption);
  bodyFormData.append("file", file);
  // uplader.value.removeQueuedFiles();
  const { data } = await uploadMedia(getSelectedChatId.value, bodyFormData);
  messageCallback(data, newMessage);
};

const uploadFile = async (files: readonly File[]) => {
  const file = files[0];
  console.log(file.name, file.type);
  getLimitByType(file.type);
  if (!file) return;

  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  const newMessage = reactive({
    id: Date.now(),
    content: {
      url: "",
      type: MessageType.DOCUMENT,
      duration: time.value,
      local: true,
      media_id: file.name,
    },
    status: MessageStatus.SENT,
    direction: Direction.OUTGOING,
    date_created: new Date().toUTCString(),
    sendMessageStatus: SendMessageStatus.PENDING,
  });
  cachedMessage.push(newMessage);
  scrollToBottom();
  messagingStore.setReplayMessage();
  const bodyFormData = new FormData();
  // bodyFormData.append("caption", file.name);
  bodyFormData.append("file", file);
  fileUplader.value?.removeQueuedFiles();
  const { data } = await uploadMedia(getSelectedChatId.value, bodyFormData);
  messageCallback(data, newMessage);
};

const getLimitByType = (type: string) => {
  const fileData = FileLimit.find((item) => type.startsWith(item.type)) || {
    name: "Document",
    type: "document",
    limit: 100,
  };
  return fileData;
};

const fileFilter = (files: readonly any[] | FileList) => {
  const filterFiles = [];
  let fileData;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    fileData = getLimitByType(file.type);
    if (file.size <= fileData.limit * 1024 * 1024) {
      filterFiles.push(file);
    }
  }

  if (!filterFiles.length) {
    Notify.create({
      message: `${fileData?.name} cannot exceed ${fileData?.limit}MB`,
      type: "negative",
      color: "purple",
      position: "top",
    });
  }

  return filterFiles;
};

const selectBot = async (bot: any) => {
  const { status } = await initiateBot(
    getSelectedChatId.value,
    bot.trigger_intent
  );
  if (status) {
    Notify.create({
      message: "Bot initiated",
      color: "blue-9",
      position: "top",
      type: "positive",
    });
    getSelectedChat.value.mode = "Bot";
  }
};

const getChatbots = async () => {
  const { data } = await chatbots();
  botList.value = data;
};

const confirmCloseBot = () => {
  Dialog.create({
    title: "End Bot",
    message: "Are you sure you want to end bot?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    onCloseBot();
  });
};
const onCloseBot = async () => {
  await closeBot(getSelectedChatId.value);
  Notify.create({
    message: "The chatbot has been ended",
    color: "blue-9",
    position: "top",
    type: "positive",
  });
  getSelectedChat.value.mode = "";
};

const onPast = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items || [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      const file = items[i].getAsFile();
      showMessageImage.value = true;
      nextTick(() => {
        messageImageDialogRef.value.preview([file]);
      });
    }
  }
};

onMounted(() => {
  getChatbots();
});

onBeforeUnmount(() => {
  recClose();
});
</script>

<style lang="scss" scoped>
.mic-recorder {
  -webkit-touch-callout: none !important;
  user-select: none;
  -webkit-user-select: none;
}
</style>
