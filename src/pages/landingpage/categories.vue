<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Hero from "src/components/LandingPage/hero.vue";
import Banner from "src/components/LandingPage/banner.vue";
import useCategories from "src/stores/modules/categories";

const categories = useCategories();
const router = useRouter();

const allCategories = computed(() => {
  return categories.allCategories;
});

const content = computed(() => {
  return {
    img: "https://cdn.quasar.dev/img/parallax2.jpg",
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate voluptatibus quibusdam accusantium laudantium ea, adipisci veritatis laboriosam amet delectus quod enim quisquam ex, rem inventore accusamus atque, reprehenderit molestias? Fugiat! Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur illo doloribus quasi dolorem cumque delectus, praesentium magni possimus aliquam porro consectetur sunt rerum ex architecto, facere alias voluptate voluptates consequatur!",
  };
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
  <Hero class="justify-center">
    <div class="w-full">
      <div
        class="flex flex-col items-center justify-center font-['Inter'] capitalize text-[55px] gap-3 lg:gap-0 lg:text-[70px] font-black text-white"
      >
        <p class="text-center">Products categories</p>
      </div>
    </div>
  </Hero>

  <div class="w-full flex justify-center flex-col min-h-screen items-center">
    <div class="w-full container my-5">
      <Banner :content="content" />
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
