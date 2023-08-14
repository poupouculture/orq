<script setup>
import { Vue3Marquee } from "vue3-marquee";
// const imgArray = [
//   "https://sponsors.vuejs.org/images/vueschool.avif",
//   "https://sponsors.vuejs.org/images/vehikl.avif",
//   "https://sponsors.vuejs.org/images/dronahq.avif",
// ];
defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <Vue3Marquee direction="reverse" :duration="5">
    <img
      v-for="(img, i) in content.children"
      :key="i"
      :src="img.icon"
      class="w-32 h-32 object-cover mx-6"
    />
  </Vue3Marquee>
  <!-- <div class="w-full h-32 relative items-center overflow-x-hidden"> -->
  <!-- <div
      ref="items"
      class="clientsItem relative max-h-40 w-full overflow-x-hidden gap-x-4 top-0 no-wrap left-0 flex lg:gap-[100px] py-2"
    >
      <q-img
        v-for="(image, index) in content.children"
        :key="index"
        class="rounded-borders"
        :src="image.icon"
        no-spinner
        style="max-width: 150px"
      />
    </div> -->
  <!-- </div> -->
</template>

<style scoped lang="scss">
@keyframes moveAcross {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.clientsItem {
  animation: moveAcross 10s linear infinite;
}
.clientsItem2 {
  animation: moveAcross 10s linear infinite;
  animation-delay: 6000ms;
}
</style>
