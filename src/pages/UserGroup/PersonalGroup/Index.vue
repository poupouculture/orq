<script lang="ts" setup>
import { onMounted, reactive, computed, ref, watch } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { PersonalItem } from "src/types/PersonalGroups";
import userPersonalGroup from "src/stores/modules/personalGroup";
import BasePagination from "components/BasePagination.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import { deleteRelationship, getRelationship } from "src/api/PersonalGroup";
enum DrawerTypeEnum {
  MAP = "map",
  DELETE = "delete",
}

const userGroupOptions = ["personal", "group"];
// State
const personalGroupStore = userPersonalGroup();
const { personalGroups, customerGroups } = storeToRefs(personalGroupStore);
const drawerLis = reactive([
  {
    text: "Map Customer Group",
    type: DrawerTypeEnum.MAP,
  },
  {
    text: "Delete Customer Relationship",
    type: DrawerTypeEnum.DELETE,
  },
]);
const query = ref("");
const queryCustomers = ref("");
const searchLoading = ref(false);
const loading = ref(false);
const userGroupId = ref("");
const tableSelected: Ref<PersonalItem[]> = ref([]);
const drawer = ref(false);
const drawerType = ref("");
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 4,
});
const paginationCustomers = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
const userGroupType = ref("personal");

const allPersonalGroups = computed(() => personalGroups.value.data);
const allCustomerGroups = computed(() => customerGroups.value.data);

const meta = computed(() => personalGroups.value.meta);
const metaCustomerGroups = computed(() => customerGroups.value.meta);

const totalPage = computed(() =>
  Math.ceil(meta.value.filter_count / pagination.rowsPerPage)
);

const totalPageCustomers = () => {
  if (metaCustomerGroups.value) {
    return Math.ceil(
      metaCustomerGroups.value.filter_count / paginationCustomers.rowsPerPage
    );
  }
};
const selectedUserGroup = computed(() => {
  const userGroup = allPersonalGroups.value.find(
    (item) => item.id === userGroupId.value
  );
  return (
    userGroup?.customer_groups.map((item) => item.customer_groups_id.id) || []
  );
});

const remainingGroups = computed(() => {
  const items = allCustomerGroups.value.filter(
    (item) =>
      selectedUserGroup.value.includes(item.id) ===
      (drawerType.value === DrawerTypeEnum.DELETE)
  );
  return items;
});

// Methods
const searchHandler = async (searchValue = "") => {
  query.value = searchValue;
  searchLoading.value = true;
  try {
    await getPersonalGroupData();
    searchLoading.value = false;
  } catch (error) {
    searchLoading.value = false;
  }
};

const searchHandlerCustomers = async (searchValue = "") => {
  queryCustomers.value = searchValue;
  searchLoading.value = true;
  try {
    await getCustomerGroupData();
    searchLoading.value = false;
  } catch (error) {
    searchLoading.value = false;
  }
};

const resetSearch = () => {
  query.value = "";
  searchHandler();
};

const resetSearchCustomers = () => {
  queryCustomers.value = "";
  searchHandlerCustomers();
};

const changePage = (val: number) => {
  pagination.page = val;
  getPersonalGroupData();
};

const changePageCustomers = (val: number) => {
  paginationCustomers.page = val;
  getCustomerGroupData();
};

const openDrawer = (id: string, type: string) => {
  // getCustomerGroupData();
  userGroupId.value = id;
  drawer.value = true;
  drawerType.value = type;
};

const closeDrawer = () => {
  userGroupId.value = "";
  drawer.value = !drawer.value;
  tableSelected.value = [];
};

const newRelations = async () => {
  if (drawerType.value === DrawerTypeEnum.DELETE) {
    deleteRelations();
    return;
  }
  await personalGroupStore.addRelation(
    userGroupId.value,
    tableSelected.value[0].id
  );
  await getPersonalGroupData();
  Notify.create({
    message: "success",
    type: "positive",
    position: "top",
    color: "primary",
  });
};

const deleteRelations = async () => {
  const { data } = await getRelationship(userGroupId.value);
  const { id } =
    data.find(
      (item: any) => item.customer_groups_id === tableSelected.value[0]?.id
    ) || {};
  await deleteRelationship(id);
  await getPersonalGroupData();
  Notify.create({
    message: "success",
    type: "positive",
    color: "primary",
    position: "top",
  });
};

const getPersonalGroupData = async () => {
  loading.value = true;
  await personalGroupStore.getAll(
    pagination.rowsPerPage,
    pagination.page,
    query.value,
    userGroupType.value
  );
  loading.value = false;
};
const getCustomerGroupData = async () => {
  await personalGroupStore.getCustomerGroup(
    paginationCustomers.rowsPerPage,
    paginationCustomers.page,
    queryCustomers.value
  );
};

onMounted(() => {
  loading.value = true;
  getPersonalGroupData();
  getCustomerGroupData();
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
    label: "Status",
    field: "status",
    sortable: true,
    classes: "text-black capitalize",
  },
];

watch(drawerType, () => {
  tableSelected.value = [];
});
watch(userGroupType, () => {
  changePage(1);
  getPersonalGroupData();
});
</script>

<template>
  <q-layout view="hHh lpR fFf" class="mt-10">
    <q-page-container>
      <q-page padding>
        <div
          class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5"
        >
          <q-icon name="keyboard_backspace" />
          <span>Relationship Mapping </span>
        </div>
        <!-- Search and Add -->
        <div class="flex items-center justify-between">
          <q-select
            standout
            v-model="userGroupType"
            :options="userGroupOptions"
            label="Type"
          />
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
                    <!-- <p class="text-gray-400">
                      {{ group.customer_groups.length }} Members
                    </p> -->
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
                          <q-item
                            v-for="item in drawerLis"
                            :key="item.type"
                            clickable
                            @click="openDrawer(group.id, item.type)"
                          >
                            <q-item-section>{{ item.text }}</q-item-section>
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
                      :src="// personal.customer_groups_id.avatar ||
                      'src/assets/images/profileavatar.png'"
                      class="w-10 h-10 rounded-full mx-3"
                    />
                    <div class="truncate">
                      <div class="relative truncate">
                        {{ personal.customer_groups_id?.name }}
                      </div>
                      <div class="text-gray-400 cursor-pointer truncate">
                        {{ personal.customer_groups_id?.status }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center mt-20">
              <BasePagination
                :max="totalPage"
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
        <div class="min-h-[90vh] w-full flex flex-col p-10">
          <div class="flex items-center justify-between">
            <SearchTableInput
              :loading="searchLoading"
              @search="searchHandlerCustomers"
              @reset="resetSearchCustomers"
            />
            <q-btn
              :disable="tableSelected.length <= 0"
              @click="newRelations"
              round
              color="primary"
              size="md"
              icon="done"
            />
          </div>
          <div class="mt-10" v-if="remainingGroups.length > 0">
            <q-table
              v-model:selected="tableSelected"
              :rows="remainingGroups"
              :columns="headerColumns"
              selection="single"
              row-key="name"
              class="mb-3"
              v-if="remainingGroups.length"
            />
            <BasePagination
              :max="totalPageCustomers()"
              :max-pages="10"
              @update-model="changePageCustomers"
              v-model="paginationCustomers.page"
            />
          </div>
          <div v-else class="h-[50vh] flex justify-center items-center">
            No Data Available
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
