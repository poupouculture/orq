<script setup>
import { ref, computed } from "vue";
import Hero from "src/components/LandingPage/hero.vue";
import BaseTable from "src/components/BaseTable.vue";
import CategoryList from "src/components/LandingPage/categoryList.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import useCategories from "src/stores/modules/categories";

const categories = useCategories();

const dialog = ref(false);
const selectedTables = ref([]);
const query = ref("");
const searchLoading = ref(false);

const products = computed(() => {
  return categories.getProducts;
});

const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "description",
    align: "center",
    label: "Specification",
    field: "description",
    sortable: true,
  },
  {
    name: "brand",
    align: "center",
    label: "Brand",
    field: "brand",
    sortable: true,
  },
  {
    name: "country",
    align: "center",
    label: "Country of Origin",
    field: "country",
    sortable: true,
  },
  { name: "cat2", align: "center", label: "Category", field: "cat2" },
];

// Methods

const searchHandler = async (searchValue = "") => {
  query.value = searchValue;

  if (searchValue.length === 0) return;

  searchLoading.value = true;
  try {
    await categories.searchProduct();

    searchLoading.value = false;
  } catch (error) {
    searchLoading.value = false;
  }
};

const resetSearch = () => {
  query.value = "";
};
</script>

<template>
  <Hero class="justify-center">
    <div class="w-full">
      <div
        class="flex flex-col items-center justify-center font-['Inter'] capitalize text-[55px] gap-3 lg:gap-0 lg:text-[70px] font-black text-white"
      >
        <p class="">Products categories details</p>
      </div>
    </div>
  </Hero>

  <div class="w-full flex justify-center min-h-screen mt-20">
    <div class="container grid grid-cols-12 gap-4">
      <div class="col-span-12 lg:col-span-4 flex flex-col p-5">
        <div>
          <SearchTableInput
            :loading="searchLoading"
            @search="searchHandler"
            @reset="resetSearch"
          />
        </div>

        <div class="mt-3 flex flex-col">
          <q-expansion-item
            expand-separator
            label="Categories"
            class="block lg:!hidden"
          >
            <CategoryList />
          </q-expansion-item>

          <div class="hidden lg:!block">
            <CategoryList />
          </div>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-8 p-5">
        <div class="w-full flex justify-end py-4">
          <q-btn
            v-if="selectedTables.length > 0"
            @click="dialog = !dialog"
            push
            color="primary"
            label="Preview"
          >
            <q-badge color="orange" floating>
              {{ selectedTables.length }}
            </q-badge>
          </q-btn>
        </div>

        <BaseTable
          :rows="products"
          :loading="false"
          :columns="columns"
          v-model:selected="selectedTables"
        />
      </div>
    </div>

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pdf Product</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <BaseTable
            :rows="selectedTables"
            :loading="false"
            :columns="columns"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Decline" color="primary" v-close-popup />
          <q-btn flat label="Accept" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped></style>
