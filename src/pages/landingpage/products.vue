<script setup>
import { ref } from "vue";
import beef from "assets/images/productCategories/Beef.png";
import chicken from "assets/images/productCategories/chicken.png";
import veal from "assets/images/productCategories/Veal.png";
import lamb from "assets/images/productCategories/Lamb.png";
import pork from "assets/images/productCategories/Pork.png";
import venison from "assets/images/productCategories/Venison.png";
import duck from "assets/images/productCategories/Duck.png";
import Turkey from "assets/images/productCategories/Turkey.png";
import seafood from "assets/images/productCategories/seafood.png";
import dairy from "assets/images/productCategories/Dairy.png";
import pastry from "assets/images/productCategories/Pastry.png";
import grocery from "assets/images/productCategories/Grocery.png";
import vegetablesFruits from "assets/images/productCategories/VegetablesFruits.png";
import gourmet from "assets/images/productCategories/Gourmet.png";
import readytocook from "assets/images/productCategories/ReadyToCook.png";
import readytoeat from "assets/images/productCategories/ReadyToEat.png";
import wine from "assets/images/productCategories/Wine.png";
import other from "assets/images/productCategories/Other.png";

const products = ref([
  {
    label: "Beef",
    img: beef,
  },
  {
    label: "veal",
    img: veal,
  },
  {
    label: "lamb",
    img: lamb,
  },
  {
    label: "pork",
    img: pork,
  },
  {
    label: "venison",
    img: venison,
  },
  {
    label: "chiken",
    img: chicken,
  },
  {
    label: "duck",
    img: duck,
  },
  {
    label: "turkey",
    img: Turkey,
  },
  {
    label: "seefood",
    img: seafood,
  },
  {
    label: "dairy",
    img: dairy,
  },
  {
    label: "pastry & confectionery",
    img: pastry,
  },
  {
    label: "Grocery",
    img: grocery,
  },
  {
    label: "Vegetables & Fruits",
    img: vegetablesFruits,
  },
  {
    label: "Gourmet fine food",
    img: gourmet,
  },
  {
    label: "ready to cook solution",
    img: readytocook,
  },
  {
    label: "ready to eat solution",
    img: readytoeat,
  },
  {
    label: "wine and beverage",
    img: wine,
  },
  {
    label: "other",
    img: other,
  },
]);
</script>

<template>
  <div class="w-full flex justify-center min-h-screen items-center">
    <div class="container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <router-link
        :to="{ name: 'landingproductsdetails' }"
        v-for="(data, index) in products"
        :key="index"
        class="justify-center items-center flex flex-col gap-3"
      >
        <img width="130" :src="data.img" alt="" />

        <span class="text-uppercase">
          {{ data.label }}
        </span>
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
