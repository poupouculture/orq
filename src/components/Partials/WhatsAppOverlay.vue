<script setup lang="ts">
import useLandingPage from "src/stores/modules/landingpage";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const landingPageStore = useLandingPage();
const { getComponent } = storeToRefs(landingPageStore);
const whatsapp = computed(() =>
  getComponent.value.content?.find((item) => item.type === "whatsapp")
);
</script>
<template>
  <div v-if="whatsapp" class="fixed bottom-5 right-7 z-[99999999]">
    <a :href="`https://wa.me/${whatsapp.raw.number}`" target="_blank">
      <img :src="whatsapp.image" class="w-20 h-20" />
    </a>
  </div>
</template>
