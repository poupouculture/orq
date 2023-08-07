<script setup lang="ts">
import { computed } from "vue";
import logo from "assets/images/logo.svg";
import menuIcon from "assets/images/menu.png";
import { useRouter } from "vue-router";
import useLandingPage from "src/stores/modules/landingpage";

const useLandingPageStore = useLandingPage();
const router = useRouter();

// Computed
const navigation = computed(() => {
  return useLandingPageStore.allNavigation;
});

// Methods
const getComponentById = async (id: string, url: string) => {
  await useLandingPageStore.getComponentByid(id);
  router.push(url);
};
</script>

<template>
  <div class="navbar flex justify-between">
    <router-link
      :to="{ name: 'landingpage' }"
      class="flex justify-center items-center gap-3"
    >
      <img class="w-[50px]" :src="logo" alt="logo" />
      <p class="font-[800] text-white text-2xl">ChaQ</p>
    </router-link>
    <div class="flex items-center gap-5">
      <button
        @click="getComponentById(navigate.id, navigate.url)"
        v-for="(navigate, index) in navigation"
        :key="index"
        class="text-white text-lg font-bold"
        :class="{ hidden: $q.screen.lt.lg }"
      >
        {{ navigate.name }}
      </button>

      <button class="px-4 py-2 rounded-full bg-white/60 text-white">
        Get started
      </button>

      <q-btn
        v-if="$q.screen.lt.lg"
        @click="$emit('open')"
        class="text-black"
        size="md"
        round
        color="white"
      >
        <img class="w-[20px]" :src="menuIcon" />
      </q-btn>
    </div>
  </div>
</template>

<style scoped></style>