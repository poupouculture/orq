<script setup lang="ts">
import { ref, computed } from "vue";
import Wysiwyg from "src/components/Landing/Wysiwyg.vue";
import VideoIframe from "src/components/Landing/VideoIframe.vue";
import { IcontentBackground, Alignment } from "src/types/LandingPageTypes";
import { useQuasar } from "quasar";

const props = defineProps<{
  content?: IcontentBackground;
}>();

const $q = useQuasar();

const unmute = ref(false);

const displayedContent = computed(() => {
  return $q.platform.is.mobile
    ? props.content?.content_mobile ?? props.content?.content
    : props.content?.content;
});

// Computed
const imageStyle = computed(() => {
  return {
    // backgroundStyle is for replacing background image (absolute) to background relative size
    ...(props.content?.raw && props.content?.raw.backgroundImageStyle
      ? // check if mobile screen and backgroundImageMobile exists, use it.
        $q.platform.is.mobile
        ? props.content?.raw.backgroundImageMobileStyle
          ? props.content?.raw.backgroundImageMobileStyle
          : props.content?.raw.backgroundImageStyle
        : props.content?.raw.backgroundImageStyle
      : !props.content?.raw?.backgroundStyle
      ? {
          minHeight: "700px",
        }
      : {}),
    paddingLeft: "1em",
    paddingRight: "1em",
  };
});

const overlay = computed(() => {
  return props.content?.raw && props.content?.raw.overlayColor
    ? { background: props.content?.raw.overlayColor }
    : {};
});

const volumeColorIcon = computed(() => {
  return props.content?.raw && props.content?.raw.volumeStyle
    ? props.content?.raw.volumeStyle
    : { color: "white" };
});

// Methods

const textAligment = (alignment: Alignment) => {
  if (alignment === Alignment.CENTER) {
    return "justify-center items-center";
  } else if (alignment === Alignment.LEFT) {
    return "justify-start items-start";
  } else if (alignment === Alignment.RIGHT) {
    return "justify-end items-end";
  }
};

const contentTextAlignment = (alignment: Alignment) => {
  if (alignment === Alignment.CENTER) {
    return "text-center";
  } else if (alignment === Alignment.LEFT) {
    return "text-start";
  } else if (alignment === Alignment.RIGHT) {
    return "text-end";
  }
};
</script>

<template>
  <div
    class="w-full"
    :style="
      content?.raw !== null && content?.raw.style ? content.raw.style : ''
    "
  >
    <div
      class="w-full relative bg-[#2E2E3A]"
      v-if="content?.raw && !content?.raw.hasOwnProperty('videoId')"
      :class="[
        textAligment(content.alignment),
        content.raw?.backgroundStyle ? 'md:px-16 !pb-10 md:pb-0' : '',
      ]"
      :style="content.raw?.backgroundStyle ? content.raw?.backgroundStyle : ''"
    >
      <div
        v-if="!content.raw?.backgroundStyle"
        class="bg-center flex bg-no-repeat bg-cover"
        :style="{ backgroundImage: `url(${content.image})`, ...imageStyle }"
      ></div>

      <div
        :style="{ ...overlay, ...imageStyle }"
        class="items-center flex top-0 bottom-0 w-full"
        :class="{ absolute: !content.raw?.backgroundStyle }"
      >
        <template v-if="content?.alignment === 'row'">
          <div
            v-for="(children, index) in content.children"
            :key="index"
            :class="children.alignment === 'left' ? 'order-1' : 'order-2'"
            class="md:w-1/2 w-full"
          >
            <Wysiwyg :content="children" />
          </div>
        </template>
        <div v-else class="md:w-1/2 w-full" :style="content?.raw?.wrapperStyle">
          <article
            v-html="displayedContent"
            :class="contentTextAlignment(content.alignment)"
            class="prose max-w-none"
          />
        </div>
      </div>
    </div>

    <div
      v-else-if="content?.alignment === 'row'"
      class="bg-center flex bg-no-repeat bg-cover"
      :style="{ backgroundImage: `url(${content.image})`, ...imageStyle }"
    >
      <div
        v-for="(children, index) in content.children"
        :key="index"
        :class="children.alignment === 'left' ? 'order-1' : 'order-2'"
        class="md:w-1/2 w-full"
      >
        <Wysiwyg :content="children" />
      </div>
    </div>

    <template v-else>
      <div
        v-if="content?.raw && content?.raw.hasOwnProperty('videoId')"
        class="w-full relative"
      >
        <VideoIframe :content="content" :unmute="unmute" />

        <div class="w-full">
          <div
            :style="overlay"
            class="flex justify-center items-center absolute top-0 bottom-0 w-full"
          >
            <div
              :class="textAligment(content.alignment)"
              class="w-full relative flex flex-col mx-5 md:gap-4 sm:gap-2"
            >
              <article
                v-html="displayedContent"
                :class="contentTextAlignment(content.alignment)"
                class="prose max-w-none"
              />

              <div class="absolute right-10 -bottom-64">
                <q-icon
                  @click="unmute = !unmute"
                  class="cursor-pointer"
                  size="sm"
                  :name="unmute ? 'volume_up' : 'volume_off'"
                  :style="volumeColorIcon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@media (max-width: $breakpoint-xs-max) {
  :deep(article span#title) {
    font-family: "Impact", sans-serif !important;
    font-weight: 700 !important;
  }
}
</style>
