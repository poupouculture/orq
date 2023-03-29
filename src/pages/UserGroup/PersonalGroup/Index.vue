<script setup>
import BasePagination from "components/BasePagination.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import { onMounted, reactive, computed, ref } from "vue";
import userPersonalGroup from "src/stores/modules/personalGroup";

// State
const { getAll, meta, setMeta, addRelation, getCustomerGroup } =
  userPersonalGroup();

const query = ref("");
const searchLoading = ref(false);
const loading = ref(false);
const personalGroups = ref([]);
const singleItem = ref([]); // no needed
const customerGroups = ref([]);
const userGroupId = ref("");
const tableSelected = ref([]);
const drawer = ref(false);

const allPersonalGroups = computed(() => personalGroups.value);
const metaPage = computed(() => meta);
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 4,
});

// Methods
const searchHandler = async (searchValue = "") => {
  query.value = searchValue;
  searchLoading.value = true;
  try {
    await init();
    searchLoading.value = false;
  } catch (error) {
    searchLoading.value = false;
  }
};

const resetSearch = () => {
  query.value = "";
  searchHandler();
};

const totalPage = () => {
  return Math.ceil(metaPage.value.filter_count / pagination.rowsPerPage);
};
const changePage = async (val) => {
  pagination.page = val;
  await init();
  setMeta({ ...pagination });
};

const openDrawer = (id) => {
  userGroupId.value = id;
  drawer.value = !drawer.value;
};

const closeDrawer = () => {
  userGroupId.value = "";
  singleItem.value = [];
  drawer.value = !drawer.value;
};

const newRelations = () => {
  addRelation(userGroupId.value, tableSelected.value[0].id).then((res) => {
    console.log(res);
  });
};

const collectedCustomerGroup = (array) => {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i].id === a[j].id) a.splice(j--, 1);
    }
  }
  customerGroups.value = a;
};

const init = async () => {
  const newArray = [];
  const secondArray = [];

  await getCustomerGroup().then((res) => {
    res.data.forEach((item) => {
      secondArray.push(item);
    });
  });

  await getAll({
    rowsPerPage: pagination.rowsPerPage,
    page: pagination.page,
    search: query.value.length ? query.value : undefined,
  }).then((res) => {
    res.forEach((item) => {
      item.customer_groups.forEach((data) => {
        newArray.push({
          id: data.customer_groups_id.id,
          name: data.customer_groups_id.name,
          status: data.customer_groups_id.status,
        });
      });
    });
    // customerGroups.value =  mergeArray(newArray, secondArray)
    personalGroups.value = res;
  });

  collectedCustomerGroup(newArray, secondArray);
};

onMounted(async () => {
  loading.value = true;
  await init();
  loading.value = false;
});

// Table
const headerColumns = [
  {
    name: "name",
    align: "left",
    label: "Name",
    field: "name",
    classes: "text-black capitalize",
    style: "max-width: 10%",
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "Role",
    field: "status",
    sortable: true,
    classes: "text-black capitalize",
  },
];
</script>

<template>
  <q-layout view="hHh lpR fFf" class="mt-10">
    <q-page-container>
      <q-page padding>
        <div
          class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5"
        >
          <q-icon name="keyboard_backspace" />
          <span>Personal Groups </span>
        </div>
        <!-- Search and Add -->
        <div class="flex items-center justify-between">
          <div class="w-52 ml-3">
            <SearchTableInput
              :loading="searchLoading"
              @search="searchHandler"
              @reset="resetSearch"
            />
          </div>
        </div>
        <!-- Content -->
        <h5 class="uppercase mt-6 text-gray-500">Pinned Projects</h5>
        <div v-if="loading" class="flex justify-center">
          <q-circular-progress
            indeterminate
            rounded
            size="30px"
            color="primary"
          />
        </div>
        <div v-else>
          <template v-if="allPersonalGroups.length">
            <div class="grid lg:grid-cols-4 gap-4">
              <!-- Projects -->
              <div
                class="flex flex-col gap-y-2"
                v-for="group in allPersonalGroups"
                :key="group.id"
              >
                <div
                  class="grid grid-cols-12 h-16 rounded-lg overflow-hidden bg-white border-gray-300 border w-full"
                >
                  <div
                    class="col-span-2 flex text-white items-center justify-center bg-primary"
                  >
                    {{ group.name }}
                  </div>

                  <div
                    class="col-span-8 px-3 flex justify-center items-start flex-col"
                  >
                    <div class="truncate w-full">{{ group.name }}</div>
                    <p class="text-gray-400">
                      {{ group.customer_groups.length }} Members
                    </p>
                  </div>

                  <div class="col-span-2 flex items-center">
                    <q-btn color="grey-7" round flat icon="more_vert">
                      <q-menu
                        fit
                        anchor="bottom middle"
                        self="top right"
                        auto-close
                      >
                        <q-list>
                          <q-item clickable @click="openDrawer(group.id)">
                            <q-item-section>Map Customer Group</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>

                <!-- customers -->
                <div
                  class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 flex-nowrap"
                  v-for="(personal, index) in group.customer_groups"
                  :key="index"
                >
                  <div
                    class="flex items-center w-10/12 flex-nowrap overflow-x-hidden"
                  >
                    <img
                      :src="
                        personal.customer_groups_id.avatar ||
                        'src/assets/images/profileavatar.png'
                      "
                      class="w-10 h-10 rounded-full mx-3"
                    />
                    <div class="truncate">
                      <div class="relative truncate">
                        {{ personal.customer_groups_id.name }}
                      </div>
                      <div class="text-gray-400 cursor-pointer truncate">
                        {{ personal.customer_groups_id.status }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center mt-20">
              <BasePagination
                :max="totalPage()"
                :max-pages="10"
                @update-model="changePage"
                v-model="pagination.page"
              />
            </div>
          </template>
          <div v-else class="text-center text-gray-700">
            <div class="text-lg">No data found</div>
            <template v-if="query">
              <div class="text-gray-500 mb-2">
                Adjust or clear search filters to see results.
              </div>
              <q-btn @click="resetSearch()" color="primary" size="sm"
                >Clear filter</q-btn
              >
            </template>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-drawer
      overlay
      :width="800"
      :breakpoint="500"
      v-model="drawer"
      side="right"
    >
      <!-- drawer content -->
      <div class="h-full flex justify-center items-center">
        <div class="h-[90vh] w-full flex flex-col p-10">
          <div class="flex items-center justify-between">
            <SearchTableInput
              :loading="searchLoading"
              @search="searchHandler"
              @reset="resetSearch"
            />
            <q-btn
              :disable="!tableSelected.length > 0"
              @click="newRelations"
              round
              color="primary"
              size="md"
              icon="done"
            />
          </div>

          <div class="mt-10">
            {{ customerGroups }}
            <q-table
              v-model:selected="tableSelected"
              :rows="customerGroups"
              :columns="headerColumns"
              selection="single"
              row-key="name"
            />
          </div>
        </div>
      </div>

      <div class="q-mini-drawer-hide absolute" style="top: 15px; left: -16px">
        <q-btn
          @click="closeDrawer"
          dense
          round
          unelevated
          color="primary"
          icon="chevron_right"
        />
      </div>
    </q-drawer>
  </q-layout>
</template>
