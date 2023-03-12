<script setup lang="ts">
import useInvoice from "src/stores/modules/useInvoices";

const { getInvoice, getCustomer } = useInvoice();
</script>

<template>
  <div class="p-5 mt-5 w-full">
    <div class="flex mb-5 justify-between items-center">
      <div class="flex items-center w-1/2">
        <q-btn push color="primary" icon-right="send" label="Share via">
          <q-popup-proxy>
            <q-banner>
              <q-list>
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon color="primary" name="mail" />
                  </q-item-section>

                  <q-item-section>Email Now</q-item-section>
                </q-item>
                <q-item @click="openDialog = !openDialog" clickable v-ripple>
                  <q-item-section>Whatsapp</q-item-section>
                  <q-item-section avatar>
                    <q-icon color="primary" name="fa-brands fa-whatsapp" />
                  </q-item-section>
                </q-item>
              </q-list>
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
        <q-btn label="Pay this invoice" color="primary" />
      </div>
    </div>

    <q-dialog v-model="openDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Customers</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped></style>
