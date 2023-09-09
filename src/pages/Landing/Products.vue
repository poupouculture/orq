<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Hero from "src/components/Landing/Hero.vue";
import PageComponent from "src/components/Landing/PageComponent.vue";
import useCategories from "src/stores/modules/categories";
import { storeToRefs } from "pinia";

import useLandingPage from "src/stores/modules/landingpage";

const landingPageStore = useLandingPage();
const { getComponent } = storeToRefs(landingPageStore);
const categories = useCategories();
const router = useRouter();

const allCategories = computed(() => {
  return categories.allCategories;
});

const moveToDetails = async (id) => {
  localStorage.setItem("categoryId", id);

  router.push({ name: "landingcategoriesdetails" });
};

onMounted(() => {
  categories.getAll();
});
</script>

<template>
  <Hero v-if="getComponent.heroText" class="justify-center">
    <div class="w-full">
      <div
        class="flex flex-col items-center justify-center font-['Inter'] capitalize text-[55px] gap-3 lg:gap-0 lg:text-[70px] font-black text-white"
      >
        <p class="text-center">
          {{ getComponent.heroText }}
        </p>
      </div>
    </div>
  </Hero>

  <div class="w-full flex justify-center flex-col min-h-screen items-center">
    <div class="w-full container my-5">
      <PageComponent
        v-if="getComponent.content.length > 0"
        :content="getComponent"
      />
    </div>
    <div class="container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <button
        @click="moveToDetails(data.id)"
        v-for="(data, index) in allCategories"
        :key="index"
        class="justify-center items-center flex flex-col gap-3"
      >
        <img width="130" :src="data.image" alt="" />

        <span class="text-uppercase">
          {{ data.name }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
