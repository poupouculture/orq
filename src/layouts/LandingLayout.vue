<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Navbar from "src/components/Landing/navbar.vue";
import { Screen } from "quasar";
import logo from "assets/images/logo.svg";
import useLandingPage from "src/stores/modules/landingpage";

const useLandingPageStore = useLandingPage();
const router = useRouter();
const route = useRoute();
const leftDrawerOpen = ref(false);

const drawer = computed({
  get() {
    if (Screen.name === "lg") {
      return false;
    } else {
      return leftDrawerOpen.value;
    }
  },
  set() {
    leftDrawerOpen.value = false;
  },
});

const navigation = computed(() => {
  return useLandingPageStore.allNavigation;
});

watch(drawer, (value) => {
  if (!value) leftDrawerOpen.value = false;
});

watch(route, async () => {
  await getPagesContent();
});

// Methods

const getComponentById = async (id, url) => {
  await useLandingPageStore.getComponentByid(id);
  router.push(url);
};

const getPagesContent = async () => {
  const component = navigation.value.find((item) => item.name === route.name);

  if (component) {
    await useLandingPageStore.getComponentByid(component.id);
  } else {
    useLandingPageStore.component = {};
  }
};

onMounted(async () => {
  await useLandingPageStore.getAll();

  await getPagesContent();
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <div class="w-full p-5 absolute flex justify-center">
      <div class="container">
        <Navbar @open="leftDrawerOpen = !leftDrawerOpen" />
      </div>
    </div>

    <q-page-container>
      <div class="bg-white font-['Red_Hat_Display']">
        <router-view></router-view>
      </div>

      <div class="w-full flex bg-[#4B44F6] justify-center">
        <div
          class="container flex flex-col gap-4 sm:flex-row items-center sm:justify-between p-6 mx-6"
        >
          <div class="flex justify-center items-center gap-3">
            <img class="w-[40px]" :src="logo" alt="logo" />
            <p class="font-[800] text-white text-2xl">ChaQ</p>
          </div>

          <span class="text-white order-3 sm:order-2">
            Copyright
            {{ new Date().getFullYear() }} Synque.io
          </span>

          <div class="flex text-[#4B44F6] sm:order-3 justify-center gap-5">
            <div class="rounded-full flex items-center p-1 bg-white">
              <q-icon size="20px" name="fa-brands fa-facebook-f" />
            </div>

            <div class="rounded-full flex items-center p-1 bg-white">
              <q-icon size="20px" name="fa-brands fa-instagram" />
            </div>
          </div>
        </div>
      </div>
    </q-page-container>

    <q-drawer
      mini-to-overlay
      :show-if-above="false"
      v-model="drawer"
      side="left"
      bordered
    >
      <q-list padding class="rounded-borders">
        <q-item
          clickable
          v-ripple
          @click="getComponentById(navigate.id, navigate.url)"
          v-for="(navigate, index) in navigation"
          :key="index"
        >
          <q-item-section> {{ navigate.name }} </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </q-layout>
</template>

<style scoped></style>
