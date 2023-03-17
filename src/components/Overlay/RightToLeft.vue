<template>
  <div
    class="fixed w-full min-h-screen bg-black/50 z-[1000] top-0 bottom-0 right-0 flex justify-end"
    @click="showContent = false"
  >
    <Transition name="right-to-left" appear @after-leave="close()">
      <div
        class="w-8/12 h-full bg-white px-5 py-6 overflow-y-scroll"
        @click.stop
        v-if="showContent"
      >
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { ref } from "vue";

const emits = defineEmits(["submit", "changePage", "close", "search"]);
const showContent = ref(true);
const close = () => {
  emits("close");
};
</script>
