<template>
  <div class="service-record q-px-lg py-5">
    <h2 class="text-h5">Service Record</h2>

    <MessageBox
      title="About service records"
      :message="message"
      :show="show"
      @click="close"
    />

    <InputForm />

    <q-table
      :rows="rows"
      :columns="columns"
      :pagination="pagination"
      class="opacity-80"
      row-key="index"
    >
      <template v-slot:body-cell-Abstract="props">
        <q-td :props="props">
          <q-icon name="fa-solid fa-headphones" />
          <span class="ml-2">{{ props.value }}</span>
          <p class="text-xs text-gray-400 mt-1 font-normal">
            <span class="description -ml-1">测试1</span>
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-auth="props">
        <q-td class="align-text-top" :props="props">
          <q-icon name="fa-regular fa-user" />
          <span class="ml-2">{{ props.value }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-Transaction>
        <q-td><img :src="img" class="w-10 h-10" alt="wechat" /></q-td>
      </template>

      <template v-slot:body-cell-Operation>
        <q-td><a href="#" class="details text-blue-800">Details</a></q-td>
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
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

const message = `Every time you talk with a customer, a "service record" will be automatically generated, and each record contains at least - more conversation records to form a complete service information for you to query Close it.`;

export default defineComponent({
  name: "ServiceRecord",
});
</script>

<script setup>
import MessageBox from "src/components/MessageBox.vue";
import InputForm from "src/components/InputForm.vue";
import Pagination from "src/components/Pagination.vue";
import img from "assets/wechat.png";

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
      name: "Abstract",
      label: "Abstract",
      field: "Abstract",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "auth",
      label: "",
      field: "auth",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "Transaction",
      label: "Transaction",
      field: "Transaction",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "ServiceResults",
      label: "Service results",
      field: "ServiceResults",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "StartTime",
      label: "Start time",
      field: "StartTime",
      align: "left",
      headerStyle: "width: 260px",
      headerClasses: "header",
    },
    {
      name: "Operation",
      label: "Operation",
      field: "Operation",
      align: "left",
      headerStyle: "width: 100px",
      headerClasses: "header",
    },
  ],
  rows = [],
  pagination = ref({
    page: 1,
    rowsPerPage: 6,
  });

for (let i = 1; i <= 20; i++) {
  rows.push({
    index: i,
    Abstract: "Chester Buchanan",
    auth: "Liveagen",
    ServiceResults: "Service results",
    StartTime: "2022-12-09 12:00:00",
  });
}

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
