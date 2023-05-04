<template>
  <div class="message-item relative">
    <component
      ref="component"
      :is="componentName"
      :src="content.url"
      :name="isDocument(content) ? content.file_name : content.media_id"
      :caption="content.caption"
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
    <span v-if="!content?.type || content?.type === MessageType.TEXT">
      {{ content?.text ?? content }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, shallowReactive, ref } from "vue";
import { MessageType } from "src/types/MessagingTypes";
import MessageImage from "./MessageImage.vue";
import MessageAudio from "./MessageAudio.vue";
import MessageDocument from "./MessageDocument.vue";

interface Props {
  content: any;
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({}),
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
  return (
    content?.type === MessageType.DOCUMENT ||
    content?.type === MessageType.APPLICATION
  );
};

const components = shallowReactive({
  MessageImage,
  MessageAudio,
  MessageDocument,
});
const componentName = computed(() => {
  switch (props.content?.type) {
    case MessageType.IMAGE:
      return components.MessageImage;
    case MessageType.AUDIO:
      return components.MessageAudio;
    case MessageType.DOCUMENT:
      return components.MessageDocument;
    case MessageType.APPLICATION:
      return components.MessageDocument;
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
