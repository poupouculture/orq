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

const bottomNavigation = computed(() => {
  return useLandingPageStore.bottomNavigation[0];
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
  let currentRoutename = "";

  if (route.path.substr(route.path.length - 1) === "/") {
    currentRoutename = route.path.substring(0, route.path.length - 1);
  } else {
    currentRoutename = route.path;
  }

  for (const item of navigation.value) {
    const component = item.pages.find(
      (children) => children.url === currentRoutename
    );

    if (component) {
      await useLandingPageStore.getComponentByid(component.id);
    }
  }

  const parent = await navigation.value.find((item) => {
    return item.pages.find((children) => {
      return children.url === currentRoutename;
    });
  });

  const component = parent.pages.find((children) => {
    return children.url === currentRoutename;
  });

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
          class="container flex flex-col gap-4 sm:flex-row sm:justify-between p-6 mx-6"
        >
          <div
            class="flex flex-col order-2 mt-4 lg:order-1 gap-4 w-56 justify-between"
          >
            <div class="flex flex-col">
              <div class="flex gap-3">
                <div>
                  <img class="w-[40px]" :src="logo" alt="logo" />
                </div>
                <div>
                  <p class="font-[800] text-white text-2xl">ChaQ</p>
                </div>
              </div>

              <div class="mt-3 text-white">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor
                ullam veritatis consequatur aut quis numquam sed consectetur
                illo, nemo aliquam eius nulla eveniet libero corporis quod,
                reprehenderit perferendis quas ducimus!
              </div>
            </div>

            <span class="text-white order-3 sm:order-2">
              Copyright
              {{ new Date().getFullYear() }} Synque.io
            </span>
          </div>

          <div
            class="flex order-1 lg:order-2 items-center w-48 sm:order-3 flex-col justify-center gap-5"
          >
            <div
              v-if="bottomNavigation"
              class="grid text-white w-full gap-10 grid-cols-2"
            >
              <a
                class="cursor-pointer"
                v-for="(url, index) in bottomNavigation?.pages"
                :key="index"
                @click="getComponentById(url.id, url.url)"
              >
                {{ url.name }}
              </a>

              <div class="col-span-2 text-[#4B44F6] gap-5 flex items-center">
                <div class="rounded-full flex items-center p-1 bg-white">
                  <q-icon size="20px" name="fa-brands fa-facebook-f" />
                </div>
                <div class="rounded-full flex items-center p-1 bg-white">
                  <q-icon size="20px" name="fa-brands fa-instagram" />
                </div>
              </div>
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
