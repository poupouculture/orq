<script setup>
import { ref } from "vue";

const props = defineProps({
  content: {
    type: Object,
  },
});

const slide = ref(1);
const onHover = ref(false);
</script>

<template>
  <div class="" v-if="props.content">
    <div class="flex flex-col gap-4">
      <div
        class="row"
        v-for="(data, index) in props.content.content"
        :key="index"
      >
        <div v-if="data.type === 'carousel'" class="w-full mb-3 mx-5">
          <q-carousel
            animated
            v-model="slide"
            navigation
            arrows
            :autoplay="onHover ? 0 : data.raw.time"
            infinite
          >
            <q-carousel-slide
              draggable
              v-for="(carousel, childrenIndex) in data.children"
              :key="childrenIndex"
              :name="childrenIndex + 1"
              class="cursor-pointer"
              @mouseover="onHover = !onHover"
              :img-src="carousel.image"
            />
          </q-carousel>
        </div>

        <div
          v-else-if="data.type === 'text_with_side_images'"
          class="grid md:grid-cols-2 gap-4 mx-4 my-5 w-full"
        >
          <div
            :class="
              data.alignment === 'left' ? 'order-1 lg:order-2' : 'order-1'
            "
            class="col-span-1"
          >
            <q-img
              class="rounded-borders"
              :src="data.image"
              style="height: 280px"
            />
          </div>

          <div
            :class="data.alignment === 'left' ? 'order-1' : 'order-2'"
            class="col-span-1 flex flex-col"
          >
            <div class="content" v-html="data.content"></div>
          </div>
        </div>

        <div v-else-if="data.type === 'text_with_background'" class="w-full">
          <div
            :class="
              data.alignment === 'right' ? 'justify-end' : 'justify-start'
            "
            class="min-h-[500px] p-6 bg-center flex bg-cover"
            :style="{ backgroundImage: `url(${data.image})` }"
          >
            <div class="md:w-1/2 w-full">
              <div class="content" v-html="data.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  :deep(h1, h2, h3) {
    font-weight: 700 !important;
  }

  :deep(h1) {
    font-size: 36px !important;
    line-height: 46px !important;
  }

  :deep(h2) {
    font-size: 24px !important;
    line-height: 34px !important;
  }

  :deep(h3) {
    font-size: 19px !important;
    line-height: 29px !important;
  }

  :deep(p) {
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    margin: 1.5em 0;
  }

  :deep(ul) {
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    margin: 1.5em 0;
    padding-left: 20px;
    list-style-type: disc;
  }

  :deep(ol) {
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    margin: 1.5em 0;
    padding-left: 20px;
    list-style-type: decimal;
  }
}
</style>
