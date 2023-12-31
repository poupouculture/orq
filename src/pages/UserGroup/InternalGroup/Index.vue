<template>
  <div class="mt-10 px-2">
    <!-- Heading -->
    <div class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5">
      <span>Internal Groups</span>
    </div>
    <!-- Search and Add -->
    <div class="flex items-center justify-between gap-y-2">
      <div class="flex items-center space-x-4">
        <div class="w-52 md:ml-3">
          <SearchTableInput
            :loading="searchLoading"
            @search="searchHandler"
            @reset="resetSearch"
          />
        </div>
        <q-select
          dense
          outlined
          v-model="type"
          :options="typeOptions"
          label="Type"
        />
      </div>
      <q-btn
        :to="{ name: 'internal-group.create' }"
        class="bg-primary text-white"
      >
        <q-icon name="add" class="text-white mr-2" />
        <span>Add</span>
      </q-btn>
    </div>
    <div class="flex items-center justify-center mt-20">
      <BasePagination
        :max="totalPage()"
        :max-pages="10"
        @update-model="changePage"
        v-model="pagination.page"
      />
    </div>
    <!-- Content -->
    <h5 class="uppercase mt-6 text-gray-500">Pinned</h5>
    <div v-if="loading" class="flex justify-center">
      <q-circular-progress indeterminate rounded size="30px" color="primary" />
    </div>
    <div v-else>
      <template v-if="internalGroup.length">
        <div class="grid lg:grid-cols-4 gap-4">
          <!-- Projects -->
          <div
            class="flex flex-col gap-y-2"
            v-for="group in internalGroup"
            :key="group.id"
          >
            <div
              class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 w-full"
            >
              <div
                class="flex items-center w-10/12 flex-nowrap overflow-x-hidden"
              >
                <div
                  class="w-16 h-16 font-inter items-center justify-center flex text-white mr-3 bg-primary text-[14px] font-medium px-2 text-center"
                >
                  UG
                </div>
                <div class="">
                  <div class="">{{ group.name }}</div>
                  <p class="text-gray-400">{{ group.users.length }} Members</p>
                </div>
              </div>
              <ButtonGroupMenu
                @delete-group="fetchInternalGroups()"
                class="w-2/12 grow-0 justify-end"
                :id="group.id"
                :group="group"
                @add-user="fetchInternalGroups()"
              />
            </div>
            <!-- customers -->
            <div
              class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 flex-nowrap w-full"
              v-for="({ directus_users_id }, i) in group.users.filter(
                (item) => item.directus_users_id !== null
              )"
              :key="i"
            >
              <template v-if="directus_users_id">
                <div
                  class="flex items-center w-10/12 flex-nowrap overflow-x-hidden"
                >
                  <!-- for while set image default -->
                  <img
                    :src="directus_users_id.avatar || userAvatar"
                    class="w-10 h-10 rounded-full mx-3"
                  />
                  <div class="truncate">
                    <div class="relative truncate">
                      {{ directus_users_id.first_name }}
                      {{ directus_users_id.last_name }}
                    </div>
                    <div class="text-gray-400 cursor-pointer truncate">
                      {{ directus_users_id.role?.name }} /
                      {{ directus_users_id.email }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <ButtonUserMenu
                    :id="group.id"
                    :user-id="directus_users_id.id"
                    :role="directus_users_id.role?.name"
                    :pagination="pagination"
                  />
                </div>
              </template>
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
          <q-btn @click="resetSearch()" color="primary" size="sm">
            Clear filter
          </q-btn>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import ButtonUserMenu from "components/InternalGroup/ButtonUserMenu.vue";
import BasePagination from "components/BasePagination.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import { onMounted, reactive, computed, ref, watch } from "vue";
import useInternalGroupStore from "src/stores/modules/internalGroup";
import ButtonGroupMenu from "src/components/InternalGroup/ButtonGroupMenu.vue";
import userAvatar from "src/assets/images/profileicon.svg";

const internalGroupStore = useInternalGroupStore();

// Ref
const query = ref("");
const searchLoading = ref(false);
const loading = ref(false);
const type = ref("group");
const typeOptions = ["group"];

// Reactive
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 4,
});

// Computed
const internalGroup = computed(() => internalGroupStore.items);
const meta = computed(() => internalGroupStore.meta);

// Watch
watch(type, () => {
  pagination.page = 1;
  fetchInternalGroups();
});

// Methods
const searchHandler = async (searchValue = "") => {
  query.value = searchValue;
  searchLoading.value = true;
  pagination.page = 1;
  try {
    await fetchInternalGroups();
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
  return Math.ceil(meta.value.filter_count / pagination.rowsPerPage);
};
const changePage = async (val) => {
  pagination.page = val;
  await fetchInternalGroups();
  internalGroupStore.setMeta({ ...pagination });
};

const fetchInternalGroups = async () => {
  type.value = type.value === "individual" ? "personal" : "group";
  await internalGroupStore.getAll({
    rowsPerPage: pagination.rowsPerPage,
    page: pagination.page,
    type: type.value,
    search: query.value.length ? query.value : undefined,
  });
};

onMounted(async () => {
  loading.value = true;
  await fetchInternalGroups();
  loading.value = false;
});
</script>
