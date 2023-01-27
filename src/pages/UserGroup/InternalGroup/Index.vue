<template>
  <div class="mt-10">
    <!-- Heading -->
    <div class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5">
      <q-icon name="keyboard_backspace" />
      <span>Internal Groups</span>
    </div>
    <!-- Search and Add -->
    <div class="flex items-center justify-between">
      <div class="w-52 ml-3">
        <q-input
          placeholder="Search Items..."
          bg-color="transparent"
          outlined
          dense
          class="border-gray-400"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-gray-400" />
          </template>
          <template v-slot:append>
            <q-icon name="filter_list" class="text-gray-400" />
          </template>
        </q-input>
      </div>
      <q-btn
        :to="{ name: 'customergroups-internal-group.create' }"
        class="bg-primary text-white"
      >
        <q-icon name="add" class="text-white mr-2" />
        <span>Add</span>
      </q-btn>
    </div>
    <!-- Content -->
    <h5 class="uppercase mt-6 text-gray-500">Pinned Projects</h5>
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
          <div class="flex items-center w-10/12 flex-nowrap overflow-x-hidden">
            <div
              class="w-16 h-16 items-center justify-center flex text-white mr-3 bg-primary text-xs px-2 text-center"
            >
              {{ group.name }}
            </div>
            <div class="truncate">
              <div class="truncate">{{ group.name }}</div>
              <p class="text-gray-400">{{ group.users.length }} Members</p>
            </div>
          </div>
          <ButtonGroupMenu class="w-2/12 grow-0 justify-end" :id="group.id" />
        </div>
        <!-- customers -->
        <div
          class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 flex-nowrap"
          v-for="({ directus_users_id }, i) in group.users"
          :key="i"
        >
          <template v-if="directus_users_id">
            <div
              class="flex items-center w-10/12 flex-nowrap overflow-x-hidden"
            >
              <!-- for while set image default -->
              <img
                :src="
                  directus_users_id.avatar ||
                  'http://localhost:9000/src/assets/images/profileavatar.png'
                "
                class="w-10 h-10 rounded-full mx-3"
              />
              <div class="truncate">
                <div class="relative truncate">
                  {{ directus_users_id.first_name }}
                  {{ directus_users_id.last_name }}
                </div>
                <div class="text-gray-400 cursor-pointer truncate">
                  {{ directus_users_id.role?.name }}
                </div>
              </div>
            </div>
            <div class="flex items-center">
              <ButtonUserMenu :id="group.id" :user-id="directus_users_id.id" />
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center mt-20">
      <BasePagination
        :max="totalPage()"
        :max-pages="10"
        @update-model="changePage"
      />
    </div>
  </div>
</template>

<script setup>
import ButtonUserMenu from "components/InternalGroup/ButtonUserMenu.vue";
import BasePagination from "components/BasePagination.vue";
import { onMounted, reactive, computed } from "vue";
import useInternalGroupStore from "src/stores/modules/internalGroup";
import ButtonGroupMenu from "src/components/InternalGroup/ButtonGroupMenu.vue";

const internalGroupStore = useInternalGroupStore();
const internalGroup = computed(() => internalGroupStore.items);
const meta = computed(() => internalGroupStore.meta);
const pagination = reactive({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 4,
});
const totalPage = () => {
  return Math.ceil(meta.value.total_count / pagination.rowsPerPage);
};
const changePage = (val) => {
  pagination.page = val;
  internalGroupStore.getAll(pagination.rowsPerPage, pagination.page);
  internalGroupStore.setMeta({ ...pagination });
};
onMounted(() => {
  internalGroupStore.getAll(pagination.rowsPerPage, pagination.page);
});
</script>
