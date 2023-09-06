<script setup lang="ts">
import useLandingPage from "src/stores/modules/landingpage";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useQuasar } from "quasar";

const landingPageStore = useLandingPage();
const { getComponent } = storeToRefs(landingPageStore);
const whatsapp = computed(() =>
  getComponent.value.content?.find((item) => item.type === "whatsapp")
);
const defaultImageStyle = "width: 5rem; height: 5rem";
const $q = useQuasar();
const isMobile = computed(() => $q.platform.is.mobile);
</script>
<template>
  <div v-if="whatsapp" class="fixed bottom-5 right-7 z-[99999999]">
    <a :href="`https://wa.me/${whatsapp.raw.number}`" target="_blank">
      <img
        :src="whatsapp.image"
        :style="[
          isMobile
            ? whatsapp.raw?.imageStyleMobile || defaultImageStyle
            : whatsapp.raw?.imageStyle || defaultImageStyle,
        ]"
      />
    </a>
  </div>
</template>
