<template>
  <div
    class="absolute top-0 bottom-0 right-0 w-px z-10 hover:bg-primary hover:cursor-col-resize active:bg-primary"
    :style="{
      backgroundColor: backgroundColor,
    }"
    @mousedown="onmousedown"
  ></div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
const emits = defineEmits(["update"]);
const dragged = ref(false);
const positionX = ref(0);
const backgroundColor = ref("");
const onmousedown = (e: any) => {
  dragged.value = true;
  positionX.value = e.clientX;
  document.documentElement.style.cursor = "col-resize";
  document.documentElement.style.userSelect = "none";
};

const onmouseup = async () => {
  dragged.value = false;
  backgroundColor.value = "";
  document.documentElement.style.cursor = "";
  document.documentElement.style.userSelect = "";
};
const onmousemove = (e: any) => {
  if (dragged.value) {
    // styleObj.right += positionX.value - e.clientX;
    emits("update", positionX.value - e.clientX);
    positionX.value = e.clientX;
    // styleObj.right = 0;
  }
};
onMounted(() => {
  document.addEventListener("mouseup", onmouseup);
  document.addEventListener("mousemove", onmousemove);
});
onBeforeUnmount(() => {
  document.removeEventListener("mouseup", onmouseup);
  document.removeEventListener("mousemove", onmousemove);
});
</script>
