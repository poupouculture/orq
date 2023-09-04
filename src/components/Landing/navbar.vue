<script setup lang="ts">
import { computed } from "vue";
import menuIcon from "assets/images/menu.png";
import { useRouter } from "vue-router";
import useLandingPage from "src/stores/modules/landingpage";
import MenuNavigation from "src/components/Landing/Navbar/MenuNavigation.vue";

const useLandingPageStore = useLandingPage();
const router = useRouter();

// Computed
const navigation = computed(() => {
  return useLandingPageStore.topNavigation[0];
});
const menuNavigation = computed(() => {
  return useLandingPageStore.menuNavigation;
});

const iconStyle = computed(() => {
  return navigation.value?.raw.iconSize
    ? navigation.value?.raw.iconSize
    : {
        width: 100,
      };
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
      <img v-bind="iconStyle" :src="navigation?.icon" />
      <p class="font-[800] text-white text-2xl">
        {{ navigation?.logo }}
      </p>
    </router-link>
    <div
      v-if="navigation"
      :class="{
        'gap-5': $q.platform.is.desktop,
        'gap-1': $q.platform.is.mobile,
      }"
      class="flex items-center"
    >
      <button
        @click="getComponentById(navigate.id, navigate.url)"
        v-for="(navigate, index) in navigation?.pages"
        :key="index"
        class="text-lg font-bold"
        :class="{ hidden: $q.screen.lt.lg }"
      >
        {{ navigate.name }}
      </button>
      <template v-if="menuNavigation.length">
        <button
          v-for="(nav, index) in menuNavigation"
          :key="index"
          class="text-lg font-bold"
          :class="{ hidden: $q.screen.lt.lg }"
          type="button"
        >
          <MenuNavigation :nav="nav" />
        </button>
      </template>

      <a
        :class="{
          'px-2': $q.platform.is.mobile,
          'px-5 py-2.5': $q.platform.is.desktop,
        }"
        href="https://wa.me/+85268050931"
        target="_blank"
        class="py-1 px-3 mr-1 text-white border border-white uppercase font-bold tracking-widest"
      >
        Call Now
      </a>

      <q-btn
        v-if="$q.screen.lt.lg"
        @click="$emit('open')"
        class="text-black"
        :size="$q.platform.is.mobile ? 'sm' : 'md'"
        round
        color="white"
      >
        <img class="menu-icon" :src="menuIcon" />
      </q-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-icon {
  width: 20px;
}
@media screen and (max-width: $breakpoint-xs-max) {
  :deep(.navbar) {
    padding: 5px;
  }
  .menu-icon {
    width: 15px;
  }
}
</style>
