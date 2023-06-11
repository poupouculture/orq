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
        (content?.type === MessageType.TEXT && content?.mime_type === undefined)
      "
      class="break-words"
    >
      <div v-if="message?.waba_associated_message_id != null">
        <div
          class="bg-[#635eeb] rounded-lg p-3 mb-1.5 border-l-4 border-l-blue-300 break-words"
          :class="[isSend ? 'bg-[#635eeb]' : 'bg-[#ffffff]']"
        >
          <div :class="[isSend ? 'text-[#f4f4f4]' : 'text-blue-400']">
            {{ message.user_name ?? message.contact_company_name }}
          </div>
          <!-- //??? todo fetch message content-->
          {{ message?.waba_associated_message_id }}
        </div>
      </div>
      {{ messageContent(message) }}
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

const messageContent = (content: any) => {
  if (content?.content?.error_body) {
    const error = content?.content?.error_body;
    if (error.errors) return error.errors[0].title;
    if (error.error_data) return error.error_data.details;
    if (error.message) return error.message;
  }
  return content?.content?.text ?? content.content;
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
    default:
      return null;
  }
});
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
