<template>
  <Transition name="message">
    <div v-if="show" class="bg-grey-4 px-10 py-4 mt-5 rounded-md md:flex no-warp items-center relative">
      <div class="w-40 m-auto h-24 bg-blue-500"></div>
      <div class="ml-8 flex-1 h-full sm:mt-10 md:mt-0">
        <h3 class="leading-none sm:text-left text-lg font-semibold" style="color: #333;">{{ title }}</h3>
        <p class="mt-6 mr-10 sm:text-left text-sm text-gray-500">{{ message }}</p>
      </div>
      <button @click="emit('click', false)" class="cursor-pointer absolute right-8 text-gray-500 text-lg top-5">x</button>
    </div>
  </Transition>
</template>

<script>

export default {
  name: 'MessageBox'
}
</script>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  title: String,
  message: String,
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

</script>

<style lang="scss" scoped>
.message-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.message-enter-to {
  opacity: 1;
  transform: scale(1);
}

.message-leave-from {
  opacity: 1;
  transform: scale(1);
}

.message-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.message-enter-active, .message-leave-active {
  transition: all .4s ease;
}
</style>
