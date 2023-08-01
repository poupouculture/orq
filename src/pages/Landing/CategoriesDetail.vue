<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { LocalStorage } from "quasar";
import Hero from "src/components/Landing/Hero.vue";
import ProductCategoryNavigation from "src/components/ProductCategoryNavigation";
import BaseTable from "src/components/BaseTable.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import Modal from "src/components/Landing/modal.vue";
import { storeToRefs } from "pinia";
import useCategories from "src/stores/modules/categories";

const categoriesStore = useCategories();
const { allCategories } = storeToRefs(categoriesStore);

const dialog = ref(false);
const downloadPdf = ref(false);
const productDetailModal = ref(false);
const productDetail = ref({});
const selectedTables = ref([]);
const categoriesChoose = ref([]);
const query = ref("");
const searchLoading = ref(false);

const natureBussinses = ref([
  "hotel",
  "restaurant",
  "club",
  "bakery",
  "wholesaler",
  "retailer",
  "private",
  "other",
]);
const formInfo = ref({
  name: "",
  company: "",
  business: "",
  natureBusiness: "",
  titleBussiness: "",
  titleDepartement: "",
  email: "",
  phone: "",
});

const products = computed(() => {
  return categoriesStore.getProducts;
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

// Computed
const allCategoriesValue = computed(() => {
  return allCategories.value;
});

// Watch

watch(categoriesChoose, () => {
  getProduct();
});

// Methods
const searchHandler = async (searchValue = "") => {
  query.value = searchValue;

  if (searchValue.length === 0) return;

  searchLoading.value = true;
  try {
    await getProduct();

    searchLoading.value = false;
  } catch (error) {
    searchLoading.value = false;
  }
};

const checklistparent = async (id) => {
  const getParentExist = categoriesChoose.value.find((item) => item === id);

  if (!getParentExist) return;

  await categoriesStore.getCategoriesDetails(getParentExist);
};

const getProduct = async () => {
  categoriesStore.getProduct(query.value, categoriesChoose.value);
};

const getProductDetails = (data) => {
  productDetail.value = data;
  productDetailModal.value = true;
};

const updateCategories = (value) => {
  categoriesChoose.value = value;
};

const submit = () => {
  console.log("Submit");
};

const resetSearch = () => {
  query.value = "";
};

onMounted(async () => {
  await categoriesStore.getAll();

  await categoriesStore.getCategoriesDetails(
    JSON.parse(LocalStorage.getItem("categoryId"))
  );

  categoriesChoose.value.push(JSON.parse(LocalStorage.getItem("categoryId")));

  getProduct();
});
</script>

<template>
  <Hero class="justify-center">
    <div class="w-full">
      <div
        class="flex flex-col items-center justify-center font-['Inter'] capitalize text-[55px] gap-3 lg:gap-0 lg:text-[70px] font-black text-white"
      >
        <p class="text-center">Products categories details</p>
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
            <ProductCategoryNavigation
              @parentActive="checklistparent"
              @update:modelValue="updateCategories"
              v-for="(data, index) in allCategoriesValue"
              :navigation="data"
              :key="index"
              :category="categoriesChoose"
            />
          </q-expansion-item>

          <div class="hidden lg:!block">
            <ProductCategoryNavigation
              @parentActive="checklistparent"
              @update:modelValue="updateCategories"
              @update:Collapse="data.openCollapse = false"
              v-for="(data, index) in allCategoriesValue"
              :navigation="data"
              :key="index"
              :category="categoriesChoose"
            />
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
          @selectRow="getProductDetails"
          v-model:selected="selectedTables"
        />
      </div>
    </div>

    <Modal
      :dialog="dialog"
      @accept="downloadPdf = true"
      @decline="dialog = false"
      @update:modelValue="dialog = false"
      decline-text="Cancel"
      accept-text="Download"
    >
      <template #head>
        <div class="text-h6">Pdf Product</div>
      </template>

      <BaseTable :rows="selectedTables" :loading="false" :columns="columns" />
    </Modal>

    <Modal
      :dialog="downloadPdf"
      @update:modelValue="downloadPdf = false"
      @decline="downloadPdf = false"
      @accept="submit"
      decline-text="Cancel"
      accept-text="Accept"
    >
      <template #head>
        <div class="text-h6">Contact Information</div>
      </template>

      <div class="flex flex-col">
        <q-form @submit="submit">
          <div class="flex flex-col">
            <label for="account" class="text-lg">
              Name <span class="text-red-500">*</span>
            </label>
            <q-input
              class="mb-3"
              dense
              label="Name"
              type="text"
              debounce="500"
              v-model.trim="formInfo.email"
              :rules="[(val) => !!val || 'Field is required']"
              outlined
            />
          </div>

          <div class="flex flex-col">
            <label for="account" class="text-lg">
              Company <span class="text-red-500">*</span>
            </label>
            <q-input
              class="mb-3"
              dense
              label="Company"
              type="text"
              debounce="500"
              v-model.trim="formInfo.company"
              :rules="[(val) => !!val || 'Field is required']"
              outlined
            />
          </div>

          <div class="flex flex-col">
            <label for="account" class="text-lg">
              Nature & Bussines <span class="text-red-500">*</span>
            </label>
            <q-select
              class="mb-3"
              dense
              label="Company"
              type="text"
              debounce="500"
              :options="natureBussinses"
              v-model.trim="formInfo.natureBusiness"
              :rules="[(val) => !!val || 'Field is required']"
              outlined
            />
          </div>

          <div class="flex flex-col">
            <label for="account" class="text-lg">
              Title of Business <span class="text-red-500">*</span>
            </label>
            <q-input
              class="mb-3"
              dense
              label="Title of Business"
              type="text"
              debounce="500"
              v-model.trim="formInfo.titleBussiness"
              :rules="[(val) => !!val || 'Field is required']"
              outlined
            />
          </div>

          <div class="flex flex-col">
            <label for="account" class="text-lg">
              Title or Department <span class="text-red-500">*</span>
            </label>
            <q-input
              class="mb-3"
              dense
              label="Title or Department"
              type="text"
              debounce="500"
              v-model.trim="formInfo.titleDepartement"
              :rules="[(val) => !!val || 'Field is required']"
              outlined
            />
          </div>

          <div class="flex flex-col">
            <label for="account" class="text-lg">
              Email <span class="text-red-500">*</span>
            </label>
            <q-input
              class="mb-3"
              dense
              label="Email"
              type="email"
              debounce="500"
              v-model.trim="formInfo.email"
              :rules="[(val) => !!val || 'Field is required']"
              outlined
            />
          </div>

          <div class="flex flex-col">
            <label for="account" class="text-lg">
              Phone <span class="text-red-500">*</span>
            </label>
            <q-input
              class="mb-3"
              dense
              label="Phone"
              debounce="500"
              v-model.trim="formInfo.phone"
              :rules="[(val) => !!val || 'Field is required']"
              outlined
            />
          </div>

          <div class="flex flex-col">
            <label for="account" class="text-lg"> Message(optional) </label>
            <q-input
              filled
              clearable
              type="textarea"
              hint="Please leave your message if you would like to have our sales representative to contact you for details"
            />
          </div>
        </q-form>
      </div>
    </Modal>

    <Modal :dialog="productDetailModal" @accept="productDetailModal = false">
      <template #head>
        <div class="text-h6">Pdf Product</div>
      </template>

      <div class="flex flex-col gap-10">
        <p class="mb-0">
          {{ productDetail.name }}
        </p>

        <div class="flex gap-3">
          <p class="">Specification</p>

          <span class="">
            {{ productDetail.description }}
          </span>
        </div>

        <div class="flex gap-3">
          <p class="">Brand</p>

          <span class="">
            {{ productDetail.brand }}
          </span>
        </div>

        <div class="flex gap-3">
          <p class="">Country Of Origin</p>

          <span class="">
            {{ productDetail.country }}
          </span>
        </div>

        <div class="flex gap-3">
          <p class="">Category</p>

          <span class="">
            {{ productDetail.cat2 }}
          </span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped></style>
