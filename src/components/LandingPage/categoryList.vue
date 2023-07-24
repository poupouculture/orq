<script setup>
import { ref, computed, onMounted } from "vue";
import { LocalStorage } from "quasar";
import { storeToRefs } from "pinia";
import useCategories from "src/stores/modules/categories";

const categoriesStore = useCategories();
const { allCategories } = storeToRefs(categoriesStore);

// Ref
const selectedCategories = ref([]);
const selectedProducts = ref([]);
const selectedV2 = ref([]);
const selectedV3 = ref([]);

// Computed
const allCategoriesValue = computed(() => {
  return allCategories.value;
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

// const productsChoose = (value) => {
//   if (value.active) {
//     categoriesStore.deleteProduct(value.product_id.id);

//     value.active = false;
//   } else {
//     value.active = true;
//     categoriesStore.storeProduct([value]);
//   }
// };

onMounted(() => {
  const categoryId = JSON.parse(LocalStorage.getItem("categoryId"));

  if (categoryId) selectedCategories.value.push(categoryId);
});
</script>

<template>
  <q-expansion-item
    v-for="(categories, parentIndex) in allCategoriesValue"
    :key="parentIndex"
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
        <q-list
          v-for="(lvl2, lvl2Index) in categories.children"
          :key="lvl2Index"
          dense
          padding
          class="rounded-borders"
        >
          <q-item
            clickable
            v-ripple
            v-if="!lvl2.hasOwnProperty('openCollapse')"
          >
            <q-item-section avatar>
              <q-checkbox
                v-model="selectedV2"
                size="xs"
                :val="{ parentIndex, lvl2Index }"
              />
            </q-item-section>
            <q-item-section>
              {{ lvl2.name }}
            </q-item-section>
          </q-item>

          <template v-else>
            <q-expansion-item
              v-model="lvl2.openCollapse"
              :expand-icon-toggle="false"
              class="w-full"
            >
              <template #header>
                <q-item-section avatar>
                  <q-checkbox
                    size="xs"
                    :val="{ parentIndex, lvl2Index }"
                    v-model="selectedV2"
                  />
                </q-item-section>

                <q-item-section class="text-capitalize">
                  {{ lvl2.name }}
                </q-item-section>
              </template>

              <q-card>
                <q-card-section class="py-0">
                  <q-list
                    v-for="(lvl3, lvl3Index) in lvl2.children"
                    :key="lvl3Index"
                  >
                    <q-item clickable v-ripple>
                      <q-item-section avatar>
                        <q-checkbox
                          v-model="selectedV3"
                          :val="{ parentIndex, lvl2Index, lvl3Index }"
                          size="xs"
                        />
                      </q-item-section>

                      <q-item-section>
                        {{ lvl3.name }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </template>
        </q-list>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<style scoped></style>
