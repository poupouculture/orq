<script setup lang="ts">
import useLandingPage from "src/stores/modules/landingpage";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useQuasar } from "quasar";
import { IContent } from "src/types/LandingPageTypes";
import type { CSSProperties } from "vue";

const landingPageStore = useLandingPage();
const { getComponent } = storeToRefs(landingPageStore);
const whatsapp = computed<IContent>(() =>
  getComponent.value.content.find((item: IContent) => item.type === "whatsapp")
);
const defaultImageStyle: CSSProperties = { width: "4rem", height: "4rem" };
const defaultImageStyleMobile: CSSProperties = {
  width: "3rem",
  height: "3rem",
};
const defaultContainerStyle: CSSProperties = {
  bottom: "1.25rem",
  right: "1.75rem",
  zIndex: 999,
};
const $q = useQuasar();
const isMobile = computed(() => $q.platform.is.mobile);
const containerStyle = computed(() => {
  return isMobile.value
    ? whatsapp.value.raw?.containerMobileStyle || defaultContainerStyle
    : whatsapp.value.raw?.containerStyle || defaultContainerStyle;
});
</script>
<template>
  <div v-if="whatsapp" class="fixed" :style="containerStyle">
    <a
      :href="`https://wa.me/${whatsapp.raw?.number || '+85268050931'}`"
      target="_blank"
    >
      <img
        :src="whatsapp.image || ''"
        :style="[
          isMobile
            ? whatsapp.raw?.imageStyleMobile || defaultImageStyleMobile
            : whatsapp.raw?.imageStyle || defaultImageStyle,
        ]"
      />
    </a>
  </div>
</template>
