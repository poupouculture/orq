<template>
  <div class="message-item relative">
    <component
      ref="component"
      :is="componentName"
      :src="content.url"
      :name="isDocument(content) ? content.file_name : content.media_id"
      :caption="content.caption"
      :is-send="isSend"
    />
    <div
      v-if="messageTemplateHeader(content) !== null"
      class="flex justify-center"
    >
      <img
        :src="messageTemplateHeader(content).image"
        v-if="messageTemplateHeader(content).type === MessageType.IMAGE"
      />
      <video loop autoPlay muted v-if="messageTemplateHeader(content).type">
        <source
          :src="messageTemplateHeader(content).video?.link"
          type="video/mp4"
        />
      </video>
    </div>
    <span v-if="content?.type === MessageType.TEMPLATE">
      {{ messageTemplate(content) }}
    </span>
    <div
      v-if="
        !content?.type ||
        (content?.type === MessageType.TEXT &&
          content?.mime_type === undefined) ||
        content?.type == MessageType.REACTION
      "
      class="break-words"
    >
      <div
        v-if="
          props.showAssociated && message?.waba_associated_message_id != null
        "
      >
        <div
          class="bg-[#635eeb] rounded-lg p-3 mb-1.5 border-l-4 border-l-blue-300 break-words"
          :class="[isSend ? 'bg-[#635eeb]' : 'bg-[#ffffff]']"
        >
          <div
            v-if="isSend"
            :class="[isSend ? 'text-[#f4f4f4]' : 'text-blue-400']"
          >
            <!-- {{ message.user_name ?? message.contact_company_name }} -->
          </div>
          <!-- {{ message?.waba_associated_message_id }} -->
          <!-- {{ message?.waba_associated_message?.type }} -->

          <!-- can display content type here -->
          <!-- {{ message?.last_associated_message_content?.type }} -->
          <!-- {{ messageContentText(message) }} -->
          <!-- {{ messageContentType(message) }} -->
          <component
            ref="component"
            :is="componentNameGet(messageContentGet(message))"
            :src="messageContentGet(message)?.url"
            :name="
              isDocument(messageContentGet(message))
                ? messageContentGet(message).file_name
                : messageContentGet(message).media_id
            "
            :caption="messageContentGet(message)?.caption"
            :is-send="isSend"
          />
        </div>
        Replied:
      </div>
      {{ messageContentText(message) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, shallowReactive, ref } from "vue";
import { MessageType } from "src/types/MessagingTypes";
import MessageImage from "./MessageImage.vue";
import MessageAudio from "./MessageAudio.vue";
import MessageDocument from "./MessageDocument.vue";
import MessageVideo from "./MessageVideo.vue";

interface Props {
  content: any;
  message: any;
  isSend: boolean;
  showAssociated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({}),
  message: () => ({}),
  isSend: () => false,
});

const component = ref("");

const messageTemplate = (content: any) => {
  const components = content?.template?.components ?? content?.components;
  if (components) {
    const bodyComponent = components?.find(
      (component: any) => component?.type === "body"
    );
    if (bodyComponent) return bodyComponent?.parameters[0].text;
  }

  return content?.template_content || content?.template?.text;
};

const messageTemplateHeader = (content: any) => {
  const components = content?.template?.components ?? content?.components;
  if (components) {
    const headerComponent = components?.find(
      (component: any) => component?.type === "header"
    );
    if (headerComponent) return headerComponent?.parameters[0];
    return null;
  }

  return null;
};

const isDocument = (content: any) => {
  // console.log("document_found:", content);
  // console.log("content:", content);
  // console.log(
  //   "is document:",
  //   content?.type === MessageType.DOCUMENT ||
  //     content?.type === MessageType.APPLICATION ||
  //     (content?.type === MessageType.TEXT && content?.mime_type !== undefined)
  // );

  return (
    content?.type === MessageType.DOCUMENT ||
    content?.type === MessageType.APPLICATION ||
    (content?.type === MessageType.TEXT && content?.mime_type !== undefined)
  );
};

/**
 *
 * @param msg message from API or Socket
 */
const messageContentText = (msg: any) => {
  // console.log(msg.type);
  if (msg?.content?.error_body) {
    const error = msg?.content?.error_body;
    if (error.errors) return error.errors[0]?.title;
    if (error.error_data) return error.error_data.details;
    if (error.message) return error.message;
  }
  if (msg?.text) {
    return msg.text;
  }

  if (msg?.content?.emoji) {
    // console.log("msg?.content?.emoji", msg?.content?.emoji);
    return msg?.content?.emoji;
  }
  return msg?.content?.text ?? msg?.content;
};

/**
 * for associated message
 * used to display type of message
 * OR
 * message text or reaction
 * @param msg message from associated message
 */
// const messageContentType = (msg: any) => {
//   const message =
//     msg?.waba_associated_message?.content ??
//     msg?.last_associated_message_content;
//   if (!message) {
//     return "Unsupported Media";
//   }
//   const messageType = message?.type;
//   console.log(messageType);
//   switch (messageType) {
//     case MessageType.IMAGE:
//       return MessageType.IMAGE;
//     case MessageType.AUDIO:
//       return MessageType.AUDIO;
//     case MessageType.DOCUMENT:
//       return MessageType.DOCUMENT;
//     case MessageType.APPLICATION:
//       return MessageType.APPLICATION;
//     case MessageType.VIDEO:
//       return MessageType.VIDEO;
//     case MessageType.REACTION: // ???
//       console.log(msg);
//       return message?.emoji;
//     // return MessageType.REACTION;
//   }
//   if (msg?.content?.error_body) {
//     const error = msg?.content?.error_body;
//     if (error.errors) return error.errors[0]?.title;
//     if (error.error_data) return error.error_data.details;
//     if (error.message) return error.message;
//   }
//   if (msg?.text) {
//     return msg.text;
//   }
//   return message.text;
//   // return msg?.content?.text ?? msg?.content;
// };

const messageContentGet = (msg: any) => {
  const message =
    msg?.waba_associated_message?.content ??
    msg?.last_associated_message_content;
  return message;
};

const components = shallowReactive({
  MessageImage,
  MessageAudio,
  MessageDocument,
  MessageVideo,
});

const componentName = computed(() => {
  if (
    props.content?.type === MessageType.TEXT &&
    props.content?.mime_type !== undefined
  ) {
    return components.MessageDocument;
  }
  switch (props.content?.type) {
    case MessageType.IMAGE:
      return components.MessageImage;
    case MessageType.AUDIO:
      return components.MessageAudio;
    case MessageType.DOCUMENT:
      return components.MessageDocument;
    case MessageType.APPLICATION:
      return components.MessageDocument;
    case MessageType.VIDEO:
      return components.MessageVideo;
    // case MessageType.REACTION: // ???
    //   return components.REACTION;
    default:
      return "null";
  }
});

const componentNameGet = (content: any) => {
  if (content?.type === MessageType.TEXT && content?.mime_type !== undefined) {
    return components.MessageDocument;
  }
  switch (content?.type) {
    case MessageType.IMAGE:
      return components.MessageImage;
    case MessageType.AUDIO:
      return components.MessageAudio;
    case MessageType.DOCUMENT:
      return components.MessageDocument;
    case MessageType.APPLICATION:
      return components.MessageDocument;
    case MessageType.VIDEO:
      return components.MessageVideo;
    // case MessageType.REACTION: // ???
    //   return components.REACTION;
    default:
      return null;
  }
};
defineExpose({
  component,
});
</script>
<style lang="scss" scoped>
.message-item {
  .image {
    // width: 128px;
    height: 128px;
  }
}
</style>
