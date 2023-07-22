<script setup>
import { ref } from "vue";
import Navbar from "src/components/LandingPage/navbar.vue";
import logo from "assets/images/logo.svg";

const leftDrawerOpen = ref(false);

const openDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <div class="w-full p-5 absolute flex justify-center">
      <div class="container">
        <Navbar @open="openDrawer" />
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
            Copyright {{ new Date().getFullYear() }} Synque.io
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

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-list padding class="rounded-borders">
        <q-item :to="{ name: 'landingcategoriesdetails' }" clickable v-ripple>
          <q-item-section> Categories </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section> Services </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section> Contact </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section> About Us </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </q-layout>
</template>

<style scoped></style>
