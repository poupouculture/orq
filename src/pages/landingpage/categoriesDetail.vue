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

const selectedProducts = ref([]);
const selectedTables = ref([]);
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

const columns = [
  {
    name: "desc",
    required: true,
    label: "Description",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "specification",
    align: "center",
    label: "Specification",
    field: "specification",
    sortable: true,
  },
  {
    name: "country",
    align: "center",
    label: "Country of Origin",
    field: "country",
    sortable: true,
  },
  { name: "category", align: "center", label: "Category", field: "category" },
];

const rows = [
  {
    name: "VEG X3000/X7940/X7941 TATER PUFF USA.(6X5LB)",
    specification: "6X5LB/CTN",
    country: "USA",
    category: "VEGETABLES & FRUITS",
  },
];
</script>

<template>
  <div class="w-full flex justify-center min-h-screen mt-20">
    <div class="container grid grid-cols-12 gap-4">
      <div class="col-span-3 flex flex-col p-5">
        <div>
          <q-input placeholder="Search" outlined dense class="bg-white">
            <template v-slot:prepend>
              <q-icon name="search" color="teal-1" />
            </template>
          </q-input>
        </div>

        <div class="mt-3 flex flex-col">
          <q-expansion-item
            v-for="(product, index) in products"
            :key="index"
            class="w-full"
            :expand-icon-toggle="false"
          >
            <template #header>
              <q-item-section avatar>
                <q-checkbox
                  size="xs"
                  :val="product.label"
                  v-model="selectedProducts"
                />
              </q-item-section>

              <q-item-section class="text-capitalize">
                {{ product.label }}
              </q-item-section>
            </template>

            <q-card>
              <q-card-section class="py-0">
                <q-list dense padding class="rounded-borders">
                  <q-item v-for="item in 5" :key="item" clickable v-ripple>
                    <q-item-section avatar>
                      <q-checkbox size="xs" val="beef1" />
                    </q-item-section>
                    <q-item-section>
                      {{ product.label }} {{ item }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>
      <div class="col-span-9 p-5">
        <q-table
          flat
          bordered
          title="Categories"
          :rows="rows"
          :columns="columns"
          row-key="name"
          selection="multiple"
          v-model:selected="selectedTables"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
