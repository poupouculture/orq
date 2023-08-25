<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Navbar from "src/components/Landing/navbar.vue";
import { Screen } from "quasar";
import useLandingPage from "src/stores/modules/landingpage";

const useLandingPageStore = useLandingPage();
const router = useRouter();
const route = useRoute();
const leftDrawerOpen = ref(false);
const defaultStyle = ref({
  backgroundColor: "#4b44f6",
  color: "#FFFFFF",
});
const mediaSocialStyle = ref({
  push: true,
  size: "sm",
  round: true,
  style: {
    background: "#ffffff",
  },
  textColor: "primary",
});

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

const mobileNavigation = computed(() => {
  return useLandingPageStore.topNavigation[0];
});

const topNavbar = computed(() => {
  return useLandingPageStore.topNavigation[0];
});

const navbarStyle = computed(() => {
  return useLandingPageStore.topNavigation[0]?.raw
    ? useLandingPageStore.topNavigation[0]?.raw
    : defaultStyle.value;
});

const socialMediabBtn = computed(() => {
  return bottomNavigation.value?.raw &&
    bottomNavigation.value.raw.socialMediaBtn
    ? bottomNavigation.value.raw.socialMediaBtn
    : mediaSocialStyle.value;
});

const currentComponent = computed(() => {
  return useLandingPageStore.getComponent.heroText;
});

const iconStyle = computed(() => {
  return bottomNavigation.value?.raw && bottomNavigation.value?.raw.iconSize
    ? bottomNavigation.value?.raw.iconSize
    : {
        width: 100,
      };
});

const bottomStyle = computed(() => {
  return bottomNavigation.value?.raw && bottomNavigation.value?.raw.style
    ? bottomNavigation.value?.raw.style
    : defaultStyle.value;
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

  if (parent) {
    const component = parent.pages.find((children) => {
      return children.url === currentRoutename;
    });

    if (component) {
      await useLandingPageStore.getComponentByid(component.id);
    }
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
    <q-page-container>
      <div
        :style="navbarStyle"
        :class="{ 'absolute z-10': currentComponent }"
        class="w-full p-5 flex justify-center"
      >
        <div class="container">
          <Navbar @open="leftDrawerOpen = !leftDrawerOpen" />
        </div>
      </div>
      <div class="bg-white font-['Red_Hat_Display']">
        <router-view></router-view>
      </div>

      <div class="w-full flex justify-center" :style="bottomStyle">
        <div
          class="container flex flex-col gap-4 sm:flex-row sm:justify-between p-6 mx-6"
        >
          <template
            v-if="
              bottomNavigation?.raw &&
              bottomNavigation?.raw.footerStyle === 'flex'
            "
          >
            <div class="grid md:grid-cols-3 gap-4 w-full">
              <div class="col-span-1 order-1">
                <div>
                  <img
                    v-bind="iconStyle"
                    :src="bottomNavigation?.icon"
                    alt="logo"
                  />
                </div>
              </div>

              <div
                class="col-span-1 order-3 md:order-2 items-center flex md:justify-center"
              >
                <span class="order-3 sm:order-2">
                  Copyright
                  {{ new Date().getFullYear() }} Synque.io
                </span>
              </div>

              <div class="col-span-1 order-2 md:order-3 flex md:justify-end">
                <div
                  v-if="bottomNavigation"
                  class="w-50 text-end flex flex-wrap md:justify-end gap-3"
                >
                  <a
                    class="cursor-pointer"
                    v-for="(url, index) in bottomNavigation?.pages"
                    :key="index"
                    @click="getComponentById(url.id, url.url)"
                  >
                    {{ url.name }}
                  </a>
                </div>

                <div
                  v-if="
                    bottomNavigation?.raw &&
                    bottomNavigation?.raw.socialMediaItems !== null
                  "
                  class="mt-3 items-center flex gap-3 w-full md:justify-end"
                >
                  <div
                    v-for="data in bottomNavigation?.raw.socialMediaItems"
                    :key="data"
                  >
                    <q-btn
                      target="_blank"
                      v-bind="{ ...data, ...socialMediabBtn }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div
              class="flex flex-col order-2 mt-4 lg:order-1 gap-4 w-56 justify-between"
            >
              <div class="flex flex-col">
                <div class="flex items-center gap-3">
                  <div>
                    <img
                      v-bind="iconStyle"
                      :src="bottomNavigation?.icon"
                      alt="logo"
                    />
                  </div>
                  <div>
                    <p class="font-[800] text-white text-2xl">
                      {{ topNavbar?.logo }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="
                    bottomNavigation?.raw &&
                    bottomNavigation?.raw.socialMediaItems !== null
                  "
                  class="mt-3 flex gap-3"
                >
                  <div
                    v-for="data in bottomNavigation?.raw.socialMediaItems"
                    :key="data"
                  >
                    <q-btn
                      target="_blank"
                      v-bind="{ ...data, ...socialMediabBtn }"
                    />
                  </div>
                </div>
              </div>

              <span class="order-3 sm:order-2">
                Copyright
                {{ new Date().getFullYear() }} Synque.io
              </span>
            </div>

            <div
              class="flex order-1 lg:order-2 items-center w-48 sm:order-3 flex-col justify-center gap-5"
            >
              <div
                v-if="bottomNavigation"
                class="grid w-full gap-10 grid-cols-2"
              >
                <a
                  class="cursor-pointer"
                  v-for="(url, index) in bottomNavigation?.pages"
                  :key="index"
                  @click="getComponentById(url.id, url.url)"
                >
                  {{ url.name }}
                </a>
              </div>
            </div>
          </template>
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
          v-for="(navigate, index) in mobileNavigation?.pages"
          :key="index"
        >
          <q-item-section> {{ navigate.name }} </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </q-layout>
</template>

<style scoped></style>
