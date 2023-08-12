<script setup>
defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div class="w-full h-32 relative flex items-center">
    <div
      class="relative w-full overflow-x-hidden top-0 no-wrap left-0 flex gap-[100px] py-2"
    >
      <q-img
        v-for="(image, index) in content.children"
        :key="index"
        class="rounded-borders clientsItem"
        :src="image.icon"
        style="max-width: 150px"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes moveAcross {
  0% {
    transform: translateX(-1800px);
  }
  100% {
    transform: translateX(1800px);
  }
}

.clientsItem {
  animation: moveAcross 15s linear infinite;
}
</style>
