<template>
  <q-layout view="hHh LpR fFf">
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="288"
      :breakpoint="768"
      bordered
      class="drawerclass"
    >
      <q-scroll-area class="fit">
        <div class="drawer-content">
          <div class="logo-holder">
            <img src="../../src/assets/images/logo.png" />
          </div>
          <div class="input-holder">
            <SearchInput />
          </div>
        </div>

        <q-list>
          <q-item>
            <router-link to="/" style="text-decoration: none; color: inherit">
              <div class="icon-text">
                <q-icon
                  size="sm"
                  color="white"
                  name="dashboard"
                  style="margin-right: 7px"
                />
                <p class="drawer-text">Dashboard</p>
              </div>
            </router-link>
          </q-item>
        </q-list>
        <div v-for="(menu, index) in menus" :key="index">
          <q-list class="q-pt-md q-pl-md q-pr-md">
            <q-expansion-item
              expand-separator
              :icon="menu.icon"
              :label="menu.pages_id.name"
              style="color: #fff"
              v-if="menu.pages_id.name !== 'Application Programs'"
            >
              <div
                v-for="(child, cIndex) in menu.pages_id.children"
                :key="cIndex"
              >
                <router-link
                  :to="child.url || ''"
                  style="text-decoration: none; color: inherit"
                >
                  <div
                    class="expanded-content"
                    :class="{ 'bg-primary py-2': route.path === child.url }"
                  >
                    <p class="drawer-text">{{ child.name }}</p>
                  </div>
                </router-link>
              </div>
            </q-expansion-item>
            <q-expansion-item
              :icon="menu.icon"
              :label="menu.pages_id.name"
              style="color: #fff"
              @click="router.push(menu.pages_id.url)"
              v-else
            >
            </q-expansion-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>
    <q-page-container class="main-container">
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
    <q-page-sticky expand position="top">
      <q-toolbar style="background: #f5f5f5">
        <MenuBar v-model="drawer" />
      </q-toolbar>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <router-link to="/messaging">
        <q-btn
          icon="forum"
          color="deep-purple-13"
          style="border-radius: 10px; height: 45px"
        >
          <q-badge
            rounded
            color="orange"
            floating
            style="height: 20px; width: 20px"
            >3</q-badge
          >
        </q-btn>
      </router-link>
    </q-page-sticky>
  </q-layout>
</template>

<script setup>
import "../components/SideDrawer/drawer.scss";
import "./DrawerLayout.scss";
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import MenuBar from "src/components/MenuBar/MenuBar.vue";
import SearchInput from "src/components/SearchInput.vue";
import useUserInfoStore from "stores/modules/userInfo";
import { pageCodes } from "../utils/page-codes";

const userInfo = useUserInfoStore();
const drawer = ref(true);
const router = useRouter();
const route = useRoute();

const menus = computed(() => {
  const pages = userInfo.userProfile.role.pages;

  const menus = pages
    .filter((page) => {
      if (page.pages_id && !page.pages_id.parent_id) {
        // no parent_id
        return pageCodes.some((f) => f.id === page.pages_id.id);
      }
      return false;
    })
    .map((page) => {
      const code = pageCodes.find((code) => code.id === page.pages_id.id);
      page.icon = code.icon;
      return page;
    });

  return menus;
});
</script>

<style scoped>
.input-holder {
  width: 250px;
  margin-top: 20px;
}

.icon-text {
  display: flex;
  flex-direction: row;
  width: 250px;
  margin-left: 20px;
  margin-top: 32px;
}

.search-field {
  margin-right: 10px;
}
</style>
