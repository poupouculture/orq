<template>
  <div class="message-item relative">
    <component
      :is="componentName"
      :src="content.url"
      :name="content.media_id"
    />
    <span v-if="content?.type === MessageType.TEMPLATE">
      {{ messageTemplate(content) }}
    </span>
    <span v-if="!content?.type || content?.type === MessageType.TEXT">
      {{ content?.text ?? content }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, shallowReactive } from "vue";
import { MessageType } from "src/types/MessagingTypes";
import MessageImage from "./MessageImage.vue";
import MessageAudio from "./MessageAudio.vue";

interface Props {
  content: any;
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({}),
});

const messageTemplate = (content: any) => {
  const components = content?.template?.components ?? content?.components;
  if (components) {
    const component = components?.find(
      (component: any) => component?.type === "body"
    );
    if (component) return component?.parameters[0].text;
  }

  return content?.template_content || content?.template?.text;
};
const components = shallowReactive({ MessageImage, MessageAudio });
const componentName = computed(() => {
  switch (props.content?.type) {
    case MessageType.IMAGE:
      return components.MessageImage;
    case MessageType.AUDIO:
      return components.MessageAudio;
    default:
      return null;
  }
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
