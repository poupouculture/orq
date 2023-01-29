<template>
  <div class="mt-10">
    <!-- Heading -->
    <div class="flex items-center gap-x-3 text-lg sm:text-2xl font-medium mb-5">
      <q-icon name="keyboard_backspace" />
      <span>Customer Groups</span>
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
        :to="{ name: 'customergroups.create' }"
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
        v-for="group in customerGroups"
        :key="group.name"
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
              <p class="text-gray-400">{{ group.customers.length }} Members</p>
            </div>
          </div>
          <ButtonGroupMenu class="w-2/12 grow-0 justify-end" :id="group.id" />
        </div>
        <!-- customers -->
        <div
          class="flex flex-row justify-between h-16 rounded-lg overflow-hidden bg-white border-gray-300 border shrink-0 w-full"
          v-for="({ customers_id }, i) in group.customers.filter(
            (item) => item.customers_id !== null
          )"
          :key="i"
        >
          <div class="flex items-center w-10/12 flex-nowrap overflow-x-hidden">
            <!-- for while set image default -->
            <img
              :src="
                customers_id.avatar ||
                'http://localhost:9000/src/assets/images/profileavatar.png'
              "
              class="w-10 h-10 rounded-full mx-3"
            />
            <div class="truncate">
              <div class="relative truncate">
                {{ customers_id.first_name }} {{ customers_id.last_name }}
                <span
                  v-if="group.name == 'VIP'"
                  class="absolute top-0 -right-10 bg-primary rounded-xl text-white px-2 py-0.5 text-xs"
                  >VIP</span
                >
              </div>
              <div class="text-gray-400 cursor-pointer truncate">
                {{ customers_id.position }}
              </div>
            </div>
          </div>
          <div class="flex items-center w-2/12 grow-0 justify-end">
            <ButtonCustomerMenu :id="group.id" :customer-id="customers_id.id" />
          </div>
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
import ButtonGroupMenu from "components/UserGroup/ButtonGroupMenu.vue";
import BasePagination from "components/BasePagination.vue";
import { onMounted, reactive, computed } from "vue";
import useCustomerGroupStore from "src/stores/modules/customerGroup";
import ButtonCustomerMenu from "src/components/UserGroup/ButtonCustomerMenu.vue";

const customerGroupStore = useCustomerGroupStore();
const customerGroups = computed(() => customerGroupStore.items);
const meta = computed(() => customerGroupStore.meta);
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
  customerGroupStore.getAll(pagination.rowsPerPage, pagination.page);
};
onMounted(() => {
  customerGroupStore.getAll(pagination.rowsPerPage, pagination.page);
});
</script>
