<template>
  <div class="message-item relative">
    <MessageImage
      v-if="content?.type === MessageType.IMAGE"
      :src="content.url"
      :name="content.media_id"
    />
    <span
      v-else-if="content?.type === MessageType.AUDIO"
      class="cursor-pointer"
      @click="audioPlay"
    >
      <audio
        ref="audio"
        @pause="playing = false"
        class="hidden invisible"
        :src="content.url"
      ></audio>

      <q-icon v-show="playing" name="pause_circle" color="white" size="30px" />
      <q-icon
        v-show="!playing"
        name="play_circle_filled"
        color="white"
        size="30px"
      />
      <span>{{ duration }}</span>
    </span>
    <span v-else-if="content?.type === MessageType.TEMPLATE">
      {{ messageTemplate(content) }}
    </span>
    <span v-else>{{ content?.text ?? content }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { api } from "boot/axios";
import { MessageType, SendMessageStatus } from "src/types/MessagingTypes";
import MessageImage from "./MessageImage.vue";

interface Props {
  content: any;
  sendMessageStatus?: SendMessageStatus;
}
const audio: any = ref(null);
const playing = ref(false);
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

const audioPlay = () => {
  if (audio.value.paused) {
    audio.value.play();
    playing.value = true;
  } else {
    audio.value.pause();
    audio.value.currentTime = 0;
    playing.value = false;
  }
};

const props = withDefaults(defineProps<Props>(), {
  content: () => ({}),
  sendMessageStatus: SendMessageStatus.DEFAULT,
});

watch(
  () => props.content?.url,
  async (val) => {
    if (props.content?.url?.startsWith("blob")) {
      return;
    }
    const { data } = await api.get(val, {
      responseType: "blob",
    });
    const blob = new Blob([data], { type: "audio/mgpe" });
    audio.value.src = (window.URL || window.webkitURL).createObjectURL(blob);
  },
  {
    immediate: true,
  }
);

const duration = computed(() => {
  if (props.content.duration) {
    return Math.ceil(props.content.duration / 10) / 100 + "s";
  }
  return "";
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
