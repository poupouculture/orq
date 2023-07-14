<template>
  <div
    :class="{ 'flex items-center justify-between flex-row-reverse': isReply }"
  >
    <video
      loop
      muted
      ref="videoRef"
      controls
      :width="setWidth"
      :height="setWidth"
    >
      <source type="video/mp4" ref="sourceRef" width="320" height="320" />
    </video>
    <div>
      <template v-if="isReply">
        <span v-if="!isSend" class="text-black text-semibold">
          {{
            replayMessage?.channel !== "chaq"
              ? replayMessage?.contact_name
              : replayMessage?.user_name
          }}
        </span>
        <span v-if="isSend" class="text-white text-semibold">
          {{ replayMessage?.user_name }}
        </span>
      </template>
      <div
        class="mt-1 text-white break-all max-w-xs flex items-center"
        :class="{ '!text-gray-800': !isSend }"
      >
        <svg
          v-if="isReply"
          xmlns="http://www.w3.org/2000/svg"
          class="mr-2"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M17.011 9.385v5.128l3.989 3.487v-12z"></path>
          <path
            d="M3.887 6h10.08c1.468 0 3.033 1.203 3.033 2.803v8.196a.991 .991 0 0 1 -.975 1h-10.373c-1.667 0 -2.652 -1.5 -2.652 -3l.01 -8a.882 .882 0 0 1 .208 -.71a.841 .841 0 0 1 .67 -.287z"
          ></path>
        </svg>
        <p>{{ isReply ? caption || "Image" : caption }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { api } from "src/boot/axios";
import useMessagingStore from "src/stores/modules/messaging";
import { computed, onMounted, ref } from "vue";

interface Props {
  src?: string;
  height?: number;
  name?: string;
  caption?: string;
  isReply?: boolean;
  isSend?: boolean;
}
const originSrc = ref();
const videoRef = ref();
const sourceRef = ref();
const messagingStore = useMessagingStore();
const { replayMessage } = storeToRefs(messagingStore);

const props = withDefaults(defineProps<Props>(), {
  src: "",
  height: 128,
  name: "",
  caption: "",
});
// const source = `${process.env.BACKEND_URL}${props.src}`;
const setWidth = computed(() => (props.isReply ? 80 : 320));
onMounted(() => {
  renderVideo();
});

const renderVideo = async () => {
  if (props.src.startsWith("data:")) {
    originSrc.value = videoRef.value.src = props.src;
  } else {
    api
      .get(`${process.env.BACKEND_URL}${props.src}`, {
        responseType: "blob",
      })
      .then((r: any) => loadVideo(r.data));
  }
};
function loadVideo(data: any) {
  // we can all pass them to the Blob constructor directly
  const newBlob = new Blob([data], { type: "video/mp4" });
  // with blob: URI, the browser will try to load 'data' as-is
  const url = URL.createObjectURL(newBlob);
  sourceRef.value.src = url;
  videoRef.value.load();
}
const download = async () => {
  const link = document.createElement("a");
  if (!sourceRef.value) {
    await renderVideo();
  }
  link.href = sourceRef.value.src;
  link.download = props.name;
  link.click();
};

defineExpose({
  download,
});
</script>

<style lang="scss" scoped></style>
