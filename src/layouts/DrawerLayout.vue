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
            <input
              type="text"
              v-model="input"
              placeholder="Search"
              class="input"
            />
          </div>

          <router-link
            v-for="(menu, index) in menus"
            :key="index"
            :to="menu.url"
            style="text-decoration: none; color: inherit"
          >
            <div class="icon-text">
              <img :src="menu.icon" />
              <p class="drawer-text">{{ menu.pages_id.name }}</p>
            </div>
          </router-link>
        </div>
      </q-scroll-area>
    </q-drawer>
    <q-page-container class="main-container"><router-view /> </q-page-container>
  </q-layout>
</template>

<script setup>
import "../components/SideDrawer/drawer.scss";
import "./DrawerLayout.scss";
import { computed } from "vue";
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
      return page;
    })
    .filter((page) => {
      return page.isMenu;
    });
  return pageUrl;
});

// const logout = () => {
//   LocalStorage.remove("userinfo");
//   userInfo.setUserProfile(null);
//   userInfo.setUserInfo({
//     access_token: "",
//     expires: null,
//     refresh_token: "",
//   });
//   router.push("/login");
// };
</script>
