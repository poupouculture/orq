<template>
  <Teleport to="body">
    <Transition name="message">
      <div
        v-if="modelValue"
        class="message fixed select-none px-6 py-4 text-xs text-gray-500 rounded-md"
      >
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  modelValue: Boolean,
  message: String,
  duration: {
    type: [String, Number],
    default: 3000,
  },
});

const emit = defineEmits(["update:modelValue"]);

onMounted(() => {
  setTimeout(() => {
    emit("update:modelValue", false);
  }, Number(props.duration));
});
</script>

<style lang="scss" scoped>
.message {
  @apply top-5;
  min-width: 300px;
  left: 50%;
  background-color: #edf2fc;
  transform: translateX(-50%);
}

.message-enter-from {
  transform: translate(-50%, -100px);
}

.message-enter-active {
  transition: all 0.3s ease-out;
}

.message-enter-to {
  transform: translate(-50%, 0);
  opacity: 1;
}

.message-leave-from {
  transform: translate(-50%, 0);
  opacity: 1;
}

.message-leave-active {
  transition: all 0.4s ease-out;
}

.message-leave-to {
  transform: translate(-50%, -100px);
}
</style>
