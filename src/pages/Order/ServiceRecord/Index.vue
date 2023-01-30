<template>
  <div class="service-record q-px-lg py-5">
    <h2 class="text-h5 font-semibold mt-3">Service Record</h2>
    <MessageBox
      title="About service records"
      :message="message"
      :show="show"
      @click="close()"
    />
    <!-- Search -->
    <div class="flex items-center justify-between my-5">
      <div class="w-52">
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
      <q-btn class="bg-primary text-white">
        <q-icon name="add" class="text-white mr-2" />
        <span>Add</span>
      </q-btn>
    </div>

    <BaseTable
      :rows="rows"
      :total-count="pagination.totalCount"
      :page="pagination.page"
      :rows-per-page="pagination.rowsPerPage"
      :columns="columns"
      :loading="loading"
      @changePage="changePage"
    >
      <template v-slot:body-cell-customer="props">
        <q-td :props="props">
          <q-icon name="fa-solid fa-headphones" />
          <span class="ml-2">{{ props.value }}</span>
          <p class="text-xs text-gray-400 mt-1 font-normal">
            <span class="description -ml-1">测试1</span>
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-employee="props">
        <q-td class="align-text-top" :props="props">
          <q-icon name="fa-regular fa-user" />
          <span class="ml-2"
            >{{ props.value.first_name }} {{ props.value.last_name }}</span
          >
        </q-td>
      </template>

      <template v-slot:body-cell-channel="props">
        <q-td><img :src="img" class="w-10 h-10" :alt="props.value" /></q-td>
      </template>

      <template v-slot:body-cell-reference_number="props">
        <q-td>
          <span>{{ props.value || "-" }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-date_created="props">
        <q-td>
          <span>{{ format(new Date(props.value), "Y-MM-d HH:mm:ss") }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-detail="props">
        <q-td
          ><RouterLink
            :to="{
              name: 'order.service-record.detail',
              params: { id: props.value },
            }"
            class="details text-blue-800 px-2 md:px-0"
            >Details</RouterLink
          ></q-td
        >
      </template>

      <template v-slot:bottom-row>
        <div class="placeholder h-24"></div>
      </template>

      <template v-slot:bottom>
        <Pagination
          :total="97"
          :current="pagination.page"
          :size="pagination.rowsPerPage"
        />
      </template>
    </BaseTable>
  </div>
</template>
<script setup>
import MessageBox from "src/components/MessageBox.vue";
import Pagination from "src/components/Pagination.vue";
import useServiceRecordStore from "src/stores/modules/serviceRecord";
import img from "src/assets/images/whatsapp.png";
import { format } from "date-fns";
import BaseTable from "src/components/BaseTable.vue";

import { ref, onMounted, computed } from "vue";
const message = `Every time you talk with a customer, a "service record" will be automatically generated, and each record contains at least - more conversation records to form a complete service information for you to query Close it.`;

const serviceRecordStore = useServiceRecordStore();
const show = ref(true),
  columns = [
    {
      name: "index",
      label: "#",
      field: "index",
      align: "left",
      headerStyle: "width: 80px",
      headerClasses: "header",
    },
    {
      name: "customer",
      label: "Customer",
      field: "customer_name",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "employee",
      label: "Agent",
      field: "employee",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "channel",
      label: "Channel",
      field: "channel",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "reference_number",
      label: "Session number",
      field: "reference_number",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "date_created",
      label: "Start time",
      field: "date_created",
      align: "left",
      headerStyle: "width: 260px",
      headerClasses: "header",
    },
    {
      name: "detail",
      label: "",
      field: "id",
      align: "left",
      headerStyle: "width: 100px;",
      headerClasses: "header",
    },
  ],
  rows = computed(() => serviceRecordStore.getItems),
  pagination = ref({
    page: 1,
    rowsPerPage: 6,
    totalCount: 0,
  });

onMounted(async () => {
  await serviceRecordStore.getAll();
});
function close(state) {
  show.value = state;
}
</script>

<style lang="scss" scoped>
:deep {
  .header {
    color: #9a9aaf;
  }
  .q-icon {
    justify-content: flex-end;
    margin-top: -2px;
  }
  .q-td {
    padding: 8px 0;
  }
  .q-table th:nth-child(n + 2),
  td:nth-child(n + 2) {
    padding-left: 0;
  }
}

.description {
  display: inline-block;
  transform: scale(0.8);
}

.details:hover {
  text-decoration: underline;
}
</style>
