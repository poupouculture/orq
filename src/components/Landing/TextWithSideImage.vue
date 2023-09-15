<script setup lang="ts">
import { IContent, Alignment } from "src/types/LandingPageTypes";
import { ref, computed } from "vue";

const props = defineProps<{
  content?: IContent;
}>();

const defaultStyle = ref({
  margin: "10px",
});

const containerStyle = computed(() => {
  return props.content?.raw && props.content?.raw.style
    ? props.content?.raw.style
    : defaultStyle.value;
});

const aligment = computed(() => {
  if (
    props.content?.alignment === Alignment.ABOVE ||
    props.content?.alignment === Alignment.BELOW
  ) {
    return "md:grid-row-2";
  } else return "md:grid-cols-2";
});

const imagePosition = computed(() => {
  if (props.content?.alignment === Alignment.LEFT) {
    return "order-1 lg:order-2";
  } else if (props.content?.alignment === Alignment.ABOVE) {
    return "order-1";
  } else if (props.content?.alignment === Alignment.BELOW) {
    return "order-2";
  } else {
    return "order-1";
  }
});

const textPosition = computed(() => {
  if (props.content?.alignment === Alignment.LEFT) {
    return "order-1";
  } else if (props.content?.alignment === Alignment.ABOVE) {
    return "order-2";
  } else if (props.content?.alignment === Alignment.BELOW) {
    return "order-1";
  } else {
    return "order-2";
  }
});
</script>

<template>
  <div :class="aligment" class="grid gap-4 w-full" :style="containerStyle">
    <div :class="imagePosition" class="col-span-1">
      <q-img
        no-spinner
        class="rounded-borders"
        :src="content?.image"
        style="height: 380px"
      />
    </div>

    <div :class="textPosition" class="col-span-1 flex flex-col">
      <article v-html="content?.content" class="prose max-w-none" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
