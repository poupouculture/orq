<script setup>
import { ref, onMounted, computed } from "vue";
import useCategories from "src/stores/modules/categories";

const categoriesStore = useCategories();

// Ref
const selectedCategories = ref([]);
const selectedProducts = ref([]);

// Computed
const allCategories = computed(() => {
  return categoriesStore.allCategories;
});

// Methods
const checkList = (categories) => {
  const currentId = selectedCategories.value.find(
    (item) => item === categories.id
  );

  categories.openCollapse = true;

  if (currentId === undefined) {
    categories.openCollapse = false;
    if (categories.product.length === 0) return;

    categories.product.forEach((product) => {
      const productIndex = selectedProducts.value.findIndex(
        (item) => item === product.product_id.id
      );

      selectedProducts.value.splice(productIndex, 1);
      categoriesStore.getProducts.splice(productIndex, 1);
    });
  } else {
    if (categories.product.length === 0) return;

    categories.product.forEach((product) => {
      selectedProducts.value.push(product.product_id.id);
    });

    categoriesStore.storeProduct(categories.product);
  }
};

onMounted(() => {
  categoriesStore.getAll();
});
</script>

<template>
  <q-expansion-item
    v-for="(categories, index) in allCategories"
    :key="index"
    class="w-full"
    v-model="categories.openCollapse"
    :expand-icon-toggle="false"
  >
    <template #header>
      <q-item-section avatar>
        <q-checkbox
          @click="checkList(categories)"
          size="xs"
          :val="categories.id"
          v-model="selectedCategories"
        />
      </q-item-section>

      <q-item-section class="text-capitalize">
        {{ categories.name }}
      </q-item-section>
    </template>

    <q-card>
      <q-card-section class="py-0">
        <q-list dense padding class="rounded-borders">
          <q-item
            v-for="(item, index) in categories.product"
            :key="index"
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-checkbox
                v-model="selectedProducts"
                size="xs"
                :val="item.product_id.id"
              />
            </q-item-section>
            <q-item-section>
              {{ item.product_id.cat2 }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<style scoped></style>
