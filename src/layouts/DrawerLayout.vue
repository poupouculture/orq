<template>
  <q-layout view="hHh LpR fFf">
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="288"
      :breakpoint="500"
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

        <div v-for="(menu, index) in menus" :key="index">
          <q-list bordered v-if="menu.hasSubMenu" class="q-pa-md">
            <q-expansion-item
              expand-separator
              icon="perm_identity"
              :label="menu.pages_id.name"
              style="color: #fff"
            >
              <div v-for="(child, cIndex) in menu.children" :key="cIndex">
                <router-link
                  v-if="child.isMenu"
                  :to="child.url"
                  style="text-decoration: none; color: inherit"
                >
                  <div class="expanded-content">
                    <img />
                    <p class="drawer-text">{{ child.label }}</p>
                  </div>
                </router-link>
              </div>
            </q-expansion-item>
          </q-list>
          <q-list v-else>
            <q-item>
              <router-link
                :to="menu.url"
                style="text-decoration: none; color: inherit"
              >
                <div class="icon-text">
                  <img :src="menu.icon" />
                  <p class="drawer-text">{{ menu.pages_id.name }}</p>
                </div>
              </router-link>
            </q-item>
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
        <MenuBar />
      </q-toolbar>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
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
    </q-page-sticky>
  </q-layout>
</template>

<script setup>
import "../components/SideDrawer/drawer.scss";
import "./DrawerLayout.scss";
import { computed } from "vue";
import MenuBar from "src/components/MenuBar/MenuBar.vue";
import SearchInput from "src/components/SearchInput.vue";
import useUserInfoStore from "stores/modules/userInfo";
import pagesUrl from "../utils/pageUrl.js";

const userInfo = useUserInfoStore();
const menus = computed(() => {
  const pages = userInfo.userProfile.role.pages;
  const pageUrl = pages
    .map((page) => {
      const menu = pagesUrl.find((item) => item.id === page.pages_id?.id);
      page.url = menu?.url;
      page.isMenu = menu?.isMenu;
      page.icon = menu?.icon;
      page.hasSubMenu = menu?.hasSubMenu;
      page.children = menu?.children;
      return page;
    })
    .filter((page) => {
      return page.isMenu;
    });
  return pageUrl;
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
