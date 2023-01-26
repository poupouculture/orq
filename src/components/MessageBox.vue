<template>
  <Transition name="message">
    <div
      v-if="show"
      class="bg-[#E2E4ED]/80 px-5 lg:px-10 py-6 mt-5 rounded-lg lg:flex-row no-warp items-center relative flex flex-col space-y-5"
    >
      <img :src="image" class="w-40 m-auto h-24" />
      <div
        class="lg:ml-8 flex-1 h-full sm:mt-10 lg:mt-0 text-center lg:text-left"
      >
        <h3
          class="leading-none sm:text-left text-lg font-semibold"
          style="color: #333"
        >
          {{ title }}
        </h3>
        <p class="mt-2 sm:text-left text-sm text-[#9A9AAF]">
          {{ message }}
        </p>
      </div>
      <button
        @click="emit('click', false)"
        class="cursor-pointer absolute right-5 lg:right-7 text-[#9A9AAF] text-lg top-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-x"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M18 6l-12 12m0 -12l12 12"></path>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import image from "src/assets/images/service-record.png";

defineProps({
  title: String,
  message: String,
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);
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

.message-enter-active,
.message-leave-active {
  transition: all 0.4s ease;
}
</style>
