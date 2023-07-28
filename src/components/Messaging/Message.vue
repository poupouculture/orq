<template>
  <div
    v-if="getSelectedChatId"
    class="h-full w-full flex flex-col md:pt-4 pt-2"
    :class="{ fixed: isMobile }"
  >
    <!-- ??? jimmy to be refactored -->
    <!-- <div
    v-if="getSelectedChatId"
    class="h-full w-full flex flex-col q-pa-md bg-white"
  > -->
    <div class="px-2 md:px-4">
      <header
        class="pt-1.5 pb-2 px-2 bg-white w-full justify-between items-end md:items-center flex cursor-pointer flex-nowrap"
        @click.stop="showCustomerInfo"
      >
        <div class="flex items-center space-x-3 flex-nowrap">
          <q-btn
            class="cursor-pointer lg:hidden"
            @click.stop="closeChat"
            style="color: #64748b"
            flat
            round
            padding="none"
            icon="arrow_back"
          />
          <q-avatar class="rounded-avatar">
            <img :src="profileIcon" />
          </q-avatar>
          <div class="flex flex-col w-full">
            <p
              class="font-semibold leading-snug pr-7 lg:pr-0"
              :class="{ 'text-md': isMobile, 'text-lg': !isMobile }"
            >
              <!-- {{ nameEn }} -->
              {{ chatName }}
            </p>
            <p class="text-gray-500">
              {{ chatNumber }} {{ contactNameGet ? `(${contactNameGet})` : "" }}
            </p>
            <!-- <p class="text-gray-500">{{ wabaChannelIdentity }}</p> -->
            <!-- <p class="text-gray-500">{{ metaPhoneNumberId }}</p> -->
          </div>
        </div>
        <!-- <q-input
          v-model="searchText"
          placeholder="Search Chat Messages..."
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon name="reorder" class="cursor-pointer" />
          </template>
        </q-input> -->
        <div>
          <img
            v-if="getSelectedChat.meta_phone_number_id !== 'ChaQ'"
            src="~assets/icons/whatsapp.svg"
            alt=""
            class="w-8 md:w-10"
          />
          <img v-else class="w-8 md:w-10" src="~assets/images/logo.svg" />
          <p class="text-gray-500">{{ channelIdentity }}</p>
        </div>
      </header>
    </div>
    <template v-if="isBot">
      <div class="flex justify-between items-center q-pa-md">
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
    <!-- <div v-else class="px-2 md:py-2 md:px-4">
      <div class="p-2 text-gray-400">Members</div>
      <div class="flex justify-between p-2 items-center">
        <div class="flex pb-3">
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

        <div v-if="!isMobile || (isMobile && showChatOption)">
          <ChatConversationButton
            v-if="getSelectedChat.status !== ChatTypes.CLOSED"
          />
        </div>
        <div v-if="isMobile && getSelectedChat.status !== ChatTypes.CLOSED">
          <div
            class="text-primary pb-3 cursor-pointer"
            @click="toogleChatOption()"
          >
            {{ showChatOption ? "Hide Actions" : "Show Actions" }}
          </div>
        </div>
      </div>
    </div> -->

    <ChatMembersBar
      v-else
      v-model:show-chat-option="showChatOption"
      :members="members"
      :is-mobile="isMobile"
      :selected-chat="getSelectedChat"
    />

    <q-separator class="md:mx-4" size="1px" inset />
    <!-- message content -->
    <main class="flex-1 relative z-10 w-full h-full" @click="hideBotOption">
      <div
        class="absolute top-0 scrollbar overflow-y-auto w-full z-50 px-2 scroll_area h-full md:px-4"
        ref="scrollAreaRef"
      >
        <q-infinite-scroll
          :key="getSelectedChatId"
          ref="infiniteScrollRef"
          @load="loadMore"
          :initial-index="initialIndex"
          reverse
          :offset="300"
          :scroll-target="scrollAreaRef"
        >
          <ChatMessage
            v-for="item in messages"
            :key="item.id"
            :message="item"
            ref="messagesComponentRefs"
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
    <footer class="q-pa-xs q-pb-xs bg-white w-full px-3 pt-2.5 z-20 pb-4">
      <template v-if="getSelectedChat.status === ChatTypes.ONGOING">
        <div
          class="relative rounded-xl overflow-hidden px-4 py-4 sm:h-auto bg-grey-2 w-full"
        >
          <ChatMessage
            v-if="replayMessage?.id"
            :message="replayMessage"
            :isReply="true"
          />
          <q-input
            @click="hideBotOption"
            v-model="message"
            placeholder="Enter Message"
            dense
            borderless
            type="textarea"
            class="w-full"
            :class="{ invisible: showAudio }"
            input-class="h-1"
            input-style="height: 1em;"
            @[inputEvent]="inputHandler"
            :disable="isBot || !canSend"
            @paste="onPaste"
          />
          <!-- {{ isBot }}
          {{ isPending }}
          {{ chaqMode }}
          {{ canSend }} -->
          <Transition name="fade-scale" appear>
            <div
              ref="waveRef"
              :class="{ invisible: !showAudio }"
              class="absolute inset-0 bg-primary"
              :disable="isPending || isBot"
            />
          </Transition>
          <span
            class="absolute right-0 bottom-0 text-white p-2"
            :class="{ invisible: !showAudio }"
            >{{ time }} ms</span
          >
        </div>

        <div class="row justify-end items-center">
          <div class="flex gap-3">
            <q-btn
              flat
              round
              :size="bottomButtonSize"
              class="q-mt-md"
              :disable="isPending || isBot || chaqMode || !canSend"
              @click="toggleInfo()"
            >
              <img src="~assets/images/bot.svg" />
              <q-menu v-if="!isMobile">
                <q-list
                  dense
                  style="min-width: 100px"
                  class="py-2 px-3 space-y-2"
                >
                  <q-item>
                    <q-item-section>Office hours</q-item-section>
                    <q-item-section avatar>
                      <q-toggle v-model="isOfficeHours" />
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-for="item in botList"
                    :key="item.text"
                    clickable
                    v-close-popup
                    @click="selectBot(item)"
                  >
                    <img
                      src="~assets/images/bot.svg"
                      width="26"
                      class="pr-2"
                      v-if="item.name !== 'Greetings'"
                    />
                    <img
                      src="~assets/images/wave.svg"
                      width="28"
                      class="pr-2"
                      v-else
                    />
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
            :size="bottomButtonSize"
            :disable="isPending || isBot || chaqMode || !canSend"
            class="q-mt-md active:bg-primary mic-recorder"
            @click="record()"
          />
          <!-- :flat="!isChatExpired || isBot" -->
          <q-btn
            round
            color="primary"
            icon="insert_comment"
            :size="bottomButtonSize"
            class="q-mt-md"
            @click="showMessageTemplate = true"
            :disable="isBot"
          />
          <q-btn
            flat
            round
            color="grey"
            icon="image"
            :size="bottomButtonSize"
            class="q-mt-md"
            :disable="isPending || isBot || chaqMode || !canSend"
            @click="showMessageImage = true"
          />

          <q-btn
            flat
            round
            color="grey"
            size="md"
            class="q-mt-md"
            :disable="isPending || isBot || chaqMode || !canSend"
            @click="pickFiles()"
          >
            <img src="~assets/images/pin.svg" />
            <q-uploader
              ref="fileUplader"
              :accept="Object.keys(supportedFiletypes).join()"
              class="hidden invisible"
              :filter="fileFilter"
              @added="openFilePreview($event)"
            />
          </q-btn>
          <q-btn
            color="primary"
            label="Send"
            class="dark-btn q-mt-md"
            :disable="isBot || !canSend"
            @click="sendMessage"
            :size="bottomButtonSize"
          />
        </div>
      </template>
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
  <FilePreviewDialog
    ref="FilePreviewDialogRef"
    v-model="showFilePreviewDialog"
    @hide="showFilePreviewDialog = false"
    @send="uploadFile"
    :file="file"
  />
  <Transition
    enter-active-class="duration-200 ease-out"
    enter-from-class="transform opacity-0 translate-y-96"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0 translate-y-96"
  >
    <div
      class="fixed z-30 bottom-0 rounded-t-2xl bg-white shadow-[0_25px_200px_5px_rgba(0,0,0,0.3)] p-3 w-full"
      v-if="showBot && isMobile"
    >
      <div
        class="flex items-center space-x-2 cursor-pointer w-fit text-gray-500 pb-3"
        @click="toggleInfo()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
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
          <path d="M5 12l14 0"></path>
          <path d="M5 12l4 4"></path>
          <path d="M5 12l4 -4"></path>
        </svg>
        <span>Back</span>
      </div>
      <q-list dense style="min-width: 100px">
        <q-item>
          <q-item-section>Office hours</q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="isOfficeHours" />
          </q-item-section>
        </q-item>
        <q-item
          v-for="(item, index) in botList"
          class="hover:bg-gray-200"
          style="height: 35px"
          :class="getSeparator(index)"
          :key="item.text"
          clickable
          v-close-popup
          @click="selectBot(item)"
        >
          <img
            src="~assets/images/bot.svg"
            width="26"
            class="pr-2"
            v-if="item.name !== 'Greetings'"
          />
          <img src="~assets/images/wave.svg" width="28" class="pr-2" v-else />
          <q-item-section>{{ item.name }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </Transition>
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
import { Platform, Screen, Dialog, Loading, Notify } from "quasar";
import Swal from "sweetalert2";
import { format, isSameDay, isToday } from "date-fns";
import Recorder from "recorder-core";
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";
import "recorder-core/src/extensions/wavesurfer.view.js";
import useMessagingStore from "src/stores/modules/messaging";
// import { getChatNameEn, uuid, blobToBase64 } from "src/utils/trim-word";
import { uuid, blobToBase64 } from "src/utils/trim-word";
import {
  updateChatStatus,
  uploadMedia,
  initiateBot,
  closeBot,
} from "src/api/messaging";
import { ChatTypes } from "src/constants/ChatKeyword";
import {
  Direction,
  Product,
  MessageType,
  Member,
  Message,
  MessageStatus,
  SendMessageStatus,
  Bot,
} from "src/types/MessagingTypes";
import useUserInfoStore from "src/stores/modules/userInfo";
import useCustomerStore from "src/stores/modules/customer";
import useContactStore from "src/stores/modules/contact";
import MessageTemplateDialog from "src/components/Messaging/MessageTemplateDialog.vue";
import MessageImageDialog from "src/components/Messaging/MessageImageDialog.vue";
import FilePreviewDialog from "src/components/Messaging/FilePreviewDialog.vue";
import ChatMessage from "./ChatMessage.vue";
import profileIcon from "src/assets/images/profileicon.svg";
import ChatMembersBar from "./ChatMembersBar.vue";

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
const canSend: Ref<boolean> = ref(true);
// const isChatExpired: Ref<boolean> = ref(false);
const conversationType: Ref<string | undefined> = ref("");
// const isPending: Ref<boolean> = ref(false);

const isTemplate: Ref<boolean> = ref(false);
const templateIsMeta: Ref<boolean> = ref(false);
const templateName: Ref<string> = ref("");
const language: Ref<string> = ref("");
const isIncludeComponent: Ref<boolean> = ref(false);
const showMessageTemplate: Ref<boolean> = ref(false);
const showMessageImage: Ref<boolean> = ref(false);
const showFilePreviewDialog: Ref<boolean> = ref(false);
const paramsCount: Ref<any[]> = ref([]);
const headerType: Ref<string> = ref("TEXT");
const headerMessage: Ref<string> = ref("");
const fileUplader: any = ref(null);
const rec: any = ref(null);
const wave: any = ref(null);
const waveRef: any = ref(null);
const showAudio = ref(false);
const time = ref(0);
const audioData = ref();
const messagingStore = useMessagingStore();
const userInfoStore = useUserInfoStore();
const customerStore = useCustomerStore();
const contactStore = useContactStore();
const hasMoreMessage: HasMore = reactive({});
const rightDrawerOpen: any = inject("rightDrawerOpen");
const leftDrawerOpen: any = inject("leftDrawerOpen");
const showBot = ref(false);
const isMobile = ref(false);
const showChatOption = ref(false);
const isLoadMore = ref(false);

// filetypes reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const supportedFiletypes: Ref<any> = ref({
  ".mp4": "video/mp4",
  ".3gp": "video/3gpp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});
const messageImageDialogRef = ref();
const {
  getSelectedChat,
  getSelectedChatId,
  cachedChatMessages,
  replayMessage,
  botList,
  getSelectedChatPending,
  getSelectedChatExpired,
} = storeToRefs(messagingStore);

const isPending = computed({
  get: () => getSelectedChatPending.value,
  set: (value) => {
    messagingStore.setSelectedChatPending(value);
  },
});

const isChatExpired = computed({
  get: () => getSelectedChatExpired.value,
  set: (value) => {
    messagingStore.setSelectedChatExpired(value);
  },
});

const file = ref();
const openFilePreview = (files: any) => {
  showFilePreviewDialog.value = !showFilePreviewDialog.value;
  file.value = files;
};
const pickFiles = () => {
  fileUplader.value?.reset();
  setTimeout(() => {
    fileUplader.value?.pickFiles();
  }, 100);
};
const toggleInfo = () => {
  // getChatbots();
  if (window.innerWidth < 1024) {
    isMobile.value = true;
  }
  showBot.value = !showBot.value;
};

const hideBotOption = () => {
  showBot.value = false;
};

const getSeparator = (index: number) => {
  if (index !== botList.value.length - 1) {
    return "border-b-2";
  }
  return "";
};

const selectedSearchResultPagination = computed(
  () => messagingStore.selectedSearchResultPagination
);

watch(selectedSearchResultPagination, (value) => {
  console.log("[messages] Search result selected", value);
  hasMoreMessage[getSelectedChatId.value] = true;
  if (value == null) {
    infiniteScrollRef.value?.setIndex(0);
  } else {
    const targetPage = value.total_pages - value.page_no;
    infiniteScrollRef.value?.setIndex(targetPage);
  }
  cachedChatMessages.value[getSelectedChatId.value] = [];
  infiniteScrollRef.value?.resume();
});

// const toogleChatOption = () => {
//   showChatOption.value = !showChatOption.value;
// };

// const nameEn = computed<string>(() => {
//   return getChatNameEn(getSelectedChat.value, true);
// });

const chatName = computed<string>(() => {
  if (getSelectedChat.value?.meta_phone_number_id === "ChaQ") {
    return getSelectedChat.value?.name;
  }
  if (getSelectedChat.value?.customer_company_name_en) {
    return getSelectedChat.value.customer_company_name_en;
  } else {
    return "Visitor";
  }
});

const chatNumber = computed<string>(
  () => getSelectedChat.value?.name.replace(/[^\d]/g, "") // jimmy
);

const setCanSend = (val: boolean) => {
  canSend.value = val;
};

// const metaPhoneNumberId = computed<string>(() => {
//   if (getSelectedChat.value?.meta_phone_number_id) {
//     return getSelectedChat.value?.meta_phone_number_id;
//   }
//   return "";
// });

/**
 * each chat can have multiple contacts. we are ONLY supporting single contact right now
 * when we support multiple contacts, then this function can be reused.
 */
const channelIdentity = computed<string>(() => {
  let envMetaPhoneNumberId = process.env.META_PHONE_NUMBER_ID as string;
  console.log(envMetaPhoneNumberId);
  if (!envMetaPhoneNumberId) {
    envMetaPhoneNumberId = "";
    // envMetaPhoneNumberId = process.env.META_PHONE_NUMBER_ID;
  }
  let metaPhoneNumberId = "";
  if (getSelectedChat?.value?.meta_phone_number_id) {
    metaPhoneNumberId = getSelectedChat.value.meta_phone_number_id;
  } else {
    setCanSend(false);
    return "";
  }
  if (envMetaPhoneNumberId && metaPhoneNumberId !== envMetaPhoneNumberId) {
    setCanSend(false);
    if (metaPhoneNumberId === "ChaQ") {
      setCanSend(true);
    }
  } else {
    setCanSend(true);
  }
  return phoneMapping(metaPhoneNumberId);
});

const phoneMapping = (metaPhoneNumberId: string) => {
  let identity = "";
  switch (metaPhoneNumberId) {
    case "104844065999210":
      identity = "Angliss";
      break;
    case "106296152305955":
      identity = "Synque";
      break;
    case "100327786191815":
      identity = "Dev";
      break;
    default:
      break;
  }
  return identity;
};

const contactNameGet = computed<string>(() => {
  const contactName =
    getSelectedChat.value.contact_first_name ??
    getSelectedChat.value.contact_last_name;
  return contactName;
  // return (
  //    +
  //   " " +
  //   getSelectedChat.value.contact_last_name
  // );
});

const inputEvent = computed(() => {
  return Screen.lt.md ? "keyup" : "keydown";
});

const members = computed<Member[]>(
  () => JSON.parse(getSelectedChat.value.members) || []
);

const chaqMode = computed<boolean>(
  () => getSelectedChat.value?.meta_phone_number_id === "ChaQ"
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

const messagesComponentRefs = ref([]);

watch(messagesComponentRefs, (value) => {
  console.log("[messages] messagesComponentRefs changed", value);
});

const isBot = computed<boolean>(() => getSelectedChat?.value?.mode === "Bot");

const loadMore = async (index: number, done: (stop?: boolean) => void) => {
  console.log("[messages] Loading messages from index:", index);
  isLoadMore.value = true;
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
  () => getSelectedChat.value?.conversation_type,
  async (val) => {
    console.log("[messages] Changed selected chat conversation type:", val);
    conversationType.value = val;
    isPending.value = conversationType.value === ChatTypes.PENDING_INBOUND;
    // if isPending, show meta templates, otherwise HIDE meta templates
  }
);

watch(
  () => getSelectedChat.value?.expiration_timestamp,
  async (val) => {
    // console.log("SELECTED_CHAT:expiry", val);
    // conversationType.value = getSelectedChat.value.conversation_type;
    // isPending.value = conversationType.value === "pending_inbound";

    if (val) {
      const expiredDate = new Date(val * 1000);
      // console.log("expiredDate:", expiredDate);
      // console.log("now:", new Date());
      if (expiredDate) {
        isChatExpired.value = new Date() >= expiredDate;
        // differenceInDays(new Date(), new Date(expiredDate)) < 0;
      } else {
        isChatExpired.value = false;
      }
    } else {
      isChatExpired.value = false;
    }
    // console.log("isChatExpired.value:");
    // console.log(isChatExpired.value);
  }
);

const scrollToBottom = async () => {
  await nextTick();
  if (!scrollAreaRef.value) return;
  if (isLoadMore.value) {
    isLoadMore.value = false;
    return;
  }
  scrollAreaRef.value.scrollTop = scrollAreaRef.value?.scrollHeight;
};

const closeChat = async () => {
  leftDrawerOpen.value = true;
};

const bottomButtonSize = computed(() => {
  return isMobile.value ? "sm" : "md";
});

// const initialName = (name: string) => {
//   const firstName = name.split(" ")[0];
//   let initial = firstName.charAt(0).toUpperCase();

//   if (name.split(" ").length !== 1) {
//     const lastName = name.split(" ")[1];
//     initial += lastName.charAt(0).toUpperCase();
//   }
//   return initial;
// };

const showCustomerInfo = async () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
  console.log("click chat header:", contactStore.getCurrentCustomerId);

  // const checkNullChatCustomer =
  //   !getSelectedChat.value.customers_id ||
  //   getSelectedChat.value.customers_id === "" ||
  //   getSelectedChat.value.customers_id === null;
  // const checkNullContactCustomer =
  //   !contactStore.getCurrentCustomerId ||
  //   contactStore.getCurrentCustomerId === "" ||
  //   contactStore.getCurrentCustomerId === null;
  let contact = null;
  if (getSelectedChat?.value.customers_id) {
    // if (checkNullChatCustomer && checkNullContactCustomer) {
    const customer = await customerStore.fetchCustomer(
      getSelectedChat.value.customers_id
    );
    contactStore.setCurrentCustomerId(customer.id);
    if (customer?.contacts.length === 1) {
      // a customer can be related to MANY contacts
      contact = customer?.contacts[0].contacts_id;
      contactStore.setCurrentCustomerId(getSelectedChat.value.customers_id);
      useContactStore().setContact(contact);
    }
  } else {
    // } else if (!getSelectedChat.value.customers_id) {
    customerStore.setCustomer(null);
  }

  if (!contact) {
    // the invariant is that there is always a contact
    contact = await contactStore.getContactById(getSelectedChat.value);
    console.log("  GET contact:....", contact);
  }
  // this.setContactNumber(contact.number);
};

const messageCallback = async (data: any, newMessage: any) => {
  if (!data || !data.status) {
    newMessage.sendMessageStatus = SendMessageStatus.FAILURE;
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: data.message,
    });
  } else {
    data = data.data || data;
    newMessage.id = data.derp_chats_messages_id;
    newMessage.sendMessageStatus = SendMessageStatus.DEFAULT;
    newMessage.waba_message_id = data.waba_message_id;
  }
};

// const inputHandler = (e: any) => {
//   console.log("bug");
//   console.log(Platform.is);
//   console.log(Screen.lt);
//   if (Screen.lt.md) {
//     if (e.keyCode === 13) {
//       e.preventDefault();
//     }
//   } else {
//     if (e.keyCode === 13 && !e.shiftKey) {
//       console.log(e.shiftKey);
//       e.preventDefault();
//       sendMessage();
//     }
//   }
// };

/**
 * https://quasar.dev/options/platform-detection
 * @param e
 */
const inputHandler = (e: any) => {
  // console.log("PLATFORM:", Platform.is.mobile);
  if (Platform.is.mobile) {
    if (e.keyCode === 13) {
      e.preventDefault();
      // Swal.fire({
      //   icon: "error",
      //   title: "Mobile...",
      //   text: "Mobile",
      // });
    }
  } else {
    if (e.keyCode === 13 && !e.shiftKey) {
      console.log(e.shiftKey);
      e.preventDefault();
      sendMessage();
    }
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
    is_cache: true,
    waba_associated_message_id:
      replayMessage.value?.waba_message_id || replayMessage.value?.message_id,
    waba_associated_message: null,
  });
  console.log("newMessage", newMessage);

  const wabaMessageId =
    replayMessage.value?.waba_message_id || replayMessage.value?.message_id;
  if (wabaMessageId) {
    // newMessage.waba_associated_message = replayMessage.value;
    if (!newMessage.waba_associated_message) {
      newMessage.waba_associated_message =
        await messagingStore.associatedMessageGet(
          newMessage.waba_associated_message_id
        );
    }
  }
  console.log("---newMessage", newMessage);
  cachedMessage.push(newMessage);
  scrollToBottom();
  messagingStore.setReplayMessage();

  const timestamp = getSelectedChat.value?.expiration_timestamp;
  const expiredDate = new Date(timestamp * 1000);
  isChatExpired.value = new Date() >= expiredDate;

  // if (!isChatExpired.value && isTemplate.value) {??? todo, save on message template
  //   isTemplate.value = false;
  //   newMessage.content = message.value;
  // }

  message.value = "";
  try {
    const data = await messagingStore.sendChatTextMessage({
      channel:
        getSelectedChat.value?.meta_phone_number_id === "ChaQ"
          ? "chaq"
          : "whatsapp",
      chatId: getSelectedChatId.value,
      messageProduct: Product.WHATSAPP,
      to: chatNumber.value,
      type: isTemplate.value ? MessageType.TEMPLATE : MessageType.TEXT,
      messageBody: newMessage.content,
      isTemplate: isTemplate.value,
      isMeta: templateIsMeta.value,
      templateName: templateName.value,
      language: language.value,
      isIncludedComponent: isIncludeComponent.value,
      countParams: paramsCount.value,
      headerType: headerType.value,
      headerMessage: headerMessage.value,
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

const isOfficeHours = ref(false);
watch(isOfficeHours, (value) => {
  console.log("Toggling office hours", value);
  messagingStore.setOfficeHours(value);
});

// const isOfficeHours = computed({
//   get: () => messagingStore.officeHours,
//   set: async (value) => {
//     console.log("Toggling office hours", value);
//     messagingStore.setOfficeHours(value);
//   },
// });

const activateChat = async () => {
  try {
    const chatId = getSelectedChat.value.id;
    const userId: any | null = userInfoStore.getUserProfile;
    Loading.show();
    try {
      const result = await updateChatStatus(chatId, userId?.id);
      if (!result.data.status)
        Notify.create({
          message: result.data.message || "Cannot Take it. Refresh Page.",
          type: "negative",
          color: "red-8",
          position: "top",
        });
      else {
        messagingStore.setSelectedTab(ChatTypes.ONGOING);
        getSelectedChat.value.status = ChatTypes.ONGOING;
        // messagingStore.updateChatsList(
        //   getSelectedChat.value,
        //   ChatTypes.ONGOING
        // );
      }
    } catch (error: any) {}
    Loading.hide();
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
  isMeta: boolean,
  componentCount: any[],
  headType: string,
  headMessage: string
) => {
  console.log("head type:", headType);
  templateName.value = name;
  message.value = msg.replace("\n", "");
  language.value = lang;
  isTemplate.value = true;
  templateIsMeta.value = isMeta;
  isIncludeComponent.value = isIncComponent;
  paramsCount.value = componentCount;
  headerType.value = headType;
  headerMessage.value = headMessage;
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
    is_cache: true,
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

const record = () => {
  if (showAudio.value) {
    recStop();
  } else {
    recStart();
  }
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
      wave.value.input(buffers[buffers.length - 1], powerLevel, sampleRate);
      time.value = bufferDuration;
    },
  });

  rec.value.open(
    function () {
      console.log(22222);
      rec.value.start();
    },
    function () {
      Notify.create({
        message:
          "Your microphone is not activated. Please Enable microphone in your browser.",
        type: "negative",
        color: "red",
        position: "top",
      });
      showAudio.value = false;
    }
  );
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
    is_cache: true,
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

const initialIndex = ref<number>(0);

const uploadFile = async (payload: {
  files: readonly File[];
  caption: string;
}) => {
  const file = payload.files[0];
  showFilePreviewDialog.value = false;

  getLimitByType(file.type);
  if (!file) return;

  // const fileType = `${file.type.split("/")[1]}`;
  console.log("supported files:", Object.values(supportedFiletypes.value));
  console.log("current file types:", file.type);
  if (!Object.values(supportedFiletypes.value).includes(file.type)) {
    Notify.create({
      message: `Media Unsupported`,
      type: "negative",
      position: "top",
    });

    fileUplader.value?.removeQueuedFiles();
    return;
  }

  const cachedMessage = cachedChatMessages.value[getSelectedChatId.value];
  const newMessage = reactive({
    // ??? todo, new message needs to ....
    id: Date.now(),
    content: {
      url: "",
      type: MessageType.DOCUMENT,
      duration: time.value,
      local: true,
      media_id: decodeURIComponent(file.name),
      file_name: file.name,
    },
    status: MessageStatus.SENT,
    direction: Direction.OUTGOING,
    date_created: new Date().toUTCString(),
    sendMessageStatus: SendMessageStatus.PENDING,
    is_cache: true,
  });
  cachedMessage.push(newMessage);
  scrollToBottom();
  messagingStore.setReplayMessage();
  const bodyFormData = new FormData();
  const newFileName = new File([file], encodeURIComponent(file.name), {
    type: file.type,
  });
  console.log(newFileName);

  bodyFormData.append("caption", payload.caption);
  bodyFormData.append("file", newFileName);
  fileUplader.value?.removeQueuedFiles();

  const { data } = await uploadMedia(getSelectedChatId.value, bodyFormData);

  // clear uploaded file from cache
  cachedChatMessages.value[getSelectedChatId.value] = cachedChatMessages.value[
    getSelectedChatId.value
  ].filter((cm) => cm.id !== newMessage.id);
  // end clear uploaded file from cache

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
      message: `${fileData?.name} CANNOT exceed ${fileData?.limit}MB`,
      type: "negative",
      color: "purple",
      position: "top",
    });
  }

  return filterFiles;
};

const selectBot = async (bot: Bot) => {
  hideBotOption();
  const { status } = await initiateBot(
    getSelectedChatId.value,
    bot.id,
    bot.trigger_intent
  );

  if (status) {
    Notify.create({
      message: `The ${bot.name} has been Started. Chat disabled.`,
      color: "primary",
      position: "top",
      type: "positive",
    });
    getSelectedChat.value.mode = "Bot";
  }
};

const confirmCloseBot = () => {
  Dialog.create({
    title: "End Bot",
    message: "Close Bot. Confirm?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    onCloseBot();
  });
};
const onCloseBot = async () => {
  await closeBot(getSelectedChatId.value);
  getSelectedChat.value.mode = "CS-Agent";
};

const onPaste = (e: ClipboardEvent) => {
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

onMounted(async () => {
  console.log("PLATFORM:", Platform.is);
  // Swal.fire({
  //   icon: "error",
  //   title: "Mobile...",
  //   text: `I'm only rendered on mobile: ${Platform.is.mobile}`,
  // });

  if (window.innerWidth < 1024) {
    isMobile.value = true;
  }

  await messagingStore.setBotList();
  console.log("botlist:", botList.value);
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
