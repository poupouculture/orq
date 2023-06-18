<template>
  <div
    class="fixed w-full min-h-screen bg-black/50 z-[1000] top-0 bottom-0 right-0 flex justify-end"
    @click="showContent = false"
  >
    <Transition name="right-to-left" appear @after-leave="closeOverlay()">
      <div
        class="w-full md:w-10/12 lg:w-8/12 h-full bg-white px-5 py-6 overflow-y-scroll"
        @click.stop
        v-if="showContent"
      >
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";

const emits = defineEmits(["close", "update:modelValue"]);
const props = defineProps({
  close: {
    type: Boolean,
    default: false,
  },
});
const showContent = ref(true);
watch(
  () => props.close,
  () => {
    showContent.value = false;
  }
);
const closeOverlay = () => {
  emits("close");
};
</script>
