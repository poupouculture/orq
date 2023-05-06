<script lang="ts" setup>
import { onMounted, reactive, computed, ref, watch } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { PersonalItem } from "src/types/PersonalGroups";
import userPersonalGroup from "src/stores/modules/personalGroup";
import BasePagination from "components/BasePagination.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import {
  deleteRelationship,
  getRelationship,
  addRelationship,
} from "src/api/PersonalGroup";
enum DrawerTypeEnum {
  MAP = "map",
  DELETE = "delete",
}

const userGroupOptions = [
  {
    label: "Individual",
    value: "personal",
  },
  {
    label: "Group",
    value: "group",
  },
];
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
const relationLoading = ref(false);
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
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
    userGroup?.customer_groups
      .filter((item) => item.customer_groups_id != null)
      .map((item) => item.customer_groups_id) || []
  );
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

const openDrawer = async (id: string, type: string) => {
  userGroupId.value = id;
  drawer.value = true;
  drawerType.value = type;
  paginationCustomers.page = 1;
  if (type === DrawerTypeEnum.DELETE && selectedUserGroup.value.length < 1) {
    return personalGroupStore.resetCustomerGroup();
  }
  await getCustomerGroupData();
};

const closeDrawer = () => {
  userGroupId.value = "";
  drawer.value = !drawer.value;
  tableSelected.value = [];
};

const newRelations = async () => {
  relationLoading.value = true;
  if (drawerType.value === DrawerTypeEnum.DELETE) {
    await deleteRelations();
    relationLoading.value = false;
    return;
  }

  const populateCustomerGroupId = tableSelected.value.map((item) => {
    return {
      customer_groups_id: item.id,
      user_groups_id: userGroupId.value,
    };
  });

  await addRelationship(populateCustomerGroupId);
  await getPersonalGroupData();
  paginationCustomers.page = 1;
  await getCustomerGroupData();
  tableSelected.value = [];
  relationLoading.value = false;
  Notify.create({
    message: "success",
    type: "positive",
    position: "top",
    color: "primary",
  });
};

const deleteRelations = async () => {
  const { data } = await getRelationship(userGroupId.value);

  const getDataArray: [] = [];

  tableSelected.value.forEach((element) => {
    const getData = data.find(
      (item: any) => item.customer_groups_id === element.id
    );

    if (getData) getDataArray.push(getData.id);
  });

  await deleteRelationship(getDataArray);
  await getPersonalGroupData();
  paginationCustomers.page = 1;
  await getCustomerGroupData();
  tableSelected.value = [];
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
const cgType = ref("personal");
const getCustomerGroupData = async () => {
  tableLoading.value = true;
  await personalGroupStore.getCustomerGroup(
    paginationCustomers.rowsPerPage,
    paginationCustomers.page,
    cgType.value,
    queryCustomers.value,
    selectedUserGroup.value,
    drawerType.value === DrawerTypeEnum.DELETE
      ? "filter[id][_in]"
      : "filter[id][_nin]"
  );
  tableLoading.value = false;
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
    name: "type",
    align: "left",
    label: "Type",
    field: "type",
    sortable: true,
    classes: "text-black capitalize",
  },
  // {
  //   name: "customer_code",
  //   align: "left",
  //   label: "Customer Code",
  //   field: "customers[0].customers_id.customer_code",
  //   sortable: true,
  //   classes: "text-black capitalize",
  // },
];

watch(drawerType, () => {
  tableSelected.value = [];
});
watch(userGroupType, () => {
  changePage(1);
  getPersonalGroupData();
});
const tableLoading = ref(false);
watch(cgType, () => {
  tableLoading.value = true;
  paginationCustomers.page = 1;
  tableSelected.value = [];
  getCustomerGroupData();
});
const rightDrawerWidth = ref(800);
if (window.innerWidth < 768) {
  rightDrawerWidth.value = window.innerWidth;
}
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
            dense
            outlined
            v-model="userGroupType"
            option-value="value"
            option-label="label"
            :options="userGroupOptions"
            map-options
            emit-value
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
        <!-- Pagination -->
        <div class="flex items-center justify-center mt-4">
          <BasePagination
            :max="totalPage"
            :max-pages="10"
            @update-model="changePage"
            v-model="pagination.page"
          />
        </div>
        <!-- Content -->
        <h5 class="uppercase mt-6 text-gray-500">User Groups</h5>
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
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <!-- Projects -->
              <div
                class="flex flex-col gap-y-2"
                v-for="group in allPersonalGroups"
                :key="group.id"
              >
                <div
                  class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 w-full"
                >
                  <div
                    class="flex items-center w-10/12 flex-nowrap overflow-x-hidden"
                  >
                    <div
                      class="w-16 h-16 items-center justify-center flex text-white mr-3 bg-primary text-xs px-2 text-center"
                    >
                      {{ group.name }}
                    </div>
                    <div class="truncate">
                      <div class="truncate">{{ group.name }}</div>
                    </div>
                  </div>

                  <div class="w-2/12 grow-0 flex items-center">
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
                  class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 w-full"
                  v-for="(personal, index) in group.customer_groups"
                  :key="index"
                >
                  <div
                    class="flex items-center w-10/12 flex-nowrap overflow-x-hidden"
                  >
                    <div class="truncate ml-4">
                      <div class="relative truncate">
                        {{ personal.customer_groups_id?.name }}
                      </div>
                      <div class="text-gray-400 cursor-pointer truncate">
                        {{ personal.customer_groups_id?.source }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
      :width="rightDrawerWidth"
      :breakpoint="768"
      v-model="drawer"
      side="right"
    >
      <!-- drawer content -->
      <div class="h-full flex justify-center items-center w-full">
        <div class="min-h-[90vh] w-full flex flex-col p-5 md:p-10">
          <div class="flex mb-4 lg:hidden">
            <q-btn
              @click="drawer = false"
              round
              color="primary"
              size="sm"
              icon="close"
            />
          </div>
          <h5 class="text-lg">Customer Group</h5>
          <div class="flex items-center justify-between mt-3">
            <SearchTableInput
              :loading="searchLoading"
              @search="searchHandlerCustomers"
              @reset="resetSearchCustomers"
            />
            <div class="flex items-center space-x-5">
              <q-select
                dense
                outlined
                v-model="cgType"
                :options="userGroupOptions"
                option-value="value"
                option-label="label"
                map-options
                emit-value
                label="Type"
              />
              <q-btn
                :disable="tableSelected.length === 0"
                @click="newRelations"
                :loading="relationLoading"
                round
                color="primary"
                size="md"
                icon="done"
              />
            </div>
          </div>
          <div class="mt-10" v-if="allCustomerGroups.length > 0">
            <q-table
              v-model:selected="tableSelected"
              :rows="allCustomerGroups"
              :columns="headerColumns"
              :loading="tableLoading"
              selection="multiple"
              row-key="id"
              class="mb-3"
              :pagination="{
                rowsPerPage: 10,
              }"
              v-if="allCustomerGroups.length"
            >
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>
            </q-table>
            <BasePagination
              :max="totalPageCustomers()"
              :max-pages="5"
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
