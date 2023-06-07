<template>
  <div class="flex items-center">
    <q-icon name="text_snippet" size="md" />
    <div>
      <span class="">{{ decodeURIComponent(name) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api } from "src/boot/axios";

interface Props {
  src?: string;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: "",
  name: "",
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
