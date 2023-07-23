<template>
  <div
    v-if="message.label && !isReply"
    class="table py-6 whitespace-nowrap before:table-cell before:content-[''] before:w-1/2 before:border-t before:translate-y-2/4 after:table-cell after:content-[''] after:w-1/2 after:border-t after:translate-y-2/4"
  >
    <div class="text-center inline-block text-xs px-1.5 text-[#9A9AAF]">
      {{ message.label }}
    </div>
  </div>
  <div
    v-if="message.type === MessageType.LOG"
    class="table py-6 whitespace-nowrap before:table-cell before:content-[''] before:w-1/2 before:border-t before:translate-y-2/4 after:table-cell after:content-[''] after:w-1/2 after:border-t after:translate-y-2/4"
  >
    <div class="text-center inline-block text-xs px-1.5 text-[#9A9AAF]">
      {{ message.content.text }}
    </div>
  </div>
  <div
    v-else
    class="flex"
    :class="{ 'flex-row-reverse': isSend && !isReply, 'pb-8': !isReply }"
  >
    <div
      class="relative rounded px-3 py-2"
      :class="[
        isSend
          ? 'text-white rounded-br-none bg-primary'
          : 'text-[#2E2E3A] rounded-tl-none bg-[#E8E7FB]',
        isReply ? 'w-full !rounded-lg' : 'max-w-[60%]',
      ]"
    >
      <template v-if="!isReply">
        <span
          v-if="!isSend"
          class="bottom-full left-0 scale-90 origin-left text-black text-semibold"
        >
          {{ !isChaq ? message.contact_name : message.user_name }}
        </span>
        <span
          v-if="isSend"
          class="bottom-full left-0 scale-90 origin-right text-white text-semibold"
        >
          {{ message.user_name }}
          <!-- ??? todo, jimmy comment out user_name {{ message.user_name }} -->
        </span>
      </template>
      <q-btn
        v-if="isReply"
        class="absolute -top-2 -right-2"
        :class="[isSend ? 'text-black' : '']"
        round
        dense
        size="xs"
        icon="close"
        :color="isSend ? 'white' : 'primary'"
        @click="closeReply"
      />
      <Preview
        v-if="message.content.type === MessageType.TEMPLATE"
        :username="message.user_name"
        :header="header"
        :headerMessage="messageTemplateComponent(message.content, 'header')"
        :media="media"
        :bodyMessage="messageTemplateBody(message.content)"
        :footerMessage="messageTemplateComponent(message.content, 'footer')"
        :actionCategory="actionCategory"
        :actions="actions"
        :replies="replies"
        :isRealMessage="isRealMessage"
      />
      <MessageComponents
        v-else
        ref="image"
        :isReply="isReply"
        :content="message.content"
        :message="message"
        :isSend="isSend"
        :showAssociated="true"
      />
      <div
        v-if="!isReply"
        class="absolute right-0 top-full whitespace-nowrap flex flex-nowrap justify-end items-center pb-2 scale-90 origin-top-right"
      >
        <q-avatar
          v-if="message.mode === 'Bot' && isSend"
          size="xs"
          class="rounded-avatar mr-1"
        >
          <img src="~assets/images/bot.svg" />
        </q-avatar>
        <small class="text-[#9A9AAF]">
          {{ timestamp }}
        </small>
        <!-- <svg
          v-if="isSend"
          class="inline"
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
        </svg> -->
      </div>
      <q-spinner-ios
        v-if="message.sendMessageStatus === SendMessageStatus.PENDING"
        class="absolute right-full top-1/2 -translate-y-2/4 pr-1"
        color="primary"
        size="1.2em"
      />
      <q-icon
        v-if="
          message.sendMessageStatus === SendMessageStatus.FAILURE ||
          message.status === MessageStatus.FAILURE
        "
        class="absolute right-full top-1/2 -translate-y-2/4 pr-1"
        name="warning"
        color="negative"
        size="1.2rem"
      />
      <q-menu touch-position context-menu>
        <q-list dense style="min-width: 100px">
          <q-item
            v-for="item in menuList"
            :key="item.text"
            clickable
            v-close-popup
            @click="onhandleClick(item.text)"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{ item.text }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>
  <div class="w-full flex justify-center py-3" v-if="message.isEmoticon">
    <div class="w-3/4 flex flex-col gap-2">
      <div class="w-full flex justify-between">
        <img
          src="../../assets/images/emoticon-angry.svg"
          class="hover:cursor-pointer"
          alt=""
        />
        <img
          src="../../assets/images/emoticon-unhappy.svg"
          class="hover:cursor-pointer"
          alt=""
        />
        <img
          src="../../assets/images/emoticon-flat.svg"
          class="hover:cursor-pointer"
          alt=""
        />
        <img
          src="../../assets/images/emoticon-smile.svg"
          class="hover:cursor-pointer"
          alt=""
        />
        <img
          src="../../assets/images/emoticon-love.svg"
          class="hover:cursor-pointer"
          alt=""
        />
      </div>
      <div class="w-full flex justify-between">
        <span class="text-xs">Not Satisfied</span>
        <span class="text-xs">Very Satisfied</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import {
  Message,
  Direction,
  MessageType,
  SendMessageStatus,
  MessageStatus,
} from "src/types/MessagingTypes";
import { format } from "date-fns";
import MessageComponents from "./MessageComponents.vue";
import useMessagingStore from "src/stores/modules/messaging";
import useUserInfoStore from "src/stores/modules/userInfo";
import Preview from "../ApplicationProgram/Preview.vue";

const props = defineProps<{
  message: Message;
  isReply?: boolean;
}>();
const operationType = ref("");
const image = ref();
const messagingStore = useMessagingStore();
const userStore = useUserInfoStore();
const header = ref("TEXT");
const media = ref("None");
const actionCategory = ref("");
const actions = ref([]);
const replies = ref([]);
const isRealMessage = ref(true);

const isSend = computed(() => {
  if (isChaq.value) {
    return props?.message?.employee === userStore.getUserId;
  }
  return props?.message.direction === Direction.OUTGOING;
});
// const isNotImageType = computed(
//   () => props.message.content.type !== MessageType.IMAGE
// );
const timestamp = computed(() => {
  return format(new Date(props.message.date_created), "p");
});
const isChaq = computed(() => props?.message?.channel === "chaq");

const list = [
  { icon: "reply", text: "Reply" },
  {
    icon: "download",
    text: "Download",
    visible: ["image", "document", "application", "video", "audio"],
  },
  { icon: "content_copy", text: "Copy", visible: ["text"] },
];

const menuList = computed(() => {
  const selectedList = list.filter(
    (item) =>
      !item.visible || item.visible.includes(props.message?.content?.type)
  );

  if (
    props.message?.content?.type === MessageType.TEXT &&
    props.message?.content?.mime_type !== undefined
  )
    selectedList.push({ icon: "download", text: "Download" });

  return selectedList;
});
const onhandleClick = (type: string) => {
  operationType.value = type;
  switch (type) {
    case "Reply":
      messagingStore.setReplayMessage(props.message);
      break;
    case "Download":
      console.log(image.value);
      image.value.component.download();
      break;
    case "Copy":
      props.message.content.text &&
        navigator.clipboard.writeText(props.message.content.text);
      break;
    default:
      break;
  }
};
const closeReply = () => {
  messagingStore.setReplayMessage();
};

const errorRender = (content: any) => {
  if (content?.error_body) {
    console.log(content.error_body);
    const error = content?.error_body;
    if (error.errors) {
      if (error.errors.details) {
        // from derp, to be refactored???
        return error.errors.details;
      }
      // from waba
      return error.errors[0]?.title;
    }
    if (error.error_data) return error.error_data.details;
    if (error.message) return error.message;
  }
  return "";
};

const messageTemplateComponent = (content: any, type: string) => {
  const components = content?.template?.components ?? content?.components;
  if (components) {
    const component = components?.find(
      (component: any) => component?.type === type
    );
    if (component) return component?.parameters[0];
    return null;
  }

  return null;
};

const messageTemplateBody = (content: any) => {
  // console.log("messageTemplate");
  if (content.error_body) {
    return errorRender(content);
  }
  const components = content?.template?.components ?? content?.components;
  if (components) {
    const bodyComponent = components?.find(
      (component: any) => component?.type === "body"
    );
    if (bodyComponent) return bodyComponent?.parameters[0].text;
  }

  return content?.template_content || content?.template?.text;
};
</script>
