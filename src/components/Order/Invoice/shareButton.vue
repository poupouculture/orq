<script setup lang="ts">
import { reactive, ref } from "vue";

interface Props {
  shareInvoice: {
    via: string;
    setDefault: boolean;
  };
}

// State
const whatsappShare = ref<boolean>(false);
const props = defineProps<Props>();
const filter = ref("");
const shareInvoice = reactive({
  via: props.shareInvoice.via,
  setDefault: props.shareInvoice.setDefault,
});
const bgImage = ref(
  "bg-[url('https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80')]"
);

// Table
const columns = ref([
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
    name: "company",
    align: "center",
    label: "Company",
    field: "company",
    sortable: true,
  },
  {
    name: "customerCode",
    align: "center",
    label: "Customer Code",
    field: "customerCode",
  },
  { name: "action", align: "center", label: "Action", field: "action" },
]);

const rows = ref([
  {
    name: "Asim",
    company: "Syn",
    customerCode: 122339828,
  },
  {
    name: "Asim q",
    company: "Syn",
    customerCode: 122339828,
  },
  {
    name: "John q",
    company: "Syn",
    customerCode: 122339828,
  },
]);
</script>

<template>
  <span>
    <q-btn push color="primary" icon-right="send" label="Share via">
      <q-popup-proxy>
        <q-banner>
          <div class="flex flex-col">
            <div class="border-b-2 flex-col flex">
              <div class="gap-3 items-center flex">
                <q-radio
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  size="xs"
                  v-model="shareInvoice.via"
                  val="Email"
                  label="Email Now"
                />
                <q-icon style="color: #ccc; font-size: 1.4em" name="send" />
              </div>
              <q-checkbox
                v-model="shareInvoice.setDefault"
                size="xs"
                val="xs"
                label="Set as default"
              />
            </div>
            <div class="flex-col flex">
              <div class="gap-3 cursor-pointer items-center flex">
                <q-radio
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  size="xs"
                  @update:model-value="whatsappShare = !whatsappShare"
                  label="Whatsapp"
                  v-model="shareInvoice.via"
                  val="Whatsapp"
                />
                <q-icon
                  style="color: #ccc; font-size: 1.4em"
                  name="fa-brands fa-whatsapp"
                />
              </div>
            </div>
          </div>
        </q-banner>
      </q-popup-proxy>
    </q-btn>

    <q-dialog v-model="whatsappShare">
      <q-card class="w-[900px]">
        <q-card-section>
          <div class="text-h6">Customers</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-table
            :rows="rows"
            flat
            :columns="columns"
            :filter="filter"
            row-key="name"
          >
            <template v-slot:top-right>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" @click="onRowClick(props.row)">
                <q-td style="padding: 30px 20px" key="name" :props="props">
                  <div class="flex gap-2">
                    <div
                      class="rounded-full w-10 h-10 bg-cover bg-center"
                      :class="bgImage"
                    />
                    <div class="flex flex-col">
                      <span>{{ props.row.name }}</span>
                      <span class="text-xs text-slate-400">06-06-2023</span>
                    </div>
                  </div>
                </q-td>
                <q-td style="padding: 30px 20px" key="company" :props="props">
                  {{ props.row.company }}
                </q-td>
                <q-td
                  style="padding: 30px 20px"
                  key="customerCode"
                  :props="props"
                >
                  {{ props.row.customerCode }}
                </q-td>
                <q-td style="padding: 30px 20px" key="action" :props="props">
                  <q-btn label="Choose" color="primary" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </span>
</template>

<style scoped></style>
