<template>
  <div class="message-item relative">
    <!-- <q-btn class="absolute top-0 right-0" round dense size="xs" icon="close" /> -->
    <component
      :is="componentName"
      :src="content.url"
      :name="content.media_id"
      :caption="content.caption"
    />
    <div
      v-if="messageTemplateHeader(content) !== null"
      class="flex justify-center"
    >
      <img
        :src="messageTemplateHeader(content).image"
        v-if="messageTemplateHeader(content).type === 'IMAGE'"
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

    <!-- <q-menu touch-position context-menu>
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup>
          <q-item-section>Reply</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Download</q-item-section>
        </q-item>
      </q-list>
    </q-menu> -->
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
