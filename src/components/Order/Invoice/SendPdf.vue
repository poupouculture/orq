<script setup lang="ts">
import useInvoice from "src/stores/modules/useInvoices";
import { ref } from "vue";

const { getInvoice, getCustomer } = useInvoice();
const openDialog = ref(false);
const send = ref(false);
const check = ref(true);
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
