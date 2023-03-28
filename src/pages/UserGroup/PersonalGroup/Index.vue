<script setup>
import BasePagination from "components/BasePagination.vue";
import SearchTableInput from "src/components/SearchTableInput.vue";
import { onMounted, reactive, computed, ref } from "vue";
import ButtonGroupMenu from "src/components/InternalGroup/ButtonGroupMenu.vue";
import userPersonalGroup from "src/stores/modules/personalGroup";

// State
const { getAll, meta, setMeta } = userPersonalGroup();

const query = ref("");
const searchLoading = ref(false);
const loading = ref(false);
const personalGroups = ref([]);

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
    await fetchPersonalGroups();
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
  await fetchPersonalGroups();
  setMeta({ ...pagination });
};

const fetchPersonalGroups = async () => {
  await getAll({
    rowsPerPage: pagination.rowsPerPage,
    page: pagination.page,
    search: query.value.length ? query.value : undefined,
  }).then((res) => {
    personalGroups.value = res;
  });
};

onMounted(async () => {
  loading.value = true;
  await fetchPersonalGroups();
  loading.value = false;
});
</script>

<template>
  <div class="mt-10">
    <!-- Heading -->
    <div class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5">
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
      <q-circular-progress indeterminate rounded size="30px" color="primary" />
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
                  <p class="text-gray-400">
                    {{ group.customer_groups.length }} Members
                  </p>
                </div>
              </div>
              <ButtonGroupMenu
                class="w-2/12 grow-0 justify-end"
                :id="group.id"
                @add-user="fetchPersonalGroups()"
              />
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
              <div class="flex items-center">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu
                    fit
                    anchor="bottom middle"
                    self="top right"
                    auto-close
                  >
                    <q-list>
                      <q-item clickable>
                        <q-item-section>Map Customer Group</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
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
  </div>
</template>
