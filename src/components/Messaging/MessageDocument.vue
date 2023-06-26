<template>
  <div class="message-item relative">
    <div
      class="bg-[#635eeb] rounded-lg p-3 mb-1.5 border-l-4 border-l-blue-300 break-words"
      :class="[isSend ? 'bg-[#635eeb]' : 'bg-[#ffffff]']"
    >
      <q-icon name="text_snippet" size="md" />
      <span class="">{{ decodeURIComponent(name) }}</span>
    </div>
    <div v-if="caption">
      <span class="">{{ caption }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api } from "src/boot/axios";

interface Props {
  src?: string;
  name?: string;
  caption?: string;
  isSend?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  src: "",
  name: "",
  caption: "",
  isSend: false,
});

const download = async () => {
  const link = document.createElement("a");
  const { data } = await api.get(`${process.env.BACKEND_URL}${props.src}`, {
    responseType: "blob",
  });

  link.href = (window.URL || window.webkitURL).createObjectURL(data);
  link.download = props.name || "temp";
  link.click();
};
defineExpose({
  download,
});
</script>
