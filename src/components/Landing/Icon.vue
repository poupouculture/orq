<script setup lang="ts">
import { Icon, Alignment, IContent } from "src/types/LandingPageTypes";
import { useQuasar } from "quasar";
import { computed } from "vue";

const props = defineProps<{
  content?: Icon;
}>();

const $q = useQuasar();

// Computed

const displayedContent = (data: IContent) => {
  return $q.platform.is.mobile
    ? data?.content_mobile ?? data?.content_mobile
    : data?.content;
};

const cardIconStyle = computed(() => {
  return props.content?.raw && props.content?.raw.cardIconStyle
    ? props.content?.raw.cardIconStyle
    : {
        background: "white",
        color: "black",
        padding: "0px 0px 20px 0px",
      };
});

const style = computed(() => {
  return props.content?.raw && props.content?.raw.style
    ? props.content?.raw.style
    : {
        padding: "40px 0px",
      };
});

// Methods

const textAligment = (alignment: Alignment) => {
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
  <div class="w-full flex justify-center" :style="style">
    <article class="prose max-w-none">
      <h1 class="text-center">{{ content?.name }}</h1>

      <div class="flex justify-center mx-3">
        <article v-html="displayedContent(content)" class="prose" />
      </div>

      <div class="grid lg:p-4 gap-10 w-full md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(children, index) in content?.children"
          :key="index"
          class="flex rounded-lg drop-shadow-2xl w-full md:w-full lg:w-full xl:w-[380px] items-center flex-col"
          :style="cardIconStyle"
        >
          <div class="w-full flex justify-center">
            <q-img
              no-spinner
              class="rounded-borders"
              :src="children.icon"
              :style="children.raw"
            />
          </div>

          <div class="mx-2">
            <p
              class="mb-0 text-center text-[#403F3F] flex gap-3 items-center uppercase text-[24px]"
            >
              {{ children.name }}
            </p>
          </div>

          <span
            :class="textAligment(children.alignment)"
            class="font-normal w-[350px] capitalize text-[#5C5A8F] text-start leading-10 text-lg"
          >
            <article
              v-html="displayedContent(children)"
              class="prose max-w-none px-4"
            />
          </span>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss"></style>
