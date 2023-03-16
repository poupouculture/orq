<script setup lang="ts">
import useInvoice from "src/stores/modules/useInvoices";
import { ref } from "vue";

const bgImage = ref(
  "bg-[url('https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80')]"
);

const { getInvoice, getCustomer } = useInvoice();
const openDialog = ref(false);
const send = ref(false);
const check = ref(true);
const filter = ref("");

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
  <div class="p-5 mt-5 w-full">
    <div class="flex mb-5 justify-between items-center">
      <div class="flex items-center w-1/2">
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
                      v-model="send"
                      val="Email"
                      label="Email Now"
                    />

                    <q-icon style="color: #ccc; font-size: 1.4em" name="send" />
                  </div>
                  <q-checkbox
                    size="xs"
                    v-model="check"
                    val="xs"
                    label="Set as default"
                  />
                </div>

                <div class="flex-col flex">
                  <div
                    @click="openDialog = !openDialog"
                    class="gap-3 cursor-pointer items-center flex"
                  >
                    <q-radio
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      size="xs"
                      v-model="send"
                      val="Whatsapp"
                    />
                    <span>Whatsapp </span>
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
      </div>
      <q-icon size="25px" color="primary" name="cloud_download" />
    </div>
    <div class="bg-white w-full rounded-lg p-5">
      <p class="font-medium">
        TO: <span class="font-bold pl-2">{{ getCustomer.email }}</span>
      </p>

      <div class="flex flex-col text-[#111827] justify-center items-center p-5">
        <p class="font-semibold text-lg">BALANCE DUE</p>
        <p class="font-normal text-sm">{{ getInvoice.totalPrice.label }}</p>
        <p class="font-normal py-3 text-sm">Thanks for choosing us!</p>

        <div class="flex py-4 gap-3 flex-col">
          <div class="flex gap-3 justify-between">
            <div class="w-[100px]">
              <p class="text-sm font-normal">Invoice</p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">{{ getInvoice.invoiceNumber }}</p>
            </div>
          </div>

          <div class="flex gap-3 justify-between">
            <div class="w-[100px]">
              <p class="text-sm font-normal">Due</p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">{{ getInvoice.dueDate }}</p>
            </div>
          </div>
          <div class="flex gap-3 justify-between">
            <div class="w-[100px]">
              <p class="text-sm font-normal">Total</p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">
                {{ getInvoice.totalPrice.label }}
              </p>
            </div>
          </div>
          <div class="flex gap-3 justify-between">
            <div class="w-[100px]">
              <p class="text-sm font-normal">Balance</p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">
                {{ getInvoice.totalPrice.label }}
              </p>
            </div>
          </div>
          <div class="flex gap-3 justify-between">
            <div class="w-[100px]">
              <p class="text-sm font-normal">Status</p>
            </div>
            <div class="flex w-[100px] items-center">
              <div class="border-b-4 border-dotted w-full"></div>
            </div>
            <div class="w-[100px] ml-4">
              <p class="text-sm font-normal">{{ getInvoice.status.value }}</p>
            </div>
          </div>
        </div>
        <q-btn
          :to="{ name: 'order.payment' }"
          label="Pay this invoice"
          color="primary"
        />
      </div>
    </div>

    <q-dialog v-model="openDialog">
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
  </div>
</template>

<style scoped></style>
