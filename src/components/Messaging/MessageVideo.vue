<template>
  <div class="bg-gray-100 rounded-md p-2.5">
    <video loop muted ref="videoRef" controls :width="setWidth">
      <source type="video/mp4" ref="sourceRef" width="320" height="240" />
    </video>
    <div class="mt-1 font-semibold text-gray-600">{{ caption }}</div>
  </div>
</template>

<script setup lang="ts">
import { api } from "src/boot/axios";
import { computed, onMounted, ref } from "vue";

interface Props {
  src?: string;
  height?: number;
  name?: string;
  caption?: string;
  isReply?: boolean;
}
const originSrc = ref();
const videoRef = ref();
const sourceRef = ref();

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
// const download = async () => {
//   const link = document.createElement("a");
//   if (!originSrc.value) {
//     await renderImage(true);
//   }
//   link.href = originSrc.value;
//   link.download = props.name;
//   link.click();
// };

defineExpose({
  // download,
});
</script>

<style lang="scss" scoped></style>
